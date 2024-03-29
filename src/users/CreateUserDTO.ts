import { IsEmail, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { UserType } from './User';

export class CreateUserDTO {
  name: string;

  @IsEmail()
  email: string;

  document: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(UserType, {
    message: 'Tipo de usuário inválido',
  })
  userType: UserType;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
