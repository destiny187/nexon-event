import { Controller, All, Req, Res, UseGuards, Next } from '@nestjs/common';
import {JwtAuthGuard, Public} from "../jwt/jwt-auth.guard";
import {ProxyService} from "./proxy.service";
import {RoleGuard} from "../role/role.guard";

@Controller()
export class ProxyController {
    constructor(private readonly proxyService: ProxyService) {}


    // Public API
    @Public()
    @All(['api/v1/auth/login', 'api/v1/users/signup'])
    proxyAuthPaths(@Req() req, @Res() res, @Next() next) {
        return this.proxyService.handle(req, res, next);
    }

    // APIs
    @UseGuards(JwtAuthGuard)
    @UseGuards(RoleGuard)
    @All('api/:path(.*)')
    proxyAll(@Req() req, @Res() res, @Next() next) {
        return this.proxyService.handle(req, res, next);
    }
}