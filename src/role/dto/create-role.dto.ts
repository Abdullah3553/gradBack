import {ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsString} from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name : string

    @IsArray()
    @ArrayNotEmpty()
    privileges:number[]
}
