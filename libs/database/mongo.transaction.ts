import {ClientSession, Connection} from "mongoose";

export async function MongoTransaction<T>(
    connection: Connection,
    fn: (session: ClientSession) => Promise<T>
): Promise<T> {
    const session = await connection.startSession();
    try {
        return await session.withTransaction(() => fn(session));
    } catch (err) {
        throw err;
    } finally {
        session.endSession();
    }
}