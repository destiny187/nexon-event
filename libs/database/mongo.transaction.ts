import {ClientSession, Connection} from "mongoose";
import {Logger} from "@nestjs/common";

export async function MongoTransaction<T>(
    connection: Connection,
    fn: (session: ClientSession) => Promise<T>
): Promise<T> {
    const session = await connection.startSession();
    try {
        return await session.withTransaction(() => fn(session));
    } finally {
        session.endSession();
    }
}