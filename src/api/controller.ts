import { BadRequestResponse } from "http-errors-response-ts/lib"
import { DatabaseEntry } from "services/databaseAPI/databaseConfig"

import { getItemCountById, setDBItemCount, validateDBItemToCreate, validateDBItemToUpdate } from "services/databaseAPI/itemDatabase.service"

import { getSwapiItemById } from "services/swapiAPI/swapiAPI.service"

import { Vehicle } from "domain/Vehicle"
import { Starship } from "domain/Starship"

export function index(): string {
    return 'The API REST is running'
}

/* ** VEHICLES ** */

export async function getVehicleById(vehicleId: string): Promise<Vehicle | string> {

    // Obtain vehicle from swapi API
    const swapiVehicle = await getSwapiItemById(vehicleId, Vehicle, 'vehicles') as Vehicle

    // Obtain count from database
    const vehicleCount = await getItemCountById(vehicleId, 'vehicles')

    // Return the vehicle with the new property
    return { ...swapiVehicle, count: vehicleCount }
}

export async function updateVehicleCountById(vehicleDB: DatabaseEntry): Promise<void> {

    validateDBItemToUpdate(vehicleDB)

    // Check if vehicle exists in swapi API
    await getSwapiItemById(vehicleDB._id, Vehicle, 'vehicles') as Vehicle

    // If it does we check if it is possible to update the count value
    const currentVehicleCount = await getItemCountById(vehicleDB._id, 'vehicles')

    // In case it isn't we throw an error
    if (currentVehicleCount + vehicleDB.count < 0) {
        throw new BadRequestResponse("The final ammount of items can't be less than 0")
    }

    // In case it is we update the value
    const newVehicleDB = { _id: vehicleDB._id, count: currentVehicleCount + vehicleDB.count }
    await setDBItemCount(newVehicleDB, 'vehicles')
}

export async function setVehicleCountById(vehicleDB: DatabaseEntry): Promise<void> {

    validateDBItemToCreate(vehicleDB)

    // Check if vehicle exists in swapi API
    await getSwapiItemById(vehicleDB._id, Vehicle, 'vehicles') as Vehicle


    // If it does we write in the database
    await setDBItemCount(vehicleDB, 'vehicles')
}

/* ** STARSHIPS ** */

export async function getStarshipById(starshipId: string): Promise<Starship | string> {

    // Obtain starship from swapi API
    const swapiStarship = await getSwapiItemById(starshipId, Starship, 'starships') as Starship

    // Obtain count from database
    const starhsipCount = await getItemCountById(starshipId, 'starships')

    // Return the starship with the new property
    return { ...swapiStarship, count: starhsipCount }
}

export async function updateStarshipCountById(starshipDB: DatabaseEntry): Promise<void> {

    validateDBItemToUpdate(starshipDB)

    // Check if starship exists in swapi API
    await getSwapiItemById(starshipDB._id, Starship, 'starships') as Starship

    // If it does we check if it is possible to update the count value
    const currentStarshipCount = await getItemCountById(starshipDB._id, 'starships')

    // In case it isn't we throw an error
    if (currentStarshipCount + starshipDB.count < 0) {
        throw new BadRequestResponse("The final ammount of items can't be less than 0")
    }

    // In case it is we update the value
    const newStarshipDB = { _id: starshipDB._id, count: currentStarshipCount + starshipDB.count }
    await setDBItemCount(newStarshipDB, 'starships')
}

export async function setStarshipCountById(starshipDB: DatabaseEntry): Promise<void> {

    validateDBItemToCreate(starshipDB)

    // Check if starship exists in swapi API
    await getSwapiItemById(starshipDB._id, Starship, 'starships') as Starship


    // If it does we write in the database
    await setDBItemCount(starshipDB, 'starships')
}
