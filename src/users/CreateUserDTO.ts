import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  name: string;

  @IsEmail()
  email: string;

  document: string;

  @IsNotEmpty()
  password: string;
}
