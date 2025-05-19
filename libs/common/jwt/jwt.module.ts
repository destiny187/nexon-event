import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [
        JwtStrategy,
        Reflector,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
    ],
})
export class JwtModule {}