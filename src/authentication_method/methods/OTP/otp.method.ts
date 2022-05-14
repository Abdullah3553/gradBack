import {createHash} from "crypto";
import {BaseMethod} from "../base.method";
import * as moment from 'moment' ;
import { unitOfTime } from 'moment';
import {AuthenticatorService} from "../../../authenticator/authenticator.service";

const otpDuration = {
    duration:Number(process.env.OTP_DURATION),
    type:process.env.OTP_DURATION_TYPE
}

export class OtpMethod implements BaseMethod{
    constructor(
        private readonly authenticatorService :AuthenticatorService
    ) {}
    compare(hashedStoredSignature:string, sentSignature:string, authenticator){
        const response = {valid:false, message:'OTP is not valid'}
        if(this.isOtpExpired(authenticator.createdAt, authenticator.id)){
            response.message = 'OTP has expired'
            response.valid = false
            return response
        }
        const hashedSentSignature = createHash('sha256').update(sentSignature).digest('hex');
        if(hashedStoredSignature === hashedSentSignature) {
            response.valid = true
            response.message = 'OTP is the valid'
            this.authenticatorService.remove(Number(authenticator.id)) // delete the otp
        }
        // const tmp = createHash('sha256').update(hashedStoredSignature).digest('hex')/*for testing*/
        // if(hashedSentSignature === tmp)return true/*for testing*/
        return response
    }
     isOtpExpired(createdAt:string, otpId:number){
        const now = moment()
        const otpDate = moment(createdAt)
        if(now.diff(otpDate,<unitOfTime.DurationConstructor>otpDuration.type) > otpDuration.duration){
            // otp has expired
            this.authenticatorService.remove(Number(otpId)) // delete the otp
            return true
        }
        return false
    }


}
