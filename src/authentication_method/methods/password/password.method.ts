import {createHash} from "crypto";
import {BaseMethod} from "../base.method"; //interface

export class PasswordMethod implements BaseMethod{

    compare(hashedStoredSignature:string, sentSignature:string){
        const response = {valid:false, message:'Password is not valid'} // if not valid
        const hashedSentSignature = createHash('sha256').update(sentSignature).digest('hex'); //coding data
        if(hashedStoredSignature === sentSignature){
            response.valid = true
            response.message= "Password is valid"
        }
        // const tmp = createHash('sha256').update(hashedStoredSignature).digest('hex')/*for testing*/
        // if(hashedSentSignature === tmp)return true/*for testing*/
        return response
    }
}
