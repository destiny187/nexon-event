import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {User} from "./user.schema";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async create(createDto: { nickname: string; email: string; password: string }) {
        const created = new this.userModel(createDto);
        return created.save();
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async findById(id: string): Promise<User> {
        const result = await this.userModel.findById(id).exec();
        return result;
    }
}