export interface IAutorizationTransferResponse {
  message: 'Autorizado';
}

export interface IAuthorizationTranferGateway {
  authorize(): Promise<boolean>;
}
