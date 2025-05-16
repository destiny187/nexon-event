import {Module, NestModule, MiddlewareConsumer, RequestMethod, Logger} from '@nestjs/common';
import { createProxyMiddleware, Options as ProxyOptions } from 'http-proxy-middleware';
import {ConfigModule, ConfigService} from "@nestjs/config";


@Module({
    imports: [ ConfigModule ],
})
export class ProxyModule implements NestModule {
    private readonly logger = new Logger(ProxyModule.name);
    constructor(private readonly configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        const routes = [
            {
                target: this.configService.get<string>('AUTH_URL'),
                paths: ['auth', 'users'],
            },
            {
                target: this.configService.get<string>('EVENT_URL'),
                paths: ['events'],
            },
        ];

        const proxyOptions: ProxyOptions = {
            changeOrigin: true,
            router: req => {
                this.logger.log(`Request URL: ${req.url}`);
                const match = req.url.match(/^\/api\/v\d+\/([^\/]+)/);
                this.logger.log(`match: ${match}`);
                if (!match) return undefined;
                const resource = match[1];
                const route = routes.find(r => r.paths.includes(resource));
                this.logger.log(`route: ${JSON.stringify(route)}`);
                return route.target;
            },
        };
        consumer
            .apply(createProxyMiddleware(proxyOptions))
            .forRoutes({ path: '/api/:path(.*)', method: RequestMethod.ALL })
    }
}