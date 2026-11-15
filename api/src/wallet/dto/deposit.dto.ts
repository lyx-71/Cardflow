import { IsNumber, Min } from 'class-validator';

export class DepositDto {
  @IsNumber()
  @Min(1, { message: 'Минимальная сумма пополнения - 1' })
  amount: number;
}