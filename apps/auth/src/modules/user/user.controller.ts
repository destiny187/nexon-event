import {Body, Controller, Get, Param, Patch, Post} from "@nestjs/common";
import {UserService} from "./user.service";
import {success} from "../../../../../libs/common/utils/response.util";
import {CreateUserDto, UpdateUserRolesDto} from "./user.dto";


@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('api/v1/users')
    async getUserAll() {
        const result = await this.userService.findAll();
        return success(result);
    }

    @Get('api/v1/users/:id')
    async getUser(@Param('id') id: string) {
        const result = await this.userService.findById(id);
        return success(result);
    }

    @Post('api/v1/users/signup')
    async create(@Body() createUserDto: CreateUserDto){
        return success(this.userService.signup(createUserDto));
    }

    @Patch('api/v1/users/:id/roles')
    async updateRoles(
        @Param('id') id: string,
        @Body() updateRolesDto: UpdateUserRolesDto,
    ){
        return success(this.userService.updateRoles(id, updateRolesDto));
    }
}