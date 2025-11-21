import { IsString, IsOptional, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(1, 30)
  @Matches(/^[а-яА-ЯёЁ\s-]+$/, {
    message: 'Поле Имя имеет недопустимые символы',
  })
  firstName: string;

  @IsString()
  @Length(1, 30)
  @Matches(/^[а-яА-ЯёЁ\s-]+$/, {
    message: 'Поле Фамилия имеет недопустимые символы',
  })
  lastName: string;

  @IsString()
  @IsOptional()
  @Length(0, 30)
  @Matches(/^[а-яА-ЯёЁ\s-]*$/, {
    message: 'Поле Отчество имеет недопустимые символы',
  })
  middleName?: string;

  @IsString()
  @Length(1, 30)
  @Matches(/^[a-zA-Z0-9._@-]+$/, {
    message: 'Поле E-mail имеет недопустимые символы',
  })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Поле E-mail не соответствует маске',
  })
  email: string;

  @IsString()
  @Matches(/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/, {
    message: 'Поле Номер телефона не соответствует маске',
  })
  phone: string;

  @IsString()
  @Length(6, 12)
  @Matches(/^[a-zA-Z0-9!@#\-+=]+$/, {
    message: 'Поле Пароль имеет недопустимые символы',
  })
  password: string;
}
