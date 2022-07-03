import {createHash} from "crypto";
import {BaseMethod} from "../base.method";
import * as moment from 'moment' ;
import { unitOfTime } from 'moment';
import {AuthenticatorService} from "../../../authenticator/authenticator.service";
import {generate} from "otp-generator";
import * as nodemailer from 'nodemailer'
import { PrismaService } from "src/prisma/prisma.service";
import {BadRequestException, Injectable} from "@nestjs/common";
import {CreateAuthenticatorDto} from "../../../authenticator/dto/create-authenticator.dto";
import {AuthenticationMethodService} from "../../authentication_method.service";
import {UserService} from "../../../user/user.service";
import {EncryptionService} from "../../../encryption/encryption.service";

const otpDuration = {
    duration:Number(process.env.OTP_DURATION),
    type:process.env.OTP_DURATION_TYPE
}

@Injectable()
export class OtpMethod implements BaseMethod{
    constructor(
        private readonly authenticatorService :AuthenticatorService,
        private readonly prisma :PrismaService,
        private readonly authenticationMethodService : AuthenticationMethodService,
        private readonly userService:UserService,
        private readonly encryptionService : EncryptionService
    ) {}
    async compare(hashedStoredSignature:string, sentSignature:string, authenticator){
        const response = {valid:false, message:'OTP is not valid'}
        if(this.isOtpExpired(authenticator.createdAt)){
            response.message = 'OTP has expired'
            response.valid = false
            return response
        }
        // const hashedSentSignature = createHash('sha256').update(sentSignature).digest('hex');
        const hashedSentSignature = this.encryptionService.sha256Encrypt(sentSignature)
        if(hashedStoredSignature === hashedSentSignature) {
            response.valid = true
            response.message = 'OTP is valid'
            await this.authenticatorService.update(authenticator.id, {...authenticator, signature:'empty otp'})
        }
        // const tmp = createHash('sha256').update(hashedStoredSignature).digest('hex')/*for testing*/
        // if(hashedSentSignature === tmp)return true/*for testing*/
        return response
    }
    isOtpExpired(createdAt:Date){
        const now = moment()
        const otpDate = moment(createdAt, 'MM-DD-YYYY H:M:S') // date otp created at
        // console.log("Now", now)
        // console.log("Created At", createdAt)
        // console.log("Date", otpDate)
        if(now.diff(otpDate,<unitOfTime.DurationConstructor>otpDuration.type) > otpDuration.duration){
            // console.log("WOrked ")
            // otp has expired
            return true
        }
        return false
    }

    async sendOtp(username:string){
        /*
        * to send otp we need to do some steps :
        * 1) Get that user data by username
        * 2) check if that user has old Otp (in mots cases he should have one ) :
        *   2-1) if he had an old otp we check if that otp is valid
        *       2-1-1) if its valid then we throw an exception
        *       2-1-2) else we delete the old otp to send a new one
        *   2-2) IF that user doesn't have an old OTP object that means the sent user didn't register this method
        *        so we throw an exception >>>
        * */
        let user = await this.userService.findOneByUsername(username)
        const oldOtp = user.Authenticator.find(obj=>obj.authentication_method.title==='otp')
        if(!!oldOtp/*ammeeezzzing*/){
            // found old otp
            if(!this.isOtpExpired(oldOtp.createdAt) && oldOtp.signature !== this.encryptionService.sha256Encrypt('empty otp')){
                // this old otp did not expired
                throw new BadRequestException({message:"You have a valid requested OTP already"})
            }
            await this.authenticatorService.remove(oldOtp.id) // delete the old otp
        }else{
            //the sent user didn't register this method
            throw new BadRequestException({message:`OTP is not a valid method for the proposed user`})
        }
        const otpOptions = {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets:false,
        }
        let otp = generate(6, otpOptions);
        let transport
        try{
            transport = nodemailer.createTransport({
                host: "smtp-mail.outlook.com",
                port: 587,
                secureConnection: false,
                auth: {
                    user: process.env.OTP_EMAIL,
                    pass: process.env.OTP_EMAIL_PASSWORD,
                },
                tls: {
                    ciphers:'SSLv3'
                }
            });
            const mailOptions = {
                from: process.env.OTP_EMAIL, // Sender address
                to: user.email, // List of recipients
                subject: 'Authentication System OTP', // Subject line
                text: `Hello, The otp is ${otp}`, // Plain text body
            };
            transport.sendMail(mailOptions); // we could use await here>> but this will cause a latency so we better not use it
            // update the new otp with the new data
            await this.authenticatorService.create({
                userId:oldOtp.userId,
                signature:otp,
                authentication_methodId:oldOtp.authentication_methodId,
                priority:oldOtp.priority
            })
            return true
        }catch (err){
            console.log(err)
            throw new BadRequestException({message:'Error in sending'})
        }

    }
}
