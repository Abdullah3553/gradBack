import {createHash} from "crypto";
import {BaseMethod} from "../base.method";
import { Encoder, QRByte, QRKanji, ErrorCorrectionLevel } from '@nuintun/qrcode'
import { Decoder } from '@nuintun/qrcode';
import {Injectable} from "@nestjs/common";
import {EncryptionService} from "../../../encryption/encryption.service";

@Injectable()
export class QrMethod implements BaseMethod{

    constructor(
        private readonly encryptionService:EncryptionService
    ) {}

    async compare(hashedStoredSignature:string, sentSignature:string){
        const response = {valid:false, message:'QR is not valid'}
        const hashedSentSignature = this.encryptionService.sha256Encrypt(sentSignature)

        if(hashedStoredSignature === hashedSentSignature){
            response.valid = true
            response.message= "QR is valid"
        }

        return response
    }

     createQr(username:string)
{
    let value,result='';
    for(let i=0;i<5;i++)
    {
       value = Math.floor(Math.random() * 10);
        result += value.toString();
    }
    result=result+username;
    for(let i=0;i<5;i++)
    {
        value = Math.floor(Math.random() * 10);
        result += value.toString();
    }
    result = this.encryptionService.rsaEncrypt(result)
    const qrcode = new Encoder();
    qrcode.write(new QRByte(result));
    qrcode.make();
    return qrcode.toDataURL()
}


}
