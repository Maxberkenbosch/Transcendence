import { Injectable, ForbiddenException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Axios from "axios";
import { User } from "src/entities";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UpdateResult } from "typeorm";
import { intraIDDto } from "src/dtos/auth/intraID.dto";
import { createHash } from "crypto";

const jwt = require("jsonwebtoken");

type PayloadType = {
  intraID: string;
};

interface AuthTokenType {
  accesToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  inject: [ConfigService];
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  getBearerToken(token: string): Promise<any> {
    return Axios.post(this.configService.get<string>("INTRA_TOKEN_URL"), null, {
      params: {
        grant_type: "authorization_code",
        client_id: this.configService.get<string>("FORTYTWO_APP_ID"),
        client_secret: this.configService.get<string>("FORTYTWO_APP_SECRET"),
        code: token,
        redirect_uri: this.configService.get<string>("FORTYTWO_CALLBACK_URL")
      }
    });
  }

  getUserData(bearerToken: string): Promise<any> {
    return Axios.get(this.configService.get("INTRA_GET_ME_URL"), {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });
  }

  jwtDecodeUsername(jwt: string): string {
    const decodedJwt = this.jwtService.decode(jwt) as PayloadType;
    return decodedJwt.intraID;
  }

  async getTokens(intraID: string) {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            intraID
          },
          {
            secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
            expiresIn: "15m"
          }
        ),
        this.jwtService.signAsync(
          {
            intraID
          },
          {
            secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
            expiresIn: "7d"
          }
        )
      ]);

      return {
        accessToken,
        refreshToken
      };
    } catch (e) {
      // console.error(e);
      return e;
    }
  }

  async createNewRefreshTokens(refreshToken: string) {

    //****    verify if it's a valid refresh token
    const secret: string = this.configService.get<string>("JWT_REFRESH_SECRET");
    const isValidRefToken: string = jwt.verify(refreshToken, secret);

    if (!isValidRefToken)
      throw new ForbiddenException("Access Denied: Not a valid Token");

    //****    decode token to get intraID
    const decoded: PayloadType = this.jwtService.decode(
      refreshToken
    ) as PayloadType;

    if (!decoded) throw new ForbiddenException("Access Denied: Cannot decode");

    try {
      //****  get user by intraid to see if person exists
      const user: User = await this.userService.findUserByintraId(
        decoded.intraID
      );

      if (!user || !user.refreshToken) //this??
        throw new ForbiddenException("Access Denied: No user in database");

        //****  hash the token to be able to compare and validate it to the hashed token in the database
      const hash = createHash("sha256").update(refreshToken).digest("hex");

      //****  update token in the backend
      const tokens: { accessToken: string; refreshToken: string } =
        await this.getTokens(decoded.intraID);

      const intraIDDto = { intraID: decoded.intraID };
      const addUser: UpdateResult = await this.userService.setRefreshToken(
        intraIDDto,
        tokens.refreshToken
      );
      if (!addUser)
        throw new ForbiddenException("Access Denied: Failed to add token");
      return tokens;
    } catch (e) {
      // console.error(e);
      return e;
    }
  }


  //TODO: remove all extra info after access denied in the throw errors. Could be used to figure out how the program works
  async refreshTokens(refreshToken: string) {

    //****    verify if it's a valid refresh token
    const secret: string = this.configService.get<string>("JWT_REFRESH_SECRET");
    const isValidRefToken: string = jwt.verify(refreshToken, secret);

    if (!isValidRefToken)
      throw new ForbiddenException("Access Denied: Not a valid Token");

    //****    decode token to get intraID
    const decoded: PayloadType = this.jwtService.decode(
      refreshToken
    ) as PayloadType;

    if (!decoded) throw new ForbiddenException("Access Denied: Cannot decode");

    try {
      //****  get user by intraid to see if person exists
      const user: User = await this.userService.findUserByintraId(
        decoded.intraID
      );

      if (!user || !user.refreshToken)
        throw new ForbiddenException("Access Denied: No user in database");

        //****  hash the token to be able to compare and validate it to the hashed token in the database
      const hash = createHash("sha256").update(refreshToken).digest("hex");
      const isMatch: boolean = await bcrypt.compare(hash, user.refreshToken);

      if (isMatch == false)
        throw new ForbiddenException("Access Denied: Not a match");

      //****  update token in the backend
      const tokens: { accessToken: string; refreshToken: string } =
        await this.getTokens(decoded.intraID);

      const intraIDDto = { intraID: decoded.intraID };
      const addUser: UpdateResult = await this.userService.setRefreshToken(
        intraIDDto,
        tokens.refreshToken
      );
      if (!addUser)
        throw new ForbiddenException("Access Denied: Failed to add token");
      return tokens;
    } catch (e) {
      // console.error(e);
      return e;
    }
  }

  addReftoken(userDto: intraIDDto, token: string) {
    this.userService.setRefreshToken(userDto, token);
  }
}
