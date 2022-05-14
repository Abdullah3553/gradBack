import {IsDateString, IsEmail, IsInt, IsNotEmpty, IsString} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username:string

    @IsNotEmpty()
    @IsDateString()
    birth_date:string

    @IsNotEmpty()
    @IsEmail()
    email:string

    country?:string

    street?:string

    city?:string

    role_id?:number
}
