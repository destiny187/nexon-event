import {ConfigModule} from "@nestjs/config";
import {Module} from "@nestjs/common";
import {ProxyService} from "./proxy.service";
import {ProxyController} from "./proxy.controller";
import {RedisCacheModule} from "../../../../../libs/redis/redis-cache-module";

@Module({
    imports: [ConfigModule, RedisCacheModule],
    providers: [ProxyService],
    controllers: [ProxyController],
})
export class ProxyModule {}