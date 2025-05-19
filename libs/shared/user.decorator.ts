import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'libs/shared/types/jwt-payload.type';

export const User = createParamDecorator(
    (data: keyof JwtPayload | undefined, context: ExecutionContext): any => {
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayload;
        return data ? user?.[data] : user;
    },
);