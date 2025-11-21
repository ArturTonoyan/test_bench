import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
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
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<
    RegisterSuccessResponse | RegisterErrorResponse | InternalErrorResponse
  > {
    try {
      const result = await this.authService.register(registerDto);

      if ('data' in result) {
        // For successful registration, return 201 Created
        return result.data;
      } else {
        // For validation errors, throw HttpException with 400 status
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException({
        code: 'INTERNAL_ERROR',
        message: 'Произошла внутренняя ошибка сервера. Попробуйте позже.',
      });
    }
  }
}
