import { IsEnum, IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';
import {UserRole} from "../../../../../libs/shared/enums/user-enum";
import { PartialType } from '@nestjs/mapped-types';

export class CreatePermissionDto {
  @IsEnum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  method: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}