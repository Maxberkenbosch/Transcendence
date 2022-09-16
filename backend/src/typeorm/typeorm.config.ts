import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CreateTables1661971166323 } from "src/database/migrations/1661971166323-CreateTables";
import { BlockList } from "src/entities/blocklist.entity";
import { FriendList } from "src/modules/friendlist.entity";
import FriendRequests from "src/entities/friendrequest.entity";
import Uninitialized from "src/users/uninitialized/uninitialized.entity";
import { User } from "src/entities/user.entity";

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASS'),
            database: configService.get<string>('DB_NAME'),
            entities: [User, Uninitialized, FriendList, BlockList, FriendRequests],
            migrations: [CreateTables1661971166323],
            synchronize: true,
            logging: true,
            autoLoadEntities: true,
            migrationsRun: true
        };
    }
}
