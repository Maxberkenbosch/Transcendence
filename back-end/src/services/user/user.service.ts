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

// idk, angi wat is deze
import * as bcrypt from "bcrypt";

// dtos
import { SetUserDto } from "src/dtos/user/set-user.dto";
import { UsernameDto } from "src/dtos/auth/username.dto";

/**
 * User services
 *
 * Contains all typeorm sql injections.
 * Some functions that not yet used:
 * - set2faSecret
 * - update2faSecret is being used in tfa.service
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getUsers(): Promise<User[]> {
    try {
      const ret = await this.userRepository.find();
      return Promise.resolve(ret);
    } catch (err: any) {
      throw err;
    }
  }

  async findUsersById(id: number): Promise<User> {
    try {
      const ret = await this.userRepository.findOne({ where: { id } });
      return Promise.resolve(ret);
    } catch (err: any) {
      throw err;
    }
  }

  async findUserByintraId(intraId: string): Promise<User> {
    try {
      const ret = await this.userRepository.findOne({ where: { intraId } });
      return Promise.resolve(ret);
    } catch (err: any) {
      throw err;
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    try {
      const ret = await this.userRepository.findOne({ where: { username } });
      return Promise.resolve(ret);
    } catch (err: any) {
      throw err;
    }
  }

  async createUser(intraID: string): Promise<User> {
    try {
      if (await this.findUserByintraId(intraID)) return null;
      const newUser = this.userRepository.create({ intraId: intraID });
      const ret = await this.userRepository.save(newUser);

      return Promise.resolve(ret);
    } catch (err: any) {
      throw err;
    }
  }

  async setUser(
    intraID: string,
    SetUserDto: SetUserDto
  ): Promise<any> {
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
      throw err;
    }
  }

  async removeUser(username: string): Promise<DeleteResult> {
    try {
      const user = await this.userRepository
        .createQueryBuilder("Users")
        .delete()
        .from("users")
        .where("username =:username", { username })
        .execute();
      return Promise.resolve(user);
    } catch (err: any) {
      throw err;
    }
  }

  async setRefreshToken(
    userDto: UsernameDto,
    token: string
  ): Promise<UpdateResult> {
    try {
      const user = await this.findUserByUsername(userDto.username);
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(token, saltOrRounds); // <- deze

      return await this.userRepository
        .createQueryBuilder()
        .update(user)
        .set({ refreshToken: hash })
        .where({ id: user.id })
        .returning("*")
        .execute();
    } catch (err: any) {
      throw err;
    }
  }

  async set2faSecret(id: number, tfaSecret: string): Promise<UpdateResult> {
    try {
      const ret = await this.userRepository.update(id, { tfaSecret });
      return Promise.resolve(ret);
    } catch (err: any) {
      throw err;
    }
  }

  async update2faSecret(
    userDto: UsernameDto,
    secret: string
  ): Promise<UpdateResult> {
    try {
      const user = await this.findUserByUsername(userDto.username);
      const ret = await this.userRepository
        .createQueryBuilder()
        .update(user)
        .set({ tfaSecret: secret })
        .where({ id: user.id })
        .returning("*")
        .execute();
      return Promise.resolve(ret);
    } catch (err: any) {
      throw err;
    }
  }

  // setTwoFactorAuthSecret(id: number, twoFactorAuthenticationSecret: string) {
  //   return this.userRepository.update( id, {twoFactorAuthenticationSecret,} );
  // }

  // async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
  //   this.setTwoFactorAuthSecret(userId, secret);
  // }

  async setTfa(username: string, option: boolean): Promise<UpdateResult> {
    try {
      const user = await this.findUserByUsername(username);

      const ret = await this.userRepository
        .createQueryBuilder()
        .update(user)
        .set({ isTfaEnabled: option })
        .where({ id: user.id })
        .returning("*")
        .execute();
      return Promise.resolve(ret);
    } catch (err: any) {
      throw err;
    }
  }

  async seedCustom(amount: number): Promise<User[]> {
    try {
      for (let i = 1; i <= amount; i++) {
        let genIntraId = randUserName();
        await this.createUser(genIntraId);
        await this.setUser(genIntraId, {
          username: randFullName(),
          color: randColor().toString(),
          description: randParagraph()
        });
      }
      return this.getUsers();
    } catch (err: any) {
      throw err;
    }
  }
}
