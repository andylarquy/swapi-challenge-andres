import { Starship } from "domain/Starship"
import { SWAPI_SERVER_URL } from "./swapiServerConfig"
import Axios from "axios"
import {BadRequestResponse } from "http-errors-response-ts/lib"

export async function getSwapiStarshipById(starshipId: string): Promise<Starship | string> {
    try {
        const starship = await Axios.get(SWAPI_SERVER_URL + '/starships/' + starshipId)
        return Starship.fromJson(starship.data)
    } catch (error) {
        if (error.response) {
            throw error
        } else {
            throw new BadRequestResponse('{ "message":"There was an unknown error retrieving the vehicle"}')
        }
    }

}
