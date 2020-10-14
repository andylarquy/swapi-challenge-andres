import { SWAPI_SERVER_URL } from "./swapiServerConfig"
import Axios from "axios"
import { BadRequestResponse } from "http-errors-response-ts/lib"

export async function getSwapiItemById(itemId: string, typeClass: any, itemCollection: string): Promise<typeof typeClass> {
    try {
        const item = await Axios.get(SWAPI_SERVER_URL + `/${itemCollection}/` + itemId)
        
        return typeClass.fromJson(item.data)
    } catch (error) {
        if (error.response) {
            throw error
        } else {
            throw new BadRequestResponse('{ "message":"There was an unknown error retrieving the item"}')
        }
    }
}
