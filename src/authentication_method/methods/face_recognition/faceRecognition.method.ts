import {createHash} from "crypto";
import {BaseMethod} from "../base.method";
import * as multer from "multer";
import * as path from "path";
import {AuthenticatorService} from "../../../authenticator/authenticator.service";


export class FaceRecognitionMethod implements BaseMethod{
    constructor(private authenticatorService : AuthenticatorService) {
    }
    compare(encryptedStoredSignature:string, sentSignature:string , filePath:string){
        // encryptedStoredSignature is the file path for the known face image
        // sentSignature is the file path for the unknown face images
        //1) Decrypt the encryptedStoredSignature
        //2) execute the python module with command line
        //3) return formatted response
        return {

        }
    }
    // saveimageRegister(req)
    // {
    //
    //     const storage = multer.diskStorage({
    //         destination: function (req, file, cb) {
    //             cb(null, 'src/authentication_method/methods/face_recognition/storage/known')
    //         },
    //         filename: function (req, file, cb) {
    //             let random_num = ""
    //             for (let i=0 ; i<10 ; i++)
    //             {
    //                 random_num += Math.floor(Math.random() * 10).toString();
    //             }
    //             //random_num += username;
    //             console.log(random_num)
    //             cb(null, `${random_num}${path.extname(file.originalname)}`) //Appending extension
    //         }
    //     })
    //
    //     //storage._handleFile(null, file, ()=>{})
    //
    //     var upload = multer({ storage: storage });
    //     upload.single('file')
    //}

    async test(path:string, id:number){
        console.log(this.authenticatorService); return
        const x =  await this.authenticatorService.update(id, {signature:path});
    }


}
