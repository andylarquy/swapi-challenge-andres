import { BadRequestResponse, InternalServerResponse } from "http-errors-response-ts/lib"
import { DatabaseEntry, getDBConnection } from "./databaseConfig"

export async function getVehicleCountById(vehicleId: string): Promise<number> {

    const db = await getDBConnection()

    let vehicle = await db.collection('vehicles').findOne({ _id: vehicleId })

    if (vehicle === null) {
        await setDBVehicleCount({ _id: vehicleId, count: 0 })
        vehicle = await db.collection('vehicles').findOne({ _id: vehicleId })
    }

    return vehicle.count
}

export async function setDBVehicleCount(entry: DatabaseEntry): Promise<void> {
    const db = await getDBConnection()

    try {
        await db.collection('vehicles').updateOne(
            { '_id': entry._id },
            { $set: entry },
            { upsert: true })
    } catch (error) {
        throw new InternalServerResponse('There was an error while writing in the database')
    }
}

// TODO: Decide if it's worth reuse the logic between these two 
export function validateDBVehicleToCreate(entry: DatabaseEntry): void {
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

    if (entry.count < 0) {
        throw new BadRequestResponse("Property 'count' can't be less than 0")
    }
}

export function validateDBVehicleToUpdate(entry: DatabaseEntry): void {
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
}
