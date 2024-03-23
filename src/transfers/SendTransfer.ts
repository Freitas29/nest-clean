import Result from '../common/Result';
import { Transfers } from './Transfers';

export type SendTranferInput = {
  sender: string;
  receiver: string;
  amount: number;
};

export interface ISendTransferUseCase {
  sendTranfer(input: SendTranferInput): Promise<Result<Transfers>>;
}
