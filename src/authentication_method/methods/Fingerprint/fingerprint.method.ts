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
            const com = ''
            // const com = 'COM3'
            arduinoSerialPort = new SerialPort({path:com, baudRate: 9600});
        }catch (err){
            console.log(err)
        }
    }
    compare(encryptedStoredSignature:string, sentSignature:string , filePath:string){
        return {

        }
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
        const id = await this.getFingerprintId()
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
        return this.encryptionService.rsaDecrypt(fingers[fingers.length].signature)
    }
}
