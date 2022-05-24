import {createHash} from "crypto";
import {BaseMethod} from "../base.method";
import * as multer from "multer";
import * as path from "path";
import {AuthenticatorService} from "../../../authenticator/authenticator.service";
import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma/prisma.service";
const SerialPort = require("serialport").SerialPort;
const Readline = require('@serialport/parser-readline').ReadlineParser;
let arduinoSerialPort
@Injectable()
export class FingerprintMethod implements BaseMethod{
    constructor(private readonly prisma:PrismaService,) {
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
            data:''
        }
        return new Promise((resolve,reject)=>{
            if(arduinoSerialPort.isOpen){
                const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\r' }));// Read the port data
                arduinoSerialPort.write('o', ()=>{
                    parser.on('data', (data)=>{
                        response.data=data;
                            response.valid=true
                            resolve(response)
                    })
                })
            }
        })
    }
      async enrollFinger(id:number) {
        const response = {
            valid:false,
            data:''
        }
        return new Promise((resolve, reject)=>{
            if(arduinoSerialPort.isOpen){
                const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\n' }));// Read the port data
                arduinoSerialPort.write(`e${id}`, ()=>{
                    parser.on('data', (data, err)=>{
                        if(err) resolve(response)
                        response.valid = true
                        response.data = data
                        resolve(response)
                    })
                })

            }
        })
    }
}
