import {Body, Controller, Delete, Get, Param, Patch, Post,} from '@nestjs/common';
import {CreatePermissionDto, UpdatePermissionDto} from "./api-permission.dto";
import {ApiPermissionService} from "./api-permission.service";
import {success} from "../../../../../libs/common/utils/response.util";
import {Public} from "../../../../../libs/common/jwt/jwt-auth.guard";

@Controller()
export class ApiPermissionManagerController {
    constructor(private readonly ApiPermissionService: ApiPermissionService) {}

    @Post('api/v1/auth/api-permissions/bulk')
    async createBulk(@Body() dtos: CreatePermissionDto[]) {
        return success(this.ApiPermissionService.createMany(dtos));
    }

    @Post('api/v1/auth/api-permissions')
    async create(@Body() dto: CreatePermissionDto) {
        return success(this.ApiPermissionService.create(dto));
    }

    @Get('api/v1/auth/api-permissions')
    async findAll() {
        return success(this.ApiPermissionService.findAll());
    }

    @Get('api/v1/auth/api-permissions/check')
    async findAllAndCache() {
        return await this.ApiPermissionService.getAllPermissionsAndCache();
    }

    @Get('api/v1/auth/api-permissions/:id')
    async findOne(@Param('id') id: string) {
        return success(this.ApiPermissionService.findOne(id));
    }

    @Patch('api/v1/auth/api-permissions/:id')
    async update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
        return success(this.ApiPermissionService.update(id, dto));
    }

    @Delete('api/v1/auth/api-permissions/:id')
    async remove(@Param('id') id: string) {
        await this.ApiPermissionService.remove(id);
        return success({ success: true });
    }
}