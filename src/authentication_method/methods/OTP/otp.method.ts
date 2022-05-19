import {createHash} from "crypto";
import {BaseMethod} from "../base.method";
import * as moment from 'moment' ;
import { unitOfTime } from 'moment';
import {AuthenticatorService} from "../../../authenticator/authenticator.service";
import {generate} from "otp-generator";
import * as nodemailer from 'nodemailer'

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
            response.message = 'OTP is ? valid'
            this.authenticatorService.remove(Number(authenticator.id)) // delete the otp
        }
        // const tmp = createHash('sha256').update(hashedStoredSignature).digest('hex')/*for testing*/
        // if(hashedSentSignature === tmp)return true/*for testing*/
        return response
    }
     isOtpExpired(createdAt:string, otpId:number){
        const now = moment()//2022-05-19T01:53:15
        const otpDate = moment(createdAt) // date otp created at
        if(now.diff(otpDate,<unitOfTime.DurationConstructor>otpDuration.type) > otpDuration.duration){
            // otp has expired
            this.authenticatorService.remove(Number(otpId)) // delete the otp
            return true
        }
        return false
    }

    async sendOtp(userEmail:string){
        const otpOptions = {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets:false,
        }
        const otp = generate(6, otpOptions);
        let transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.OTP_EMAIL,
                pass: process.env.OTP_EMAIL_PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.OTP_EMAIL, // Sender address
            to: userEmail, // List of recipients
            subject: 'Node Mailer', // Subject line
            text: `Hello, The otp is ${otp}`, // Plain text body
        };
        const info = await transport.sendMail(mailOptions);
        if(info.accepted.find(obj => obj === userEmail)) return true
        else return false
    }


}
