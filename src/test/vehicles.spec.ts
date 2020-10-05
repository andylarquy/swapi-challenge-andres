import request from 'supertest'
import { app } from '../api/app'
import moxios from 'moxios'
import { vehicleData } from "./stubData"
import { dropDatabaseMongoTestDB } from "./testDatabaseConfig"
import { getItemCountById, setDBItemCount } from 'services/databaseAPI/itemDatabase.service'

beforeEach(async () => {
    moxiosRestart()
})

function moxiosRestart() {
    moxios.uninstall()
    moxios.install()
}

describe('When you send a GET /vehicles/:vehicleID', () => {

    beforeEach(async () => {
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

        beforeEach(async () => {
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
        beforeEach(async () => {
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

describe('When you send a PUT /vehicles/:vehicleID', () => {
    beforeEach(async () => {
        await dropDatabaseMongoTestDB()
    })

    it('Should fail if the ID is not found', async () => {
        moxios.stubRequest(/vehicles.*/, { status: 404, response: '{"details": "Not Found"}' })
        const result = await request(app).put('/vehicles/9').send({ count: 5 })

        expect(result.status).toBe(404)
    })

    it("Should fail if the ID is not numeric", async () => {
        moxios.stubRequest(/vehicles.*/, { status: 404, response: '{"details": "Not Found"}' })
        const result = await request(app).put('/vehicles/asd').send({ count: 5 })

        expect(result.status).toBe(404)
    })

    it("Should fail if count param is missing", async () => {
        moxios.stubRequest(/vehicles.*/, { status: 200, response: vehicleData[0] })
        const result = await request(app).put('/vehicles/8').send({})

        expect(result.status).toBe(400)
    })
    it("Should fail if count param not numeric", async () => {
        moxios.stubRequest(/vehicles.*/, { status: 200, response: vehicleData[0] })
        const result = await request(app).put('/vehicles/8').send({ count: '5' })

        expect(result.status).toBe(400)
    })

    it("Should fail if count param is not an integer number", async () => {
        moxios.stubRequest(/vehicles.*/, { status: 200, response: vehicleData[0] })
        const result = await request(app).put('/vehicles/8').send({count: 2.5})

        expect(result.status).toBe(400)
    })

    describe("And you didn't set the DB counter for that vehicle", () => {

        beforeEach(async () => {
            await dropDatabaseMongoTestDB()
        })

        it('Should assume the counter by default starts at 0', async () => {
            moxios.stubRequest(/vehicles.*/, { status: 200, response: vehicleData[0] })
            const result = await request(app).put('/vehicles/8').send({ count: 0 })
            const count = await getItemCountById('8', 'vehicles')

            expect(result.status).toBe(200)
            expect(count).toBe(0)
        })
    })

    describe("And you did set 20 on the DB counter for that vehicle", () => {

        beforeEach(async () => {
            await dropDatabaseMongoTestDB()
            await setDBItemCount({ _id: '8', count: 20 }, 'vehicles')
        })

        it('Should increment correctly', async () => {
            moxios.stubRequest(/vehicles.*/, { status: 200, response: vehicleData[0] })
            const result = await request(app).put('/vehicles/8').send({ count: 5 })
            const count = await getItemCountById('8', 'vehicles')

            expect(result.status).toBe(200)
            expect(count).toBe(25)
        })

        it('Should decrement correctly', async () => {
            moxios.stubRequest(/vehicles.*/, { status: 200, response: vehicleData[0] })
            const result = await request(app).put('/vehicles/8').send({ count: -5 })
            const count = await getItemCountById('8', 'vehicles')

            expect(result.status).toBe(200)
            expect(count).toBe(15)
        })

        it('Should decrement correctly if we decrement 20', async () => {
            moxios.stubRequest(/vehicles.*/, { status: 200, response: vehicleData[0] })
            const result = await request(app).put('/vehicles/8').send({ count: -20 })
            const count = await getItemCountById('8', 'vehicles')

            expect(result.status).toBe(200)
            expect(count).toBe(0)
        })

        it("Should fail if we try to decrement 21", async () => {
            moxios.stubRequest(/vehicles.*/, { status: 200, response: vehicleData[0] })
            const result = await request(app).put('/vehicles/8').send({count: -21})
    
            expect(result.status).toBe(400)
        })
    })
})
