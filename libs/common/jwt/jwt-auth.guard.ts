import { AuthGuard } from '@nestjs/passport';
import {ExecutionContext, Injectable, SetMetadata} from "@nestjs/common";
import {Reflector} from "@nestjs/core";

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();

        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) return true;

        //FIXME: Internal API security needs to be enhanced.
        const isInternal = request.headers['x-internal'] == 'true';
        if (isInternal) return true;
        return super.canActivate(context);
    }
}