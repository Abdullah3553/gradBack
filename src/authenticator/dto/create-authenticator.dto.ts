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
  access_token: string; // @TODO Remove access token from here and from db
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  userId: number;
  @IsNotEmpty()
  authentication_methodId: number;
}
