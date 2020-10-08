import request from 'supertest'
import { app } from '../api/app'
import moxios from 'moxios'
import { starshipData } from "./stubData"
import { dropDatabaseMongoTestDB, mongoTestDBIsEmpty } from "./testDatabaseConfig"
import { setDBItemCount } from 'services/databaseAPI/itemDatabase.service'

function moxiosRestart() {
    moxios.uninstall()
    moxios.install()
}

describe('When you send a GET /starships/:starshipID', () => {

    beforeEach(async () => {
        moxiosRestart()
    })

    beforeEach(async () => {
        await dropDatabaseMongoTestDB()
    })

    it('Should fail if the ID is not found', async () => {
        moxios.stubRequest(/starships.*/, { status: 404, response: '{"details": "Not Found"}' })
        const result = await request(app).get('/starships/0').send()

        expect(result.status).toBe(404)
        expect(await mongoTestDBIsEmpty()).toBe(true)
    })

    it("Should fail if the ID is not numeric", async () => {
        moxios.stubRequest(/starships.*/, { status: 404, response: '{"details": "Not Found"}' })
        const result = await request(app).get('/starships/asd').send()

        expect(result.status).toBe(404)
        expect(await mongoTestDBIsEmpty()).toBe(true)
    })

    describe("And you didn't set the DB counter for that starship", () => {

        beforeEach(async () => {
            await dropDatabaseMongoTestDB()
        })

        it('Should return a status 200 OK', async () => {
            moxios.stubRequest(/starships.*/, { status: 200, response: starshipData })
            const result = await request(app).get('/starships/5').send()

            expect(result.status).toBe(200)
        })

        it('The count should be 0', async () => {
            moxios.stubRequest(/starships.*/, { status: 200, response: starshipData })
            const result = await request(app).get('/starships/5').send()
            const count = JSON.parse(result.text).count

            expect(count).toBe(0)
        })
    })

    describe("And you did set 20 on the DB counter for that vehicle", () => {
        beforeEach(async () => {
            await dropDatabaseMongoTestDB()
            await setDBItemCount({ _id: "5", count: 20 }, 'starships')
        })

        it('Should return a status 200 OK', async () => {
            moxios.stubRequest(/starships.*/, { status: 200, response: starshipData })
            const result = await request(app).get('/starships/5').send()

            expect(result.status).toBe(200)
        })

        it('The database count should be 20', async () => {
            moxios.stubRequest(/starships.*/, { status: 200, response: starshipData })
            const result = await request(app).get('/starships/5').send()
            const count = JSON.parse(result.text).count

            expect(count).toBe(20)
        })
    })

})
