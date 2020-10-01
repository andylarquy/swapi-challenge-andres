import { Vehicle } from "domain/Vehicle"
import { getVehicleCountById } from "services/databaseAPI/databaseVehicle.service"
import { getSwapiVehicleById } from "services/swapiAPI/SwapiVehicle.service"

export function index(): string {
    return 'The API REST is running'
}

export async function getVehicleById(vehicleId: string): Promise<Vehicle | string> {
    let swapiVehicle: Vehicle
    try {
        // Obtain vehicle from swapi API
        swapiVehicle = await getSwapiVehicleById(vehicleId) as Vehicle

        // Obtain count from database
        const vehicleCount = await getVehicleCountById(vehicleId)

        // Return the vehicle with the new property
        return { ...swapiVehicle, count: vehicleCount }

    } catch (error) {
        // In case anything fails the errors are handled here
        if (error instanceof Error) {
            return `{"message": "${error.message}"}`
        } else {
            return error
        }

    }
}