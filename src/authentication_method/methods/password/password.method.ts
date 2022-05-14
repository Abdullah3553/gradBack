import {createHash} from "crypto";
import {BaseMethod} from "../base.method";

export class PasswordMethod implements BaseMethod{

    compare(username:string, hashedStoredSignature:string, sentSignature:string){
        const hashedSentSignature = createHash('sha256').update(sentSignature).digest('hex');
        if(hashedStoredSignature === hashedSentSignature)return true
        // const tmp = createHash('sha256').update(hashedStoredSignature).digest('hex')/*for testing*/
        // if(hashedSentSignature === tmp)return true/*for testing*/
        return false
    }
}
