import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  name: string;

  @IsEmail()
  email: string;

  cpf: string;

  @IsNotEmpty()
  password: string;
}
