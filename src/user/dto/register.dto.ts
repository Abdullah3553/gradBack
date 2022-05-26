import {ArrayNotEmpty, IsDateString, IsEmail, IsNotEmpty} from "class-validator";
import { AuthenticatorSignatureDto } from "src/authenticator/dto/authenticator-signature.dto";
import {CreateUserDto} from "./create-user.dto";

export class RegisterDto extends CreateUserDto
{

    @ArrayNotEmpty()
    authenticators:AuthenticatorSignatureDto[]

}


