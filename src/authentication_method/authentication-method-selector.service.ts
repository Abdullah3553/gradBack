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
    async methodSelector(authenticator, username:string, storedSignature:string, sentSignature:string):Promise<{ valid: boolean, message: string }>{
        switch (authenticator.authentication_method.title) {
            // case 'lol' :/*for testing*/
            //     return this.passwordMethod.Compare(username, storedSignature, sentSignature)/*for testing*/
            case 'password' :
                return this.passwordMethod.compare(storedSignature, sentSignature)
            case 'face_recognition':
                  return await this.faceService.compare(storedSignature, sentSignature)
            case 'fingerprint_recognition':
                return {valid:true, message:'empty'}
            case 'otp':
                return  await this.otpMethod.compare(storedSignature, sentSignature, authenticator)
            case 'qr':
                return {valid:true, message:'empty'}
        }
    }
}
