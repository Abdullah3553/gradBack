import { IsString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateAuthenticatorDto {
  @IsString()
  @IsNotEmpty()
  signature: string;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  priority: number;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  userId: number;
  @IsNotEmpty()
  authentication_methodId: number;
}
