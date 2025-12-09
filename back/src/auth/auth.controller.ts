import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import {
  RegisterSuccessResponse,
  RegisterErrorResponse,
  InternalErrorResponse,
} from './interfaces/response.interface';

@ApiTags('auth')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        firstName: { type: 'string', example: 'Иван' },
        lastName: { type: 'string', example: 'Иванов' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'VALIDATION_ERROR' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'email' },
              message: { type: 'string', example: 'Поле E-mail не соответствует маске' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'INTERNAL_ERROR' },
        message: { type: 'string', example: 'Произошла внутренняя ошибка сервера. Попробуйте позже.' },
      },
    },
  })
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
