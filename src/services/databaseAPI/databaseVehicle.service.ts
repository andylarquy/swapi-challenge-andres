import { DatabaseEntry, getDBConnection } from "./databaseConfig"

export async function getVehicleCountById(vehicleId: string): Promise<number> {

    const db = await getDBConnection()

    let vehicle = await db.collection('vehicles').findOne({ id: vehicleId })

    if (vehicle === null) {
        await setDBVehicleCount({ id: vehicleId, count: 0 })
        vehicle = await db.collection('vehicles').findOne({ id: vehicleId })
    }

    return vehicle.count
}

async function setDBVehicleCount(entry: DatabaseEntry): Promise<void> {
    const db = await getDBConnection()

    try {
        await db.collection('vehicles').insertOne(entry)
    } catch (error) {
        throw Error('There was an error while writing in the database')
    }
}