import { BadRequestResponse, InternalServerResponse } from "http-errors-response-ts/lib"
import { DatabaseEntry, getDBConnection } from "./databaseConfig"

export async function getItemCountById(itemId: string, itemType: string): Promise<number> {

    const db = await getDBConnection()

    let item = await db.collection(itemType).findOne({ _id: itemId })

    if (item === null) {
        await setDBItemCount({ _id: itemId, count: 0 }, itemType)
        item = await db.collection(itemType).findOne({ _id: itemId })
    }

    return item.count
}

export async function setDBItemCount(entry: DatabaseEntry, itemType: string): Promise<void> {
    const db = await getDBConnection()

    try {
        await db.collection(itemType).updateOne(
            { '_id': entry._id },
            { $set: entry },
            { upsert: true })
    } catch (error) {
        throw new InternalServerResponse('There was an error while writing in the database')
    }
}

export function validateDBItemToCreate(entry: DatabaseEntry): void {

    validateDBItemToUpdate(entry)

    if (entry.count < 0) {
        throw new BadRequestResponse("Property 'count' can't be less than 0")
    }
}

export function validateDBItemToUpdate(entry: DatabaseEntry): void {
    if (!entry._id) {
        throw new BadRequestResponse("Missing property 'id'")
    }

    if (typeof (entry._id) !== 'string') {
        throw new BadRequestResponse('ID should be a string')
    }

    if (entry.count == null) {
        throw new BadRequestResponse("Missing property 'count'")
    }

    if (typeof (entry.count) !== 'number') {
        throw new BadRequestResponse("Property 'count' should be a number")
    }

    if (!Number.isInteger(entry.count)) {
        throw new BadRequestResponse("Property 'count' has to be an integer")
    }
}
