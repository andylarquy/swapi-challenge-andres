import { MongoClient, Db } from "mongodb"
import {InternalServerResponse } from "http-errors-response-ts/lib"

export type DatabaseEntry = { _id: string, count: number }
const uri = "mongodb://localhost:27017/swapi"

export async function getDBConnection(): Promise<Db> {
    try {
        const mongo = new MongoClient(uri)
        await mongo.connect()
        return mongo.db()
    } catch (error) {
        throw new InternalServerResponse('There was an error while accessing the database')
    }
}
