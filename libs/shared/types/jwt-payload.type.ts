import {UserRole} from "../enums/user-enum";

export interface JwtPayload {
    userId: string;
    email: string;
    roles: UserRole[];
}