import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors
} from "@nestjs/common";
import {OtpMethod} from "./OTP/otp.method";
import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import {FaceRecognitionMethod} from "./face_recognition/faceRecognition.method";
import {diskStorage} from "multer";
import { extname } from 'path'
import * as fs from 'fs'


@Controller('methods')
export class MethodsController{
    constructor(private readonly otpMethod: OtpMethod,
                private readonly faceRecognitionMethod: FaceRecognitionMethod
                ) {}

    @Post('otp/generate')
    sendOtp(@Body('email') email:string){
        return this.otpMethod.sendOtp(email)
    }

    @Post('/face/register') //for registration
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: 'src/authentication_method/methods/face_recognition/storage/known'
            , filename: (req, file, cb) => {
                const fileName = req.query.username
                const path = `src/authentication_method/methods/face_recognition/storage/known/${fileName}${extname(file.originalname)}`
                if(fs.existsSync(path)){
                    cb(new BadRequestException('File exists already'),'')
                }
                //Calling the callback passing the random name generated with the original extension name
                cb(null, `${fileName}${extname(file.originalname)}`)
            }
        })
    })
    )
    uploadFileRegister() {
        return {
            message:"file Uploaded successfully",
            success:true
        }
    }
    @Post('/face/login')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 5 }],{
        storage: diskStorage({
            destination: 'src/authentication_method/methods/face_recognition/storage/unknown',
            filename: (req, files, cb) => {
                console.log(req.files['image'])
                console.log(files)
                const fileName = req.query.username
                const path = `src/authentication_method/methods/face_recognition/storage/known/${fileName}${extname(files.originalname)}`
                if(fs.existsSync(path)){
                    cb(new BadRequestException('File exists already'),'')
                }
                //Calling the callback passing the random name generated with the original extension name
                cb(null, `${fileName}${extname(files.originalname)}`)
            }
        })
    }))
    uploadFileLogin(@UploadedFiles() files: { image?: Express.Multer.File[] }) {
        console.log(files);
    }

}
