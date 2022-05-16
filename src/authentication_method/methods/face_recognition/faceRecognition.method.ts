import {createHash} from "crypto";
import {BaseMethod} from "../base.method";

export class FaceRecognitionMethod implements BaseMethod{
    compare(username:string, hashedStoredSignature:string, sentSignature:string, filePath:string){
        const response = {valid:false, message:'Face is not being recognized'}
        const hashedSentSignature = createHash('sha256').update(sentSignature).digest('hex');
        if(hashedStoredSignature === hashedSentSignature){
            response.valid=true
            response.message = 'face has been recognized'
        }
        // const tmp = createHash('sha256').update(hashedStoredSignature).digest('hex')/*for testing*/
        // if(hashedSentSignature === tmp)return true/*for testing*/
        return response

    }
    saveimageRegister(file: Express.Multer.File)
    {

    }
}
