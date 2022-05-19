import {
    BadRequestException,
    Body,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors, Get, Controller, Param
} from "@nestjs/common";
import {OtpMethod} from "./OTP/otp.method";
import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import {FaceRecognitionMethod} from "./face_recognition/faceRecognition.method";
import {diskStorage} from "multer";
import { extname } from 'path'
import * as fs from 'fs'
import * as crypto from 'crypto'
import {createHash} from "crypto";


@Controller('methods')
export class MethodsController{
    constructor(private readonly otpMethod: OtpMethod,
                private readonly faceRecognitionMethod: FaceRecognitionMethod
                ) {}
    @Post('otp/generate')
    sendOtp(@Body('email') email:string){
        return this.otpMethod.sendOtp(email)
    }

    // @Post('/test')
    // @UseInterceptors(FileInterceptor('file'))
    // test(@Request() req){
    //    return this.faceRecognitionMethod.saveimageRegister(req);
    // }

    @Post('/face/register') //for registration
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: 'src/authentication_method/methods/face_recognition/storage/known'
            , filename: (req, file, cb) => {
                let random_num = ""
                for (let i=0 ; i<10 ; i++)
                {
                    random_num += Math.floor(Math.random() * 10).toString();
                }
                const username = req.query.username.toString()
                const hashedUsername = createHash('sha256').update(username).digest('hex');
                random_num+=hashedUsername
                const path = `src/authentication_method/methods/face_recognition/storage/known/${random_num}${extname(file.originalname)}`
                if(fs.existsSync(path)){
                    cb(new BadRequestException('File exists already'),'')
                }
                //Calling the callback passing the random name generated with the original extension name
                cb(null, `${random_num}${extname(file.originalname)}`)
            }
        })
    })
    )
    uploadFileRegister(@UploadedFile() file: Express.Multer.File) {
        return {
            path:file.path.toString()
        }
    }
    @Post('/face/login')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }],{
        storage: diskStorage({
            destination: 'src/authentication_method/methods/face_recognition/storage/unknown',
            filename: (req, file, cb) => {
                //console.log(req.files['image'])
                //console.log(files)
                let random_num = ""
                for (let i=0 ; i<10 ; i++)
                {
                    random_num += Math.floor(Math.random() * 10).toString();
                }
                random_num+=req.query.username
                const path = `src/authentication_method/methods/face_recognition/storage/unknown/${random_num}${extname(file.originalname)}`

                if(fs.existsSync(path)){
                    cb(new BadRequestException('File exists already'),'')
                }
                //Calling the callback passing the random name generated with the original extension name
                cb(null, `${random_num}${extname(file.originalname)}`)
            }
        })
    }))
    uploadFileLogin(@UploadedFiles() files: { images?: Express.Multer.File[] }) {
        return files.images.map(img =>{
                return {
                    path:img.path
                }
            })
    }
    @Get('test/:name')
    test(@Param('name') name:string){
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            // The standard secure default length for RSA keys is 2048 bits
            modulusLength: 2048,
        })
        const encryptedData = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            // We convert the data string to a buffer using `Buffer.from`
            Buffer.from(name)
        )
        return {
            encryptedData:encryptedData.toString("base64")
        }
    }

    @Post('test2/')
    test2(@Body('name') name:string){
        console.log(name)
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            // The standard secure default length for RSA keys is 2048 bits
            modulusLength: 2048,
        })
        const decryptedData = crypto.privateDecrypt(
            {
                key: privateKey,
                // In order to decrypt the data, we need to specify the
                // same hashing function and padding scheme that we used to
                // encrypt the data in the previous step
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            Buffer.from(name)
        )
        return {
            decryptedData
        }
    }

}
