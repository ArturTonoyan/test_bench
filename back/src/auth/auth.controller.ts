import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import {
  RegisterSuccessResponse,
  RegisterErrorResponse,
  InternalErrorResponse,
} from './interfaces/response.interface';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<
    RegisterSuccessResponse | RegisterErrorResponse | InternalErrorResponse
  > {
    try {
      const result = await this.authService.register(registerDto);

      if ('data' in result) {
        return result.data;
      } else {
        return result.error;
      }
    } catch (error) {
      throw new InternalServerErrorException({
        code: 'INTERNAL_ERROR',
        message: 'Произошла внутренняя ошибка сервера. Попробуйте позже.',
      });
    }
  }
}
