import {ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength} from 'class-validator';
import {UserRole} from "../../../../../libs/shared/enums/user-enum";

export class CreateUserDto {
    @IsNotEmpty()
    nickname: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(4)
    password: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(UserRole, { each: true })
    roles?: UserRole[];

    @IsString()
    inviterCode?: string;
}

export class UpdateUserRolesDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(UserRole, { each: true })
    roles: UserRole[];
}