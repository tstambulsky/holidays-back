
export class ForgotPasswordDTO {
  readonly email: string;
}

export interface TokenCodeDTO {
    readonly code: string;
}


export class ChangePasswordDTO {
  readonly email: string;
  readonly password: string;
}
