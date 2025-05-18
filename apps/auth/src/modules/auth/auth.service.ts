import { Injectable } from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmailForAuth(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;

    const { password, ...ret } = user.toObject();
    return ret;
  }

   login(user: any) {
    const payload = { userId: user._id, email: user.email, roles: user.roles };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
