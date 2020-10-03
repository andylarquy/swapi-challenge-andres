import { BadRequestResponse } from "http-errors-response-ts/lib"
import { DatabaseEntry } from "services/databaseAPI/databaseConfig"
import { getSwapiVehicleById } from "services/swapiAPI/SwapiVehicle.service"
import { getVehicleCountById, setDBVehicleCount, validateDBVehicleToCreate, validateDBVehicleToUpdate } from "services/databaseAPI/databaseVehicle.service"
import { Vehicle } from "domain/Vehicle"

export function index(): string {
    return 'The API REST is running'
}

export async function getVehicleById(vehicleId: string): Promise<Vehicle | string> {

    // Obtain vehicle from swapi API
    const swapiVehicle = await getSwapiVehicleById(vehicleId) as Vehicle

    // Obtain count from database
    const vehicleCount = await getVehicleCountById(vehicleId)

    // Return the vehicle with the new property
    return { ...swapiVehicle, count: vehicleCount }
}

export async function updateVehicleCountById(vehicleDB: DatabaseEntry): Promise<void> {

    validateDBVehicleToUpdate(vehicleDB)

    // Check if vehicle exists in swapi API
    await getSwapiVehicleById(vehicleDB._id)

    // If it does we check if it is possible to update the count value
    const currentVehicleCount = await getVehicleCountById(vehicleDB._id)

    console.log('currentVehicleCount: ', currentVehicleCount)
    console.log('vehicleDB.count: ', vehicleDB.count)

    // In case it isn't we throw an error
    if (currentVehicleCount + vehicleDB.count < 0) {
        throw new BadRequestResponse("The final ammount of items can't be less than 0")
    }

    // In case it is we update the value
    const newVehicleDB = { _id: vehicleDB._id, count: currentVehicleCount + vehicleDB.count }
    setDBVehicleCount(newVehicleDB)
}

export async function setVehicleCountById(vehicleDB: DatabaseEntry): Promise<void> {

    validateDBVehicleToCreate(vehicleDB)

    // Check if vehicle exists in swapi API
    await getSwapiVehicleById(vehicleDB._id)

    // If it does we write in the database
    setDBVehicleCount(vehicleDB)
}
