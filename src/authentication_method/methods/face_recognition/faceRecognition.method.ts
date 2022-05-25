import {createHash} from "crypto";
import {BaseMethod} from "../base.method";
import * as multer from "multer";
import * as path from "path";
import {AuthenticatorService} from "../../../authenticator/authenticator.service";
import {Injectable} from "@nestjs/common";
import {EncryptionService} from "../../../encryption/encryption.service"
import { exec } from 'child_process';
import * as fs from "fs";


@Injectable()
export class FaceRecognitionMethod implements BaseMethod{
    constructor(private authenticatorService : AuthenticatorService,
                private readonly encryptionService : EncryptionService) {

    }


   async compare(encryptedStoredSignature:string, sentSignature:string , filePath?:string){
       /*
       * 1- retrieve known pic from db
       * 1-2 decrypt RSA known path
       * 2- get unknown path from register . user in user service
       * 3- main.py execute then compare
       * 3-1 if true -> response
       * 3-2 if false -> response
       * 4- remove unknown pics
       * */
        const response = {valid:false, message:'No matching faces'}
        const decryptedSignature = this.encryptionService.rsaDecrypt(encryptedStoredSignature)
        let stdout =  await this.executeFaceModule(decryptedSignature,sentSignature);
        if(stdout === 'True' )
        {
            response.valid=true;
            response.message = 'matching successful'
        }

       fs.rmSync(sentSignature, { recursive: true, force: true });

        return response
    }
    executeFaceModule (knownPath:string , unknownPath: string){
    let command = `python main.py ${knownPath} ${unknownPath}`

            return new Promise(function (resolve, reject) {
                exec(command, (err, stdout, stderr) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(stdout);
                    }
                });

        })

    }

    async test(path:string, id:number){
        console.log(this.authenticatorService); return
        const x =  await this.authenticatorService.update(id, {signature:path});
    }


}
