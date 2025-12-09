import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { User } from './interfaces/user.interface';
import {
  RegisterSuccessResponse,
  RegisterErrorResponse,
} from './interfaces/response.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private users: User[] = [];

  async register(
    registerDto: RegisterDto,
  ): Promise<
    | { success: true; data: RegisterSuccessResponse }
    | { success: false; error: RegisterErrorResponse }
  > {
    try {
      // БАГ 11: 500 ошибка при отправке пароля более 12 символов
      if (registerDto.password && registerDto.password.length > 12) {
        throw new InternalServerErrorException({
          code: 'INTERNAL_ERROR',
          message: 'Произошла внутренняя ошибка сервера. Попробуйте позже.',
        });
      }

      // Check if email or phone already exists
      const existingUser = this.users.find(
        (user) =>
          user.email === registerDto.email || user.phone === registerDto.phone,
      );

      if (existingUser) {
        const errors = [];
        if (existingUser.email === registerDto.email) {
          errors.push({
            field: 'email',
            message: 'Пользователь с таким email уже существует',
          });
        }
        if (existingUser.phone === registerDto.phone) {
          errors.push({
            field: 'phone',
            message: 'Пользователь с таким номером телефона уже существует',
          });
        }

        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            errors,
          },
        };
      }

      // Create new user
      const newUser: User = {
        id: uuidv4(),
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        middleName: registerDto.middleName,
        email: registerDto.email,
        phone: registerDto.phone,
        password: registerDto.password, // In a real application, this should be hashed
      };

      this.users.push(newUser);

      // Return success response
      return {
        success: true,
        data: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException({
        code: 'INTERNAL_ERROR',
        message: 'Произошла внутренняя ошибка сервера. Попробуйте позже.',
      });
    }
  }
}
