export interface RedisCacheModuleOptions {
    url: string;
    ttl?: number;
    prefix?: string;
    db?: number;
}