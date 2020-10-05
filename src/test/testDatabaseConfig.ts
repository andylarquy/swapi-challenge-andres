import { MongoMemoryServer } from 'mongodb-memory-server'
import { Db, MongoClient } from 'mongodb'
import { InternalServerResponse } from "http-errors-response-ts/lib"

const mongoTestServer = new MongoMemoryServer()

export async function getTestDBConnection(): Promise<Db> {
    try {
        const uri = await mongoTestServer.getUri()
        const mongo = await MongoClient.connect(uri, { useUnifiedTopology: true })
        const db = mongo.db()
        return db
    } catch (error) {
        throw new InternalServerResponse('There was an error while accessing the database')
    }
}

export async function dropDatabaseMongoTestDB(): Promise<void> {
    const db = await getTestDBConnection()
    await db.dropDatabase()
}
