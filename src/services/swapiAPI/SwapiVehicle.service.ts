import { Vehicle } from "domain/Vehicle"
import { SWAPI_SERVER_URL } from "./swapiServerConfig"
import Axios from "axios"

export async function getSwapiVehicleById(vehicleId: string): Promise<Vehicle | string> {
    try {
        const vehicle = await Axios.get(SWAPI_SERVER_URL + '/vehicles/' + vehicleId)
        return Vehicle.fromJson(vehicle.data)
    } catch (error) {
        if (error.response) {
            throw (error.response.data)
        } else {
            throw '{ "message":"There was an unknown error retrieving the vehicle"}'
        }
    }

}
