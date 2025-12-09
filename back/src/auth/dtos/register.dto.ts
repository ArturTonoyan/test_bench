import { IsString, IsOptional, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(1, 40)
  // Убираем валидацию, разрешающую только кириллические символы, чтобы создать XSS уязвимость
  firstName: string;

  @IsString()
  @Length(1) // БАГ 4: Убрали максимальную длину для фамилии
  @Matches(/^[а-яА-ЯёЁ\s-]+$/, {
    message: 'Поле Фамилия имеет недопустимые символы',
  })
  lastName: string;

  @IsString()
  // БАГ 4: Убрали @IsOptional() - теперь отчество обязательное
  @Length(1, 30)
  @Matches(/^[а-яА-ЯёЁ\s-]+$/, {
    message: 'Поле Отчество имеет недопустимые символы',
  })
  middleName: string;

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

  @IsString()
  // БАГ 6: Убрали проверку маски - разрешаем буквы в телефоне
  phone: string;

  @IsString()
  @Length(4, 12) // БАГ 7: Минимум 4 символа вместо 6
  // БАГ 7: Убрали проверку на допустимые символы - разрешаем все спец. символы
  password: string;
}
