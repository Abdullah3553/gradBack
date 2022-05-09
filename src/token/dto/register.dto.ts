import {ArrayNotEmpty, IsDateString, IsEmail, IsNotEmpty} from "class-validator";

export class RegisterDto
{
    @IsNotEmpty()
    username:string

    @IsNotEmpty()
    @IsEmail()
    email:string

    @ArrayNotEmpty()
    auth_meth:Object[]

    @IsNotEmpty()
    @IsDateString()
    birth_date:string
}