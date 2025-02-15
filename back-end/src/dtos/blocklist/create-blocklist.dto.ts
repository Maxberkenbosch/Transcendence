import { IsNotEmpty } from "class-validator";

export class CreateBlockDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    blocked: string
}
