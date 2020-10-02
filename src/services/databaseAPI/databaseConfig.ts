import { MongoClient, Db } from "mongodb"

export type DatabaseEntry = { _id: string, count: number }
const uri = "mongodb://localhost:27017/swapi"

export async function getDBConnection(): Promise<Db> {
    try {
        const mongo = new MongoClient(uri)
        await mongo.connect()
        return mongo.db()
    } catch (error) {
        throw Error('There was an error while accessing the database')
    }
}