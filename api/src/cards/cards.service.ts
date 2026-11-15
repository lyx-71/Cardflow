import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CryptoService } from '../common/crypto.service';
import { CreateCardDto } from './dto/create-card.dto';
import { generateCardNumber } from './luhn.util';
import { calculateConversion } from '../common/currency.util';

@Injectable()
export class CardsService {
  constructor(
    private prisma: PrismaService,
    private crypto: CryptoService,
  ) {}

  async create(userId: string, dto: CreateCardDto) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: dto.walletId, userId },
    });

    if (!wallet) {
      throw new NotFoundException('Кошелек не найден');
    }

    const bin = '400000';
    const number = generateCardNumber(bin);
    const cvv = Math.floor(100 + Math.random() * 900).toString();

    const currentDate = new Date();
    const expiryMonth = currentDate.getMonth() + 1;
    const expiryYear = currentDate.getFullYear() + 3;

    const encryptedNumber = this.crypto.encrypt(number);
    const encryptedCvv = this.crypto.encrypt(cvv);

    const card = await this.prisma.card.create({
      data: {
        userId,
        walletId: wallet.id,
        number: encryptedNumber,
        cvv: encryptedCvv,
        expiryMonth,
        expiryYear,
      },
    });

    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'card_issue',
        amount: 0,
        currency: wallet.currency,
        description: `Выпуск карты **** ${number.slice(-4)}`,
      },
    });

    return {
      id: card.id,
      number,
      cvv,
      expiryMonth,
      expiryYear,
      status: card.status,
    };
  }

  async findAllMasked(userId: string) {
    const cards = await this.prisma.card.findMany({
      where: { userId },
      include: { wallet: true },
      orderBy: { createdAt: 'desc' },
    });

    return cards.map((card) => {
      const decryptedNumber = this.crypto.decrypt(card.number);
      return {
        id: card.id,
        maskedNumber: `**** **** **** ${decryptedNumber.slice(-4)}`,
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        status: card.status,
        walletId: card.walletId,
        currency: card.wallet.currency,
      };
    });
  }

  async findOne(userId: string, cardId: string) {
    const card = await this.prisma.card.findFirst({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new NotFoundException('Карта не найдена');
    }

    return {
      id: card.id,
      number: this.crypto.decrypt(card.number),
      cvv: this.crypto.decrypt(card.cvv),
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      status: card.status,
    };
  }

  async toggleFreeze(userId: string, cardId: string) {
    const card = await this.prisma.card.findFirst({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new NotFoundException('Карта не найдена');
    }

    const newStatus = card.status === 'active' ? 'frozen' : 'active';

    return this.prisma.card.update({
      where: { id: cardId },
      data: { status: newStatus },
    });
  }

  async remove(userId: string, cardId: string) {
    const card = await this.prisma.card.findFirst({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new NotFoundException('Карта не найдена');
    }

    return this.prisma.card.delete({
      where: { id: cardId },
    });
  }

  async pay(userId: string, walletId: string, amount: number, service: string, targetCurrency: string) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId, userId },
    });

    if (!wallet) {
      throw new NotFoundException('Кошелек не найден');
    }

    const walletCurrency = wallet.currency;
    const finalAmount = calculateConversion(amount, targetCurrency, walletCurrency);

    if (finalAmount === null) {
      throw new Error(`Оплата в ${targetCurrency} с кошелька ${walletCurrency} недоступна`);
    }

    if (Number(wallet.balance) < finalAmount) {
      throw new Error(`Недостаточно средств. Требуется ${finalAmount.toFixed(2)} ${walletCurrency}`);
    }

    const card = await this.prisma.card.findFirst({
      where: { walletId, userId, status: 'active' },
    });

    if (!card) {
      throw new Error(`У вас нет активной карты, привязанной к ${walletCurrency}-кошельку`);
    }

    await this.prisma.wallet.update({
      where: { id: walletId },
      data: { balance: { decrement: finalAmount } },
    });

    const description = walletCurrency === targetCurrency 
      ? `Оплата ${service}`
      : `Оплата ${service} (${amount} ${targetCurrency} по курсу ${(finalAmount / amount).toFixed(2)})`;

    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'payment',
        amount: finalAmount,
        currency: walletCurrency,
        description: description,
      },
    });

    return { 
      message: 'Оплата прошла успешно',
      deducted: finalAmount,
      currency: walletCurrency
    };
  }
}