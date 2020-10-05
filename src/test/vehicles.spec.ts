import request from 'supertest'
import { app } from '../api/app'
import moxios from 'moxios'
import { vehicleData } from "./stubData"
import { dropDatabaseMongoTestDB } from "./testDatabaseConfig"
import { setDBItemCount } from 'services/databaseAPI/itemDatabase.service'

beforeEach(async () => {
    moxios.install()
})

describe('When you send a GET /vehicles/:vehicleID', () => {

    beforeAll(async () => {
        moxios.uninstall()
        await dropDatabaseMongoTestDB()
    })

    it("Should fail if the ID is not numeric", async () => {
        moxios.stubRequest(/vehicles.*/, { status: 404, response: '{"details": "Not Found"}' })
        const result = await request(app).get('/vehicles/asd').send()

        expect(result.status).toBe(404)
    })


    it('Should fail if the ID is not found', async () => {
        moxios.stubRequest(/vehicles.*/, { status: 404, response: '{"details": "Not Found"}' })
        const result = await request(app).get('/vehicles/9').send()

        expect(result.status).toBe(404)
    })

    describe("And you didn't set the DB counter for that vehicle", () => {

        beforeAll(async () => {
            moxios.uninstall()
            await dropDatabaseMongoTestDB()
        })

        it('Should return a status 200 OK', async () => {
            moxios.stubRequest(/vehicles.*/, { status: 200, response: vehicleData[0] })
            const result = await request(app).get('/vehicles/8').send()

            expect(result.status).toBe(200)
        })

        it('The count should be 0', async () => {
            moxios.stubRequest(/vehicles.*/, { status: 200, response: vehicleData[0] })
            const result = await request(app).get('/vehicles/8').send()
            const count = JSON.parse(result.text).count

            expect(count).toBe(0)
        })
    })

    describe("And you did set 20 on the DB counter for that vehicle", () => {
        beforeAll(async () => {
            moxios.uninstall()
            await dropDatabaseMongoTestDB()
            await setDBItemCount({ _id: '8', count: 20 }, 'vehicles')
        })

        it('Should return a status 200 OK', async () => {
            moxios.stubRequest('https://swapi.dev/api/vehicles/8', { status: 200, response: vehicleData[0] })
            const result = await request(app).get('/vehicles/8').send()
            expect(result.status).toBe(200)
        })

        it('The database count should be 20', async () => {
            moxios.stubRequest('https://swapi.dev/api/vehicles/8', { status: 200, response: vehicleData[0] })
            const result = await request(app).get('/vehicles/8').send()
            const count = JSON.parse(result.text).count

            expect(count).toBe(20)
        })
    })
})
