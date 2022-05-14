import {Injectable} from "@nestjs/common";
import {PasswordMethod} from "./methods/password/password";

@Injectable()
export class AuthenticationMethodSelectorService {
    constructor(
        private readonly passwordMethod:PasswordMethod
    ) {}
    methodSelector(authentication_method, username:string, storedSignature:string, sentSignature:string){
        switch (authentication_method.title) {
            case 'lol' :/*for testing*/
                return this.passwordMethod.Compare(username, storedSignature, sentSignature)/*for testing*/
            case 'password' :
                return this.passwordMethod.Compare(username, storedSignature, sentSignature)
            case 'face_recognition':
                return true
            case 'fingerprint_recognition':
                return true
            case 'otp':
                return true
            case 'qr':
                return true
        }
    }
}
