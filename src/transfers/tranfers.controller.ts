import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateTranferDTO } from './CreateTranferDTO';
import { ISendTransferUseCase } from './SendTransfer';

@Controller('transfers')
export class TransfersController {
  @Inject('ISendTransferUseCase')
  private readonly createTransfer: ISendTransferUseCase;

  @Post('create')
  async create(@Body() createUserDTO: CreateTranferDTO, @Res() res: Response) {
    const result = await this.createTransfer.sendTranfer({
      amount: createUserDTO.amount,
      receiver: createUserDTO.receiver_id,
      sender: createUserDTO.sender_id,
    });

    if (result.isFailure) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        error: result.error,
      });
    } else {
      return res.status(HttpStatus.OK).send(result.getValue());
    }
  }
}
