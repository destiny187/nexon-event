import {ConflictException, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User} from "./user.schema";
import {CreateUserDto, UpdateUserRolesDto} from "./user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async signup(createUserDto: CreateUserDto): Promise<string> {
        try {
            const created = new this.userModel(createUserDto);
            await created.save();
            return 'success';
        } catch (err: any) {
            if (err.code === 11000 && err.keyValue?.email) {
                throw new ConflictException('email already exist');
            }
            throw err;
        }
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async findById(id: string): Promise<User> {
        return await this.userModel.findById(id).exec();
    }

    async findByEmailForAuth(email: string): Promise<User | null> {
        return await this.userModel.findOne({ email }).select('+password').exec();
    }

    async updateRoles(id: string, updateDto: UpdateUserRolesDto) {
        const updated = await this.userModel
            .findByIdAndUpdate(
                id,
                { roles: updateDto.roles },
                { new: true },
            )
            .select('-password')
            .exec();

        return 'success';
    }
}