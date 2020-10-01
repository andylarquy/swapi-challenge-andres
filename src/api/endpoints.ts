import { Vehicle } from "domain/Vehicle"
import { getSwapiVehicleById } from "services/swapiAPI/SwapiVehicle.service"

export function index(): string {
    return 'The API REST is running'
}

export async function getVehicleById(vehicleId: string): Promise<Vehicle | string>{
    //Obtain vehicle from swapi API
    return await getSwapiVehicleById(vehicleId)

    //TODO: If vehicle exists then obtain count from database
    
    //return new Vehicle()

}