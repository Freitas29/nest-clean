import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTranferDTO {
  @IsNotEmpty()
  sender_id: string;

  @IsNotEmpty()
  receiver_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
}
