import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { typeOrmAsyncConfig } from './typeorm/typeorm.config';
import { envConfig } from './configs/env.config';
import { ChatModule } from './chat/chat.module';
import { FriendslistModule } from './users/friendlist/friendlist.module';
import { BlockListModule } from './users/blocklist/blocklist.module';
import { FriendRequestModule } from './users/friendrequests/friendrequest.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
  	UsersModule,
    FriendslistModule,
    BlockListModule,
    FriendRequestModule,
  	AuthModule,
    ChatModule,
    PassportModule.register({ session: true }),
	],
  controllers: [],
  providers: [],
})
export class AppModule {}