import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaService } from '../prisma.service';
import { CryptoService } from '../common/crypto.service';

@Module({
  controllers: [CardsController],
  providers: [CardsService, PrismaService, CryptoService],
})
export class CardsModule {}