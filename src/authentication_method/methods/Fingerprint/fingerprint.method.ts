import {createHash} from "crypto";
import {BaseMethod} from "../base.method";
import * as multer from "multer";
import * as path from "path";
import {AuthenticatorService} from "../../../authenticator/authenticator.service";
import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma/prisma.service";
import {EncryptionService} from "../../../encryption/encryption.service";
import {exec} from "child_process";
const SerialPort = require("serialport").SerialPort;
const Readline = require('@serialport/parser-readline').ReadlineParser;
let arduinoSerialPort

@Injectable()
export class FingerprintMethod implements BaseMethod{
    constructor(private readonly prisma:PrismaService,
                private readonly encryptionService:EncryptionService
                ) {}
    async compare(encryptedStoredSignature:string, encryptedSentSignature:string ){
        const response = {valid:false, message:'Finger is not matched'} // if not valid
        const storedSignature = this.encryptionService.rsaDecrypt(encryptedStoredSignature)
        const sentSignature = this.encryptionService.rsaDecrypt(encryptedSentSignature)
        // debugging .............
        // console.log("db -> ", encryptedStoredSignature)
        // console.log("db no -> ", this.encryptionServ ice.rsaDecrypt(encryptedStoredSignature) )
        // console.log("user -> ", hashedSentSignature)
        // console.log("user no -> ", this.encryptionService.rsaDecrypt(hashedSentSignature) )

        if(await this.matchFingers(storedSignature,sentSignature)){
            response.valid = true
            response.message = 'Finger is matched '
        }
        return response
    }

    //  takeInput(){ // old finger code
    //     const response={
    //         valid:false,
    //         message:'Unknown Error',
    //         data:''
    //     }
    //     return new Promise((resolve,reject)=>{
    //         if(arduinoSerialPort.isOpen){
    //             const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\r' }));// Read the port data
    //             arduinoSerialPort.write('o', ()=>{
    //                 parser.on('data', (data, err)=>{
    //                     if(err) {
    //                         response.valid = false
    //                         response.message = err
    //                         reject(response)
    //                     }
    //                     response.data=data;
    //                     response.valid=true
    //                     response.message = 'Finger scanned successfully'
    //                     resolve(response)
    //                 })
    //             })
    //         }
    //     })
    // }
    //   async enrollFinger() { // old finger code
    //     const response = {
    //         valid:false,
    //         message:'Unknown Error',
    //         data:''
    //     }
    //     let id = await this.getFingerprintId()
    //     return new Promise((resolve, reject)=>{
    //         if(arduinoSerialPort.isOpen){
    //             const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\r' }));// Read the port data
    //             arduinoSerialPort.write(`e${id}`, ()=>{
    //                 parser.on('data', (data, err)=>{
    //                     if(err) {
    //                         response.valid = false
    //                         response.message = err
    //                         reject(response)
    //                     }
    //                     response.valid = true
    //                     response.data = data
    //                     response.message = 'Finger enrolled successfully'
    //                     resolve(response)
    //                 })
    //             })
    //
    //         }
    //     })
    // }

    async matchFingers(userStoredFinger:string, userCheckFinger:string){
        const exeRes = await this.executeFingerModule('loginCheck', `${userStoredFinger} ${userCheckFinger}`)
        const exeResArr = exeRes.split(',')
        if(exeResArr[0] == 'TRUE'){
            return true
        }
        return false
    }

    async takeInput(username:string){
        const response={
            valid:false,
            message:'no matches found',
            data:''
        }
        const exeRes = await this.executeFingerModule('loginInput', this.encryptionService.sha256Encrypt(username))
        const exeResArr = exeRes.split(',')
        if(exeResArr[0] == 'TRUE'){
            response.valid = true
            response.message = 'Fingerprint Read'
            response.data = this.encryptionService.rsaEncrypt(exeResArr[1])
        }
        return response
    }


    async enrollFinger(username:string) {
        const response = {
            valid:false,
            message:'Fingerprint enrollment error',
            data:''
        }
        const exeRes = await this.executeFingerModule('register', this.encryptionService.sha256Encrypt(username))
        const exeResArr = exeRes.split(',')
        if(exeResArr[0] == 'TRUE'){
            response.valid = true
            response.message = 'Fingerprint saved'
            response.data = exeResArr[1]
        }
        return response
    }
    async getFingerprintId(){
        const fingers = await this.prisma.authenticator.findMany({
            where:{
                authentication_method:{
                    title:'fingerprint_recognition'
                }
            },
            orderBy:{
                priority:'asc'
            }
        })
        let id = 0
        if(!fingers){
            id = Number(this.encryptionService.rsaDecrypt(fingers[fingers.length].signature))
        }
        return id+1
    }

    executeFingerModule(command:string, data:string) : Promise<string>{
        let cmdCommand = `python src/authentication_method/methods/Fingerprint/fingerprint_module.py ${command} ${data}`
        return new Promise(function (resolve, reject) {
            exec(cmdCommand, (err, stdout, stderr) => {
                if (err) {
                    console.log(stdout)
                    reject(err);
                } else {
                    resolve(stdout);
                }
            });

        })
    }
}
