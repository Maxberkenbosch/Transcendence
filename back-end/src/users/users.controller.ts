import { HttpService } from "@nestjs/axios";
import {
    Body,
    Controller,
    FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    Res,
    UploadedFile,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { seederConfig } from "src/configs/seeder.config";
import { UserSeeder } from "src/database/seeds/user-create.seed";
import { CreateUserDto } from "src/users/dtos/create-users.dto";
import { UsersService } from "src/users/users.service";
import { uploadImgDto } from "./dtos/upload-img.dto";
const multer  = require('multer')

@Controller("users")
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    getUsers() {
        return this.userService.getUsers();
    }

    @Get('id/:username')
    findUsersById(@Res() res: Response, username: string) {
        try {
            return this.userService.findUserByUsername(username);
        } catch (error) {
            res.status
        }
    }

    @Post('create')
    @UsePipes(ValidationPipe)
    async createUsers(@Body() createUserDto: CreateUserDto) {
        try {
            const user = await this.userService.createUser(createUserDto);
            const ret = { "username": user.username };
            return ret;
        } catch (error) {
            return error;
        }
    }

    @Post('upload-img')
    async uploadImg(@Body() upload: uploadImgDto,
        @UploadedFile( new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: 1000
                    }),
                    new FileTypeValidator({
                        fileType: 'jpeg'
                }),
                ],
            })
        ) file: Express.Multer.File
    ) {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, '/src/uploads')
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = upload.intraId // get this from jwt
                cb(null, file.fieldname + '-' + uniqueSuffix)
            }
        })
        const ret = MulterModule.register({
            dest: 'src/uploads' + upload.type,
        })
    }

    @Get('seeder')
    async seedUsers() {
        // Creates 200 users
        const seed = new UserSeeder({ seedingSource: seederConfig });
        await seed.run();
    }
}
