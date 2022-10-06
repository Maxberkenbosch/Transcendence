// random generators for seeding
import {
  randColor,
  randFullName,
  randNumber,
  randParagraph,
  randUserName
} from "@ngneat/falso";

// status and basic injectable
import { HttpStatus, Injectable } from "@nestjs/common";

// typeorm sql injection library
import { InjectRepository } from "@nestjs/typeorm";

// user entity
import { User } from "src/entities";

// typeorm repository manipulation
import { DeleteResult, Repository, TypeORMError, UpdateResult } from "typeorm";

// hashing libraries - thanks angi
import * as bcrypt from "bcrypt";
import { createHash, Hash } from "crypto";

// dtos
import { SetUserDto } from "src/dtos/user/set-user.dto";
import { UsernameDto } from "src/dtos/auth/username.dto";
import { intraIDDto } from "src/dtos/auth/intraID.dto";
import { errorHandler } from "src/utils/errorhandler/errorHandler";
import { ConfigService } from "@nestjs/config";
/**
 * User services
 *
 * Contains all typeorm sql injections.
 * Some functions that not yet used:
 * - set2faSecret
 * - update2faSecret is being used in tfa.service
 */

/**
 * IMPORTANT: createUser wordt niet aangeroepen in de frontend
 * dus ik heb de path verwijderd.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  static filterUser(user: User): User {
    const newUser: User = user;

    if (!newUser)
      return null;
    delete newUser.intraId;
    delete newUser.isInitialized;
    delete newUser.isTfaEnabled;
    delete newUser.refreshToken;
    delete newUser.tfaSecret;
    return newUser;
  }

  // only used for debug purposes
  async getUsers(): Promise<User[]> {
    try {
      const ret: User[] = await this.userRepository.find();
      return Promise.resolve(ret);
    } catch (err: any) {
      throw err;
    }
  }

  async findUsersById(id: number): Promise<User> {
    try {
      const ret: User = await this.userRepository.findOne({ where: { id } });
      return UserService.filterUser(ret);
    } catch (err: any) {
      throw err;
    }
  }

  async findUserByintraId(intraId: string): Promise<User> {
    try {
      const ret: User = await this.userRepository.findOne({
        where: { intraId }
      });
      return UserService.filterUser(ret);
    } catch (err: any) {
      console.log("error: ", err);
      throw err;
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    try {
      const ret: User = await this.userRepository.findOne({
        where: { username }
      });
      return UserService.filterUser(ret);
    } catch (err: any) {
      throw err;
    }
  }

  async createUser(intraID: string, refreshToken: string): Promise<User> {
    try {
      if (await this.findUserByintraId(intraID)) return null;
      const query = {
        intraId: intraID,
        refreshToken: refreshToken
      };

      const newUser: User = this.userRepository.create(query);
      // var testUser: User;
      // const ret = await this.userRepository.save(testUser);
      const ret: User = await this.userRepository.save(newUser);
      return UserService.filterUser(ret);
    } catch (err: any) {
      console.log("error: ", err);
      throw errorHandler(
        err,
        "Failed to create new user",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async setUser(intraID: string, SetUserDto: SetUserDto): Promise<any> {
    try {
      const user: User = await this.findUserByintraId(intraID);
      const query = {
        isInitialized: true,
        username: SetUserDto.username,
        color: SetUserDto.color,
        description: SetUserDto.description
      };

      if (user.isInitialized) return null;

      return await this.userRepository
        .createQueryBuilder()
        .update(user)
        .set(query)
        .where({ id: user.id })
        .returning("*")
        .execute();
    } catch (err: any) {
      throw errorHandler(
        err,
        "Failed to update user",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async removeUser(username: string): Promise<DeleteResult> {
    try {
      const result: DeleteResult = await this.userRepository
        .createQueryBuilder("Users")
        .delete()
        .from("users")
        .where("username =:username", { username })
        .execute();
      return result;
    } catch (err: any) {
      throw errorHandler(
        err,
        "Failed to remove user",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async setRefreshToken(
    intraID: intraIDDto,
    token: string
  ): Promise<UpdateResult> {
    try {
      const user: User = await this.findUserByintraId(intraID.intraID);
      const hashedToken: string = createHash("sha256").update(token).digest("hex");
      const saltorounds: string =
        this.configService.get<string>("SALT_OR_ROUNDS");
      const numsalt: number = +saltorounds;
      const superHashedToken: string = await bcrypt.hash(hashedToken, numsalt);

      return await this.userRepository
        .createQueryBuilder()
        .update(user)
        .set({ refreshToken: superHashedToken })
        .where({ id: user.id })
        .returning("*")
        .execute();
    } catch (err: any) {
      throw errorHandler(
        err,
        "Failed to set user refresh token",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async set2faSecret(id: number, tfaSecret: string): Promise<UpdateResult> {
    try {
      return await this.userRepository.update(id, { tfaSecret });
    } catch (err: any) {
      throw errorHandler(
        err,
        "Failed to set user 2fa secret",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // is deze functie niet hetzelde als set2faSecret? je update in beiden de 2fa
  // als ze iets anders doen, graag vermelden in de functie naam, anders eentje deleten
  // thanks :) - zeno
  async update2faSecret(
    userDto: UsernameDto,
    secret: string
  ): Promise<UpdateResult> {
    try {
      const user: User = await this.findUserByUsername(userDto.username);

      return await this.userRepository
        .createQueryBuilder()
        .update(user)
        .set({ tfaSecret: secret })
        .where({ id: user.id })
        .returning("*")
        .execute();
    } catch (err: any) {
      throw errorHandler(
        err,
        "Failed to set user 2fa secret",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // @angi, kunnen deze weg?
  // setTwoFactorAuthSecret(id: number, twoFactorAuthenticationSecret: string) {
  //   return this.userRepository.update( id, {twoFactorAuthenticationSecret,} );
  // }

  // async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
  //   this.setTwoFactorAuthSecret(userId, secret);
  // }

  // FUNCTION IS NOT YET USED
  async setTfaOption(username: string, option: boolean): Promise<UpdateResult> {
    try {
      const user: User = await this.findUserByUsername(username);
      
      return await this.userRepository
        .createQueryBuilder()
        .update(user)
        .set({ isTfaEnabled: option })
        .where({ id: user.id })
        .returning("*")
        .execute();
    } catch (err: any) {
      throw errorHandler(
        err,
        "Failed to set user tfa option",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async seedCustom(amount: number): Promise<User[]> {
    try {
      for (let i = 1; i <= amount; i++) {
        console.log("yoyo");
        let genIntraId = randUserName();
        await this.createUser(genIntraId, "lolo");
        await this.setUser(genIntraId, {
          username: randFullName(),
          color: randColor().toString(),
          description: randParagraph()
        });
      }
      return this.getUsers();
    } catch (err: any) {
      throw errorHandler(
        err,
        "Failed to seed database",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
