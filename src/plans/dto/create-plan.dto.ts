import {IsBoolean, IsIn, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreatePlanDto {
    @IsNotEmpty()
    @IsString()
    name:string

    description:string

    @IsNotEmpty()
    @IsNumber()
    price:number

    @IsNotEmpty()
    @IsNumber()
    duration_months:number

    @IsBoolean()
    activated:boolean
}
