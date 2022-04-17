import { IsString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateAuthenticatorDto {
  @IsString()
  @IsNotEmpty()
  signature: string;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  priority: number;
  @IsString()
  @IsNotEmpty()
  access_token: string;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  userId: number;
}
