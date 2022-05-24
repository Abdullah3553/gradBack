import {
    BadRequestException,
    Body,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors, Get, Controller, Param, Headers, Request
} from "@nestjs/common";
import {OtpMethod} from "./OTP/otp.method";
import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import {FaceRecognitionMethod} from "./face_recognition/faceRecognition.method";
import {diskStorage} from "multer";
import { extname } from 'path'
import * as fs from 'fs'
import * as crypto from 'crypto'
import {createHash} from "crypto";
import {FingerprintMethod} from "./Fingerprint/fingerprint.method";
const path = require("path");
let folderFlag = true

@Controller('methods')
export class MethodsController{
    constructor(private readonly otpMethod: OtpMethod,
                private readonly faceRecognitionMethod: FaceRecognitionMethod,
                private readonly fingerprintMethod: FingerprintMethod,
                ) {}
    @Get('otp/generate/:username')
    sendOtp(@Param('username') username:string){
        return this.otpMethod.sendOtp(username)
    }

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
                const path = `src/authentication_method/methods/face_recognition/storage/unknown/${req.query.username}/${random_num}${extname(file.originalname)}`
                const folderName = `src/authentication_method/methods/face_recognition/storage/unknown/${req.query.username}`

                if(req.query.flag ==='f'){
                    req.query.flag = 'nf'
                    if (fs.existsSync(folderName))
                        fs.rmSync(folderName, { recursive: true });

                    fs.mkdirSync(folderName);
                }


                if(fs.existsSync(path) ){
                    cb(new BadRequestException('File exists already'),'')
                }
                //Calling the callback passing the random name generated with the original extension name
                cb(null, `${req.query.username}/${random_num}${extname(file.originalname)}`)

            }
        })
    }))
    uploadFileLogin(@UploadedFiles() files: { images?: Express.Multer.File[] }) {
        folderFlag = true
        const tmparr = files.images[0].path.split('\\')
        tmparr.pop()
        let path =''
        tmparr.forEach(ele=>path+=(ele+'/'))
        return {
            path,
        }
    }
    @Post('test1/')
    test(@Body('name') name:string){

        console.log(name.length)
        const envKey = process.env.RSA_PRIVATE_KEY.split('\\n')
        envKey.pop()
        let key = '-----BEGIN RSA PRIVATE KEY-----\n'
        envKey.forEach(obj => key+= (obj+'\n'))
        key +='-----END RSA PRIVATE KEY-----\n'
        const privateKey = crypto.createPrivateKey({
            // key: fs.readFileSync(path.resolve(__dirname, "../../../RSA_Key/private.pem")),
            key: key, // for a higher security
            format:'pem',
            type:'pkcs1'
        });
        const publicKey = crypto.createPublicKey({
            key:privateKey.export({format:'pem', type:'pkcs1'}),
            format:'pem',
            type:'pkcs1'
        })
        const data = name
        const encryptedData = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            // We convert the data string to a buffer using `Buffer.from`
            Buffer.from(data)
        )
        return {
            encryptedData:encryptedData.toString('base64'),
            length:encryptedData.toString('base64').length
        }
    }

    @Post('test2/')
    test2(@Body('name') name:string){
        const envKey = process.env.RSA_PRIVATE_KEY.split('\\n')
        envKey.pop()
        let key = '-----BEGIN RSA PRIVATE KEY-----\n'
        envKey.forEach(obj => key+= (obj+'\n'))
        key +='-----END RSA PRIVATE KEY-----\n'
        const privateKey = crypto.createPrivateKey({
            // key: fs.readFileSync(path.resolve(__dirname, "../../../RSA_Key/private.pem")),
            key: key, // for a higher security
            format:'pem',
            type:'pkcs1'
        });
        const decryptedData = crypto.privateDecrypt(
            {
                key: privateKey,
                // In order to decrypt the data, we need to specify the
                // same hashing function and padding scheme that we used to
                // encrypt the data in the previous step
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            Buffer.from(name, 'base64')
        )
        return {
            decryptedData:decryptedData.toString(),
            length:decryptedData.toString().length
        }
    }

    // @Get('tst/:id')
    // async tst(@Param('id')id:string){
    //     const ard= await this.fingerprintMethod.takeInput()
    //     // const ard= await this.fingerprintMethod.enrollFinger(Number(id))
    //     return {
    //        ard,
    //        id:id
    //    }
    // }
    // @Get('tst2/:id')
    // async tst2(@Param('id')id:string) {
    //     // const ard= await this.fingerprintMethod.takeInput()
    //     const ard = await this.fingerprintMethod.enrollFinger(Number(id))
    //     return {
    //         ard,
    //         id: id
    //     }
    // }
    // @Get('fingerprint/scan')
    // async scanFinger(){
    //     const ard= await this.fingerprintMethod.takeInput()
    //     // const ard= await this.fingerprintMethod.enrollFinger(Number(id))
    //     return ard
    // }

}
