import {Body, Controller, Post} from "@nestjs/common";
import {OtpMethod} from "./OTP/otp.method";

@Controller('methods')
export class MethodsController{
    constructor(private readonly otpMethod: OtpMethod) {}

    @Post('otp/generate')
    sendOtp(@Body('email') email:string){
        return this.otpMethod.sendOtp(email)
    }
}
