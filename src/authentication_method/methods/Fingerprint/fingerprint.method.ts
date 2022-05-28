import {createHash} from "crypto";
import {BaseMethod} from "../base.method";
import * as multer from "multer";
import * as path from "path";
import {AuthenticatorService} from "../../../authenticator/authenticator.service";
import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma/prisma.service";
import {EncryptionService} from "../../../encryption/encryption.service";
const SerialPort = require("serialport").SerialPort;
const Readline = require('@serialport/parser-readline').ReadlineParser;
let arduinoSerialPort

@Injectable()
export class FingerprintMethod implements BaseMethod{
    constructor(private readonly prisma:PrismaService,
                private readonly encryptionService:EncryptionService
                ) {
        try{
            // const com = ''
            // const com = 'COM3'
            let path = ''
            SerialPort.list().then(ports => {
                let done = false
                let count = 0
                let allports = ports.length
                ports.forEach(function(port) {
                    count = count+1
                    let pm  = port.manufacturer
                    if (typeof pm !== 'undefined' && pm.includes('arduino')) {
                        path = port.path
                        arduinoSerialPort = new SerialPort({path:path, baudRate: 9600});
                        done = true
                    }

                    if(count === allports && done === false){
                        console.log(`can't find any arduino`)
                    }
                })
            })

        }catch (err){
            console.log(err)
        }
    }
    compare(encryptedStoredSignature:string, sentSignature:string ){
        const response = {valid:false, message:'Finger is not matched'} // if not valid
        const hashedSentSignature = this.encryptionService.sha256Encrypt(sentSignature)
        // debugging .............
        // console.log("db -> ", encryptedStoredSignature)
        // console.log("db no -> ", this.encryptionService.rsaDecrypt(encryptedStoredSignature) )
        // console.log("user -> ", hashedSentSignature)
        // console.log("user no -> ", this.encryptionService.rsaDecrypt(hashedSentSignature) )

        if(hashedSentSignature === encryptedStoredSignature){
            response.valid = true
            response.message = 'Finger is matched '
        }
        return response
    }

     takeInput(){
        const response={
            valid:false,
            message:'Unknown Error',
            data:''
        }
        return new Promise((resolve,reject)=>{
            if(arduinoSerialPort.isOpen){
                const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\r' }));// Read the port data
                arduinoSerialPort.write('o', ()=>{
                    parser.on('data', (data, err)=>{
                        if(err) {
                            response.valid = false
                            response.message = err
                            reject(response)
                        }
                        response.data=data;
                        response.valid=true
                        response.message = 'Finger scanned successfully'
                        resolve(response)
                    })
                })
            }
        })
    }
      async enrollFinger() {
        const response = {
            valid:false,
            message:'Unknown Error',
            data:''
        }
        let id = await this.getFingerprintId()
        return new Promise((resolve, reject)=>{
            if(arduinoSerialPort.isOpen){
                const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\r' }));// Read the port data
                arduinoSerialPort.write(`e${id}`, ()=>{
                    parser.on('data', (data, err)=>{
                        if(err) {
                            response.valid = false
                            response.message = err
                            reject(response)
                        }
                        response.valid = true
                        response.data = data
                        response.message = 'Finger enrolled successfully'
                        resolve(response)
                    })
                })

            }
        })
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
}
