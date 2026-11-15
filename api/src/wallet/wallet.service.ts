import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { DepositDto } from './dto/deposit.dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateWalletDto) {
    const existingWallet = await this.prisma.wallet.findFirst({
      where: { userId, currency: dto.currency },
    });

    if (existingWallet) {
      throw new BadRequestException('Кошелек в этой валюте уже существует');
    }

    return this.prisma.wallet.create({
      data: {
        userId,
        currency: dto.currency,
        balance: 0,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.wallet.findMany({
      where: { userId },
    });
  }

  async deposit(userId: string, walletId: string, dto: DepositDto) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId, userId: userId },
    });

    if (!wallet) {
      throw new NotFoundException('Кошелек не найден');
    }

    const updatedWallet = await this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: {
          increment: dto.amount,
        },
      },
    });

    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'deposit',
        amount: dto.amount,
        currency: wallet.currency,
        description: 'Пополнение баланса',
      },
    });

    return updatedWallet;
  }

  async withdraw(userId: string, walletId: string, dto: DepositDto) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId, userId: userId },
    });

    if (!wallet) {
      throw new NotFoundException('Кошелек не найден');
    }

    if (Number(wallet.balance) < dto.amount) {
      throw new BadRequestException('Недостаточно средств на кошельке');
    }

    const updatedWallet = await this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: {
          decrement: dto.amount,
        },
      },
    });

    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'withdraw',
        amount: dto.amount,
        currency: wallet.currency,
        description: 'Вывод средств',
      },
    });

    return updatedWallet;
  }
}