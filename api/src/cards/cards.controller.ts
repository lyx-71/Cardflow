import { Controller, Get, Post, Delete, Body, UseGuards, Request, Param } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest } from 'express';

@Controller('cards')
@UseGuards(AuthGuard('jwt'))
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Request() req: ExpressRequest, @Body() dto: CreateCardDto) {
    const userId = (req.user as any).userId;
    return this.cardsService.create(userId, dto);
  }

  @Post('pay')
  pay(
    @Request() req: ExpressRequest, 
    @Body() body: { walletId: string, amount: number, service: string, targetCurrency: string }
  ) {
    const userId = (req.user as any).userId;
    return this.cardsService.pay(userId, body.walletId, body.amount, body.service, body.targetCurrency);
  }

  @Get()
  findAll(@Request() req: ExpressRequest) {
    const userId = (req.user as any).userId;
    return this.cardsService.findAllMasked(userId);
  }

  @Get(':id')
  findOne(@Request() req: ExpressRequest, @Param('id') cardId: string) {
    const userId = (req.user as any).userId;
    return this.cardsService.findOne(userId, cardId);
  }

  @Post(':id/toggle-freeze')
  toggleFreeze(@Request() req: ExpressRequest, @Param('id') cardId: string) {
    const userId = (req.user as any).userId;
    return this.cardsService.toggleFreeze(userId, cardId);
  }

  @Delete(':id')
  remove(@Request() req: ExpressRequest, @Param('id') cardId: string) {
    const userId = (req.user as any).userId;
    return this.cardsService.remove(userId, cardId);
  }
}