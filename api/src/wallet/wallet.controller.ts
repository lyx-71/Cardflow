import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { DepositDto } from './dto/deposit.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest } from 'express';

@Controller('wallet')
@UseGuards(AuthGuard('jwt'))
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Request() req: ExpressRequest, @Body() dto: CreateWalletDto) {
    const userId = (req.user as any).userId;
    return this.walletService.create(userId, dto);
  }

  @Get()
  findAll(@Request() req: ExpressRequest) {
    const userId = (req.user as any).userId;
    return this.walletService.findAll(userId);
  }

  @Post(':id/deposit')
  deposit(
    @Request() req: ExpressRequest,
    @Param('id') walletId: string,
    @Body() dto: DepositDto,
  ) {
    const userId = (req.user as any).userId;
    return this.walletService.deposit(userId, walletId, dto);
  }

  @Post(':id/withdraw')
  withdraw(
    @Request() req: ExpressRequest,
    @Param('id') walletId: string,
    @Body() dto: DepositDto,
  ) {
    const userId = (req.user as any).userId;
    return this.walletService.withdraw(userId, walletId, dto);
  }
}