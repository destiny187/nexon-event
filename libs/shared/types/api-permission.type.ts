import {MatchFunction} from "path-to-regexp";
import {UserRole} from "../enums/user-enum";

export interface CompiledApiPermission {
    method: string;
    matcher: MatchFunction<any>;
    roles: UserRole[];
    rawPath: string;
}

export interface RawApiPermission {
    method: string;
    path: string;
    roles: UserRole[];
}