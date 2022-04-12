import {IsNotEmpty} from "class-validator";

export class CreateAuthenticationMethodDto {
    id: number;

    @IsNotEmpty()
    title: string;

    file_path?: string;
}
