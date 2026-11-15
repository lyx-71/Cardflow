import { Controller, Post, Body, Get, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.login(dto);
    
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { user: result.user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: ExpressResponse) {
    res.clearCookie('access_token');
    return { message: 'Выход выполнен' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Request() req: ExpressRequest) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  changePassword(@Request() req: ExpressRequest, @Body() dto: any) {
    const userId = (req.user as any).userId;
    return this.authService.changePassword(userId, dto);
  }
}