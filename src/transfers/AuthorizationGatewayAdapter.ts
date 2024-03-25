import { Inject } from '@nestjs/common';
import { HttpClient } from '../common/ports/Http';
import {
  IAuthorizationTranferGateway,
  IAutorizationTransferResponse,
} from './AuthorizationGateway';

export class AuthorizationGatewayAdapter
  implements IAuthorizationTranferGateway
{
  constructor(@Inject('httpClient') private readonly http: HttpClient) {}

  async authorize(): Promise<boolean> {
    const response = await this.http.get<IAutorizationTransferResponse>({
      url: 'https://run.mocky.io/v3/5794d450-d2e2-4412-8131-73d0293ac1cc',
    });

    if (response.statusCode !== 200) return false;

    if (response.body.message !== 'Autorizado') return false;

    return true;
  }
}
