import {ApiResponse} from "../../shared/dto/api-response.dto";

export function success<T>(data: T): ApiResponse<T> {
    return { code: 200, data };
}

export function error(code: number, message: string): ApiResponse<null> {
    return { code, data: null, message };
}