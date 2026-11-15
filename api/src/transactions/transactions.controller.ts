import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest } from 'express';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@Request() req: ExpressRequest) {
    const userId = (req.user as any).userId;
    return this.transactionsService.findAll(userId);
  }
}