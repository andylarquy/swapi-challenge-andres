import request from 'supertest'
import { app } from '../api/app'
import moxios from 'moxios'
import { vehicleData } from "./stubData"
import { dropDatabaseMongoTestDB } from "./testDatabaseConfig"
import { getItemCountById } from 'services/databaseAPI/itemDatabase.service'

beforeEach(async () => {
    moxios.install()
    return dropDatabaseMongoTestDB()
})

describe('When you send a GET /vehicles/:vehicleID', () => {

    beforeAll(() => {
        moxios.uninstall()

        moxios.stubRequest(/vehicles.*/, {
            status: 404,
            response: '{"details": "Not Found"}'
        })
    })

    it("Should fail if the ID is not numeric", async () => {

        const result = await request(app).get('/vehicles/asd').send()

        expect(result.status).toBe(404)
    })


    it('Should fail if the ID is not found', async () => {

        const result = await request(app).get('/vehicles/9').send()

        expect(result.status).toBe(404)
    })

    describe("And you didn't set on the DB the counter for that vehicle", () => {

        beforeAll(async () => {
            moxios.uninstall()

            moxios.stubRequest('https://swapi.dev/api/vehicles/8', {
                status: 200,
                response: vehicleData[0]
            })
        })


        it('Should return a status 200 OK', async () => {



            const result = await request(app).get('/vehicles/8').send()

            expect(result.status).toBe(200)
        })

        it('The database count should be 0 ', async () => {

            await request(app).get('/vehicles/8').send()
            const count = await getItemCountById('8', 'vehicles')

            expect(count).toBe(0)
        })
    })
})
