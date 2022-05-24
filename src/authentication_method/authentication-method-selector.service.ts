import {Injectable} from "@nestjs/common";
import {PasswordMethod} from "./methods/password/password.method";
import {OtpMethod} from "./methods/OTP/otp.method";
import {FaceRecognitionMethod} from "./methods/face_recognition/faceRecognition.method";

@Injectable()
export class AuthenticationMethodSelectorService {
    constructor(
        private readonly passwordMethod:PasswordMethod,
        private readonly otpMethod:OtpMethod,
        private readonly faceService:FaceRecognitionMethod,
    ) {}
    async methodSelector(authenticator, username:string, storedSignature:string, sentSignature:string){
        switch (authenticator.authentication_method.title) {
            // case 'lol' :/*for testing*/
            //     return this.passwordMethod.Compare(username, storedSignature, sentSignature)/*for testing*/
            case 'password' :
                const res1 =this.passwordMethod.compare(storedSignature, sentSignature)
                return res1.valid
            case 'face_recognition':
                const res2 = this.faceService.compare(storedSignature , sentSignature)
                // return res2.valid
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
