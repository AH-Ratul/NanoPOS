import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthGuard } from './auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      message: 'Registration successful',
      data: user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: any,
  ) {
    const result = await this.authService.login(loginDto);

    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? "none" : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      data: result.user,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: any) {
    response.clearCookie('access_token');
    return {
      message: 'Logout successful',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  @UseGuards(AuthGuard)
  async getAuthMe(@Req() req: any) {
    const { id } = req.user;

    const user = await this.authService.getAuthMe(id);

    return {
      message: 'Get me Successfully',
      data: user,
    };
  }
}
