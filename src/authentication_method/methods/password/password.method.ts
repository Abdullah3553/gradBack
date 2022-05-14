import {createHash} from "crypto";
import {BaseMethod} from "../base.method";

export class PasswordMethod implements BaseMethod{

    compare(hashedStoredSignature:string, sentSignature:string){
        const response = {valid:false, message:'Password is not valid'}
        const hashedSentSignature = createHash('sha256').update(sentSignature).digest('hex');
        if(hashedStoredSignature === hashedSentSignature){
            response.valid = true
            response.message= "Password is valid"
        }
        // const tmp = createHash('sha256').update(hashedStoredSignature).digest('hex')/*for testing*/
        // if(hashedSentSignature === tmp)return true/*for testing*/
        return response
    }
}
