import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthenticationMethodDto {

  @IsNotEmpty()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  file_path?: string;
}
