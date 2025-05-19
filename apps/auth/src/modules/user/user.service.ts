import {ConflictException, Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from '@nestjs/mongoose';
import {Connection, Model} from 'mongoose';
import {Invitation, User} from "./user.schema";
import {CreateUserDto, UpdateUserRolesDto} from "./user.dto";
import {MongoTransaction} from "../../../../../libs/database/mongo.transaction";
import {toObjectId} from "../../../../../libs/common/utils/type-util";

@Injectable()
export class UserService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Invitation.name) private readonly invitationModel: Model<Invitation>,
    ) {}

    async signup(dto: CreateUserDto): Promise<string> {
        const { inviterCode, ...userPart } = dto;

        return await MongoTransaction(this.connection, async (session) => {
            let created: User;
            try {
                created = await this.userModel.create([userPart], { session }).then(([u]) => u);
            } catch (err: any) {
                if (err.code === 11000 && err.keyValue?.email) {
                    throw new ConflictException('email already exist');
                }
                throw err;
            }

            if (inviterCode) {
                const inviter = await this.userModel
                    .findOne({ referralCode: inviterCode })
                    .select('_id')
                    .lean({ session });

                if (inviter) {
                    await this.invitationModel.create(
                        [{
                            inviterId: inviter._id,
                            inviteeId: created._id,
                            status:    "ACCEPTED",
                            acceptedAt: new Date(),
                        }],
                        { session },
                    );
                }
            }

            return 'success';
        });
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

    async countInvitationAccepted(inviterId: string, startAt: string, endAt: string): Promise<number> {
        return this.invitationModel.countDocuments({
            inviterId: toObjectId(inviterId),
            status: 'ACCEPTED',
            acceptedAt: { $gte: new Date(startAt), $lte: new Date(endAt) },
        });
    }
}