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
        throw Error('There was an error while writing in the database')
    }
}

export function validateDBVehicle(entry: DatabaseEntry): void {
    if (!entry._id) {
        throw new Error("Missing property 'id'")
    }

    if (typeof (entry._id) === 'number') {
        throw new Error('ID should be a string')
    }

    if (entry.count == null) {
        throw new Error("Missing property 'count'")
    }

    if (entry.count < 0) {
        throw new Error("Property 'count' can't be less than 0")
    }
}