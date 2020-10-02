import { Vehicle } from "domain/Vehicle"
import { DatabaseEntry } from "services/databaseAPI/databaseConfig"
import { getVehicleCountById, setDBVehicleCount, validateDBVehicle } from "services/databaseAPI/databaseVehicle.service"
import { getSwapiVehicleById } from "services/swapiAPI/SwapiVehicle.service"

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

export async function setVehicleCountById(vehicleDB: DatabaseEntry): Promise<void> {

    validateDBVehicle(vehicleDB)

    // Check if vehicle exists in swapi API
    await getSwapiVehicleById(vehicleDB._id)

    // If it does we write in the database
    setDBVehicleCount(vehicleDB)
    // Return the vehicle with the new property

}