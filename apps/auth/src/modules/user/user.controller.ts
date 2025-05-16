import {Controller, Get, Param} from "@nestjs/common";
import {UserService} from "./user.service";
import {success} from "../../../../../libs/common/utils/response.util";


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


}