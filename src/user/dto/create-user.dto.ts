import {IsDate, IsEmail, IsNotEmpty} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    username:string

    @IsNotEmpty()
    @IsDate()
    birth_Date:string

    @IsNotEmpty()
    @IsEmail()
    email:string

    country?:string

    street?:string

    city?:string
}
