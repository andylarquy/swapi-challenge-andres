/* eslint-disable max-len */
import { Vehicle } from "domain/Vehicle"
import { SWAPI_SERVER_URL } from "./SwapiServerConfig"
import Axios from "axios"

//TODO: Handle response
export async function getSwapiVehicleById(vehicleId: string): Promise<Vehicle | string> {
    try {
        const vehicle = await Axios.get(SWAPI_SERVER_URL + '/vehicles/' + vehicleId)
        return Vehicle.fromJson(vehicle.data)
    } catch (error) {
        if (error.response) {
            return (error.response.data)
        } else {
            return '{ "message":"There was an unknown error retrieving the vehicle"}'
        }
    }
}
