import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthenticationMethodDto {
  @IsInt()
  id: number; // TODO @AseelElsohly
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  file_path?: string;
}
