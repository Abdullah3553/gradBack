import {ArrayNotEmpty, IsNotEmpty, IsString} from "class-validator";
import {AuthenticatorSignatureDto} from "../../authenticator/dto/authenticator-signature.dto";

export class LoginDto{

    @IsNotEmpty()
    @IsString()
    username:string

    @ArrayNotEmpty()
    authenticators:AuthenticatorSignatureDto[]

}
