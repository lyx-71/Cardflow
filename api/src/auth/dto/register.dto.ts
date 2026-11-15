import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  name: string; 

  @IsString()
  @MinLength(8, { message: 'Пароль должен быть минимум 8 символов' })
  password: string;
}