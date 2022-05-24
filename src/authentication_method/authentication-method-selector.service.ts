import {Injectable} from "@nestjs/common";
import {PasswordMethod} from "./methods/password/password.method";
import {OtpMethod} from "./methods/OTP/otp.method";

@Injectable()
export class AuthenticationMethodSelectorService {
    constructor(
        private readonly passwordMethod:PasswordMethod,
        private readonly otpMethod:OtpMethod
    ) {}
    async methodSelector(authenticator, username:string, storedSignature:string, sentSignature:string){
        switch (authenticator.authentication_method.title) {
            // case 'lol' :/*for testing*/
            //     return this.passwordMethod.Compare(username, storedSignature, sentSignature)/*for testing*/
            case 'password' :
                const res =this.passwordMethod.compare(storedSignature, sentSignature)
                return res.valid
            case 'face_recognition':
                return true
            case 'fingerprint_recognition':
                return true
            case 'otp':
                const response = await this.otpMethod.compare(storedSignature, sentSignature, authenticator.id)
                return response.valid
            case 'qr':
                return true
        }
    }
}
