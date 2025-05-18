import {Module, Global, DynamicModule} from '@nestjs/common';
import {CacheModule} from '@nestjs/cache-manager';
import {RedisCacheModuleOptions} from "../shared/types/redis-cache.type";
import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";


@Global()
@Module({})
export class RedisCacheModule {
    static forRoot(options: RedisCacheModuleOptions): DynamicModule {
        return {
            module: RedisCacheModule,
            imports: [
                CacheModule.registerAsync({
                    isGlobal: true,
                    // useFactory: async () => {
                    //     const { url, ttl = 0, prefix = '' } = options;
                    //
                    //     const keyv = new Keyv({
                    //         store: new KeyvRedis(url),
                    //         namespace: prefix,
                    //     });
                    //
                    //     return {
                    //         ttl,
                    //         store: keyv,
                    //     };
                    // },
                    useFactory: async () => ({
                        stores: [
                            new Keyv({ store: new KeyvRedis(options.url, {namespace: ''}), namespace: '', ttl: options.ttl }),
                        ],
                    }),
                }),
            ],
            exports: [CacheModule],
        };
    }
}