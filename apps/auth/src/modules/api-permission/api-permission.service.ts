import {
    Injectable,
    Inject,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {CreatePermissionDto, UpdatePermissionDto} from "./api-permission.dto";
import {ApiPermission} from "../../../../../libs/database/schemas/api-permission.schema";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {CacheKeys, CacheTTLs} from "../../../../../libs/common/constants/cache-keys";
import {RawApiPermission} from "../../../../../libs/shared/types/api-permission.type";
import {Cache} from 'cache-manager';

@Injectable()
export class ApiPermissionService {
    private readonly logger = new Logger(ApiPermissionService.name);

    constructor(
        @InjectModel(ApiPermission.name) private readonly apiPermissionModel: Model<ApiPermission>,
        @Inject(CACHE_MANAGER) private cache: Cache,
    ) {
    }

    async getAllPermissionsAndCache(): Promise<RawApiPermission[]> {
        const perms = await this.apiPermissionModel.find().lean();
        await this.cache.set(CacheKeys.API_PERMISSIONS, perms, CacheTTLs.API_PERMISSIONS);
        return perms;
    }

    private async resetCache(): Promise<void> {
        await this.cache.del(CacheKeys.API_PERMISSIONS);
    }

    async create(dto: CreatePermissionDto): Promise<ApiPermission> {
        const created = new this.apiPermissionModel(dto);
        const saved = await created.save();
        await this.resetCache();
        return saved;
    }

    async createMany(dtos: CreatePermissionDto[]): Promise<ApiPermission[]> {
        const inserted = await this.apiPermissionModel.insertMany(dtos);
        await this.resetCache();
        return inserted as ApiPermission[];
    }

    async createManyForInternal(dtos: CreatePermissionDto[]): Promise<ApiPermission[]> {
        const inserted = await this.apiPermissionModel.insertMany(dtos);
        return inserted as ApiPermission[];
    }

    async findAll(): Promise<ApiPermission[]> {
        return this.apiPermissionModel.find();
    }

    async findOne(id: string): Promise<ApiPermission> {
        const doc = await this.apiPermissionModel.findById(id);
        return doc;
    }

    async update(id: string, dto: UpdatePermissionDto): Promise<ApiPermission> {
        const updated = await this.apiPermissionModel.findByIdAndUpdate(id, dto, {new: true});
        if (!updated) throw new NotFoundException();
        await this.resetCache();
        return updated;
    }

    async remove(id: string): Promise<void> {
        const res = await this.apiPermissionModel.findByIdAndDelete(id);
        if (!res) throw new NotFoundException();
        await this.resetCache();
    }
}