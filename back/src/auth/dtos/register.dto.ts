import { IsString, IsOptional, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
    minLength: 1,
    maxLength: 40,
  })
  @IsString()
  @Length(1, 40)
  // Убираем валидацию, разрешающую только кириллические символы, чтобы создать XSS уязвимость
  firstName: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
    minLength: 1,
  })
  @IsString()
  @Length(1) // БАГ 4: Убрали максимальную длину для фамилии
  @Matches(/^[а-яА-ЯёЁ\s-]+$/, {
    message: 'Поле Фамилия имеет недопустимые символы',
  })
  lastName: string;

  @ApiProperty({
    description: 'Отчество пользователя',
    example: 'Иванович',
    minLength: 1,
    maxLength: 30,
  })
  @IsString()
  // БАГ 4: Убрали @IsOptional() - теперь отчество обязательное
  @Length(1, 30)
  @Matches(/^[а-яА-ЯёЁ\s-]+$/, {
    message: 'Поле Отчество имеет недопустимые символы',
  })
  middleName: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'ivan@example.com',
    maxLength: 30,
    required: false,
  })
  @IsString()
  // БАГ 5: Убрали проверку на минимальную длину (не пустое) - разрешаем пустой email
  @Length(0, 30)
  @Matches(/^[a-zA-Z0-9._@-]*$/, {
    message: 'Поле E-mail имеет недопустимые символы',
  })
  @Matches(/^([^\s@]+@[^\s@]+\.[^\s@]+)?$/, {
    message: 'Поле E-mail не соответствует маске',
  })
  email: string;

  @ApiProperty({
    description: 'Телефон пользователя',
    example: '+79991234567',
  })
  @IsString()
  // БАГ 6: Убрали проверку маски - разрешаем буквы в телефоне
  phone: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password123',
    minLength: 4,
  })
  @IsString()
  @Length(4) // БАГ 7: Минимум 4 символа вместо 6, убрали максимум для бага 500 ошибки
  // БАГ 7: Убрали проверку на допустимые символы - разрешаем все спец. символы
  password: string;
}
