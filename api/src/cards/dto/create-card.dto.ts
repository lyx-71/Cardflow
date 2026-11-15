import { IsUUID } from 'class-validator';

export class CreateCardDto {
  @IsUUID('4', { message: 'Некорректный ID кошелька' })
  walletId: string;
}