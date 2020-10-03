import { BadRequestResponse } from "http-errors-response-ts/lib"
import { DatabaseEntry } from "services/databaseAPI/databaseConfig"

import { getSwapiVehicleById } from "services/swapiAPI/swapiVehicle.service"
import { getSwapiStarshipById } from "services/swapiAPI/swapiStarship.service"

import { getItemCountById, setDBItemCount, validateDBItemToCreate, validateDBItemToUpdate} from "services/databaseAPI/itemDatabase.service"

import { Vehicle } from "domain/Vehicle"
import { Starship } from "domain/Starship"

export function index(): string {
    return 'The API REST is running'
}

/* ** VEHICLES ** */

export async function getVehicleById(vehicleId: string): Promise<Vehicle | string> {

    // Obtain vehicle from swapi API
    const swapiVehicle = await getSwapiVehicleById(vehicleId) as Vehicle

    // Obtain count from database
    const vehicleCount = await getItemCountById(vehicleId, 'vehicles')

    // Return the vehicle with the new property
    return { ...swapiVehicle, count: vehicleCount }
}

export async function updateVehicleCountById(vehicleDB: DatabaseEntry): Promise<void> {

    validateDBItemToUpdate(vehicleDB)

    // Check if vehicle exists in swapi API
    await getSwapiVehicleById(vehicleDB._id)

    // If it does we check if it is possible to update the count value
    const currentVehicleCount = await getItemCountById(vehicleDB._id, 'vehicles')

    // In case it isn't we throw an error
    if (currentVehicleCount + vehicleDB.count < 0) {
        throw new BadRequestResponse("The final ammount of items can't be less than 0")
    }

    // In case it is we update the value
    const newVehicleDB = { _id: vehicleDB._id, count: currentVehicleCount + vehicleDB.count }
    setDBItemCount(newVehicleDB, 'vehicles')
}

export async function setVehicleCountById(vehicleDB: DatabaseEntry): Promise<void> {

    validateDBItemToCreate(vehicleDB)

    // Check if vehicle exists in swapi API
    await getSwapiVehicleById(vehicleDB._id)

    // If it does we write in the database
    setDBItemCount(vehicleDB, 'vehicles')
}

/* ** STARSHIPS ** */

export async function getStarshipById(starshipId: string): Promise<Starship | string> {

    // Obtain starship from swapi API
    const swapiStarship = await getSwapiStarshipById(starshipId) as Starship

    // Obtain count from database
    const starhsipCount = await getItemCountById(starshipId, 'starships')

    // Return the starship with the new property
    return { ...swapiStarship, count: starhsipCount }
}

export async function updateStarshipCountById(starshipDB: DatabaseEntry): Promise<void> {

    validateDBItemToUpdate(starshipDB)

    // Check if starship exists in swapi API
    await getSwapiStarshipById(starshipDB._id)

    // If it does we check if it is possible to update the count value
    const currentStarshipCount = await getItemCountById(starshipDB._id, 'starships')

    // In case it isn't we throw an error
    if (currentStarshipCount + starshipDB.count < 0) {
        throw new BadRequestResponse("The final ammount of items can't be less than 0")
    }

    // In case it is we update the value
    const newStarshipDB = { _id: starshipDB._id, count: currentStarshipCount + starshipDB.count }
    setDBItemCount(newStarshipDB, 'starships')
}

export async function setStarshipCountById(starshipDB: DatabaseEntry): Promise<void> {

    validateDBItemToCreate(starshipDB)

    // Check if starship exists in swapi API
    await getSwapiStarshipById(starshipDB._id)

    // If it does we write in the database
    setDBItemCount(starshipDB, 'starships')
}

