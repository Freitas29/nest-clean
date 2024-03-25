import { HttpClient } from '../common/ports/Http';
import { AuthorizationGatewayAdapter } from './AuthorizationGatewayAdapter';
import { HttpSuccessFake } from '../common/ports/HttpSuccessFake';

describe('AuthorizationGatewayAdapter', () => {
  it('Deve retornar que foi autorizado', async () => {
    const httpFake: HttpClient = new HttpSuccessFake();

    jest.spyOn(httpFake, 'get').mockResolvedValueOnce({
      statusCode: 200,
      body: {
        message: 'Autorizado',
      },
    });

    const tranfer = new AuthorizationGatewayAdapter(httpFake);

    const result = await tranfer.authorize();

    expect(result).toBeTruthy();
  });

  it('Deve retornar que foi não foi autorizado sem erro na request', async () => {
    const httpFake: HttpClient = new HttpSuccessFake();

    jest.spyOn(httpFake, 'get').mockResolvedValueOnce({
      statusCode: 200,
      body: {
        message: 'Não autorizado',
      },
    });

    const tranfer = new AuthorizationGatewayAdapter(httpFake);

    const result = await tranfer.authorize();

    expect(result).toBeFalsy();
  });

  it('Deve retornar que foi não foi autorizado ao ter erro na request', async () => {
    const httpFake: HttpClient = new HttpSuccessFake();

    jest.spyOn(httpFake, 'get').mockResolvedValueOnce({
      statusCode: 400,
    });

    const tranfer = new AuthorizationGatewayAdapter(httpFake);

    const result = await tranfer.authorize();

    expect(result).toBeFalsy();
  });
});
