import {IsDateString, IsEmail, IsInt, IsNotEmpty} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
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
