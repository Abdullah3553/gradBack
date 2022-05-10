import {ArrayNotEmpty, IsDateString, IsEmail, IsNotEmpty} from "class-validator";
import { AuthenticatorSignatureDto } from "src/authenticator/dto/authenticator-signature.dto";

export class RegisterDto
{
    @IsNotEmpty()
    username:string

    @IsNotEmpty()
    @IsEmail()
    email:string

    @ArrayNotEmpty()
    authenticators:AuthenticatorSignatureDto[]

    @IsNotEmpty()
    @IsDateString()
    birth_date:string
}
