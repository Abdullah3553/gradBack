import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthenticationMethodDto {

  id?: number;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  file_path?: string;

  revresable:boolean
}
