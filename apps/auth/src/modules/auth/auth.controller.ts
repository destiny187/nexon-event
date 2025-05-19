import {Controller, Post, Req, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {LocalAuthGuard} from "../local/local-auth.guard";
import {success} from "../../../../../libs/common/utils/response.util";
import {Public} from "../../../../../libs/common/jwt/jwt-auth.guard";

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('api/v1/auth/login')
  async login(@Req() req) {
    return success(this.authService.login(req.user));
  }
}
