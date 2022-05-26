import {createHash} from "crypto";
import {BaseMethod} from "../base.method";
import {EncryptionService} from "../../../encryption/encryption.service";
import {Injectable} from "@nestjs/common"; //interface

@Injectable()
export class PasswordMethod implements BaseMethod{

    constructor( private readonly encryptionService : EncryptionService) {
    }

    compare(hashedStoredSignature:string, sentSignature:string){
        const response = {valid:false, message:'Password is not valid'} // if not valid
        const hashedSentSignature = this.encryptionService.sha256Encrypt(sentSignature)
        if(hashedStoredSignature === hashedSentSignature){
            response.valid = true
            response.message= "Password is valid"
        }
        // const tmp = createHash('sha256').update(hashedStoredSignature).digest('hex')/*for testing*/
        // if(hashedSentSignature === tmp)return true/*for testing*/
        return response
    }
}
