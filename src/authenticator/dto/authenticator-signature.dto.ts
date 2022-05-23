import { IsString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';


export class AuthenticatorSignatureDto{
  
  @IsString()
  @IsNotEmpty()
  signature: string;
  
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  priority: number;

  @IsNotEmpty()
  authentication_methodId: number;
}
