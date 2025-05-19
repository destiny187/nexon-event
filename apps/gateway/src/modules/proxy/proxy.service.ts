import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware, Options as ProxyOptions } from 'http-proxy-middleware';
import type {NextFunction, Request, Response} from 'express';

@Injectable()
export class ProxyService {
    private readonly logger = new Logger(ProxyService.name);
    private readonly proxyHandler: (req: Request, res: Response, next: NextFunction) => void;

    constructor(private readonly configService: ConfigService) {
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
                if (!match) return undefined;
                const resource = match[1];
                const route = routes.find(r => r.paths.includes(resource));
                return route.target;
            },

            on: {
                proxyReq: (proxyReq, req, res) => {
                    Object.entries(req.headers).forEach(([k, v]) => {
                        if (v !== undefined) proxyReq.setHeader(k, v as string);
                    });

                    proxyReq.setHeader('x-forwarded-host', req.headers.host ?? '');
                },

                proxyRes: (proxyRes, req, res) => {
                    res.setHeader('access-control-expose-headers', 'authorization, refresh-token');
                },

                error: (err, req, res) => {
                    this.logger.error(`Proxy error: ${err.message}`);
                },
            },

            timeout: 10_000,
            proxyTimeout: 10_000,
        };

        this.proxyHandler = createProxyMiddleware(proxyOptions);
    }

    handle(req: Request, res: Response, next: NextFunction) {
        return this.proxyHandler(req, res, next);
    }
}