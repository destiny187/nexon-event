import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException, Inject, Logger,
} from '@nestjs/common';
import {UserRole} from "../../../../../libs/shared/enums/user-enum";
import {ConfigService} from "@nestjs/config";
import {CACHE_MANAGER, Cache} from "@nestjs/cache-manager";
import {CompiledApiPermission, RawApiPermission} from "../../../../../libs/shared/types/api-permission.type";
import {CacheKeys} from "../../../../../libs/common/constants/cache-keys";
import axios from "axios";
import {match} from "path-to-regexp";
import {isEmpty} from "lodash";

@Injectable()
export class RoleGuard implements CanActivate {
    private compiled: CompiledApiPermission[] = [];
    private readonly logger = new Logger(RoleGuard.name);

    constructor(
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const userRoles: UserRole[] = req.user?.roles ?? [];

        if (!req.user) return false;

        // 1. ADMIN pass
        if (userRoles.includes(UserRole.ADMIN)) {
            return true;
        }

        const method = req.method;
        const path = req.originalUrl.split('?')[0];


        // 2. Get roles from redis
        let perms: RawApiPermission[] = await this.cache.get(CacheKeys.API_PERMISSIONS);
        // 3. If it's a cache miss, call auth server
        if (!perms || isEmpty(this.compiled)) {
            try {
                this.logger.log('api permission cache is empty');
                perms = await axios.get(
                    `${this.configService.get<string>('AUTH_URL')}/api/v1/auth/api-permissions/check`,
                    {
                        headers: {
                            'x-internal': 'true',
                        }
                    }
                ).then(response => {
                    return response.data;
                });
                this.compiled = perms.map(p => ({
                    method: p.method.toUpperCase(),
                    matcher: match(p.path, {decode: decodeURIComponent, end: true}),
                    roles: p.roles,
                    rawPath: p.path,
                }));

            } catch (err) {
                this.logger.error('Failed to get api-permission from auth server.', err);
                throw new ForbiddenException('Failed to get api-permission from auth server.');
            }
        }

        const perm = this.compiled.find(rule => {
            if (rule.method !== method.toUpperCase()) return false;
            const result = rule.matcher(path);
            return result !== false;
        });

        if (!perm) {
            // FIXME: Temporary
            this.logger.warn(`No permission rule: ${method} ${path}`);
            return true;
            // throw new ForbiddenException('NO_PERMISSION_RULE');
        }

        // 4.Role check
        const allowed = userRoles.some((r) => perm.roles.includes(r));
        if (!allowed) {
            this.logger.warn(`Forbidden: ${method} ${path} for roles ${userRoles}`);
            throw new ForbiddenException('You do not have permission');
        }

        return true;
    }
}