import {createHash} from "crypto";
import {BaseMethod} from "../base.method";
import * as multer from "multer";
import * as path from "path";
import {AuthenticatorService} from "../../../authenticator/authenticator.service";
import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma/prisma.service";
import {retry} from "rxjs";
const SerialPort = require("serialport").SerialPort;
const Readline = require('@serialport/parser-readline').ReadlineParser;
// let arduinoSerialPort = new SerialPort({
//     path:'COM3',
//     baudRate: 9600});
@Injectable()
export class FingerprintMethod implements BaseMethod{
    constructor(private readonly prisma:PrismaService,
                ) {
    }
    compare(encryptedStoredSignature:string, sentSignature:string , filePath:string){
        // encryptedStoredSignature is the file path for the known face image
        // sentSignature is the file path for the unknown face images
        //1) Decrypt the encryptedStoredSignature
        //2) execute the python module with command line
        //3) return formatted response
        return {

        }
    }
    //
    //  takeInput(){
    //     const response={
    //         valid:false,
    //         data:''
    //     }
    //     return new Promise((resolve,reject)=>{
    //         if(arduinoSerialPort.isOpen){
    //             const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\r' }));// Read the port data
    //             arduinoSerialPort.write('o', ()=>{
    //                 parser.on('data', (data)=>{
    //                     response.data=data;
    //                         response.valid=true
    //                         resolve(response)
    //                 })
    //             })
    //         }
    //     })
    // }
    //   async enrollFinger(id:number) {
    //     const response = {
    //         valid:false,
    //         data:''
    //     }
    //     return new Promise((resolve, reject)=>{
    //         if(arduinoSerialPort.isOpen){
    //             const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\n' }));// Read the port data
    //             arduinoSerialPort.write(`e${id}`, ()=>{
    //                 parser.on('data', (data, err)=>{
    //                     if(err) resolve(response)
    //                     response.valid = true
    //                     response.data = data
    //                     resolve(response)
    //                 })
    //             })
    //
    //         }
    //     })
    // }
}
