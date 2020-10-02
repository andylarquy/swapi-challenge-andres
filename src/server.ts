import express, { Application, Request, Response } from 'express'
import { index, getVehicleById, setVehicleCountById } from 'api/endpoints'
import bodyParser from 'body-parser'

const app: Application = express()
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
    res.send(index())
})

//TODO: Properly reuse the error handler
app.get('/vehicles/:vehicleId', async (req: Request, res: Response) => {
    try {
        const response = await getVehicleById(req.params.vehicleId)
        res.json(response)
    } catch (error) {
        if (error.response.status) {
            // Handle errors from SWAPI
            res.status(error.response.status).json(JSON.parse(`{"message": "${error.message}"}`))

        } else if (error.statusCode) {
            // Handle errors from this server
            res.status(error.statusCode).json(JSON.parse(`{"message": "${error.message}"}`))

        } else {
            // Handle unexpected errors
            res.status(400).json(error.message)
        }
    }
})

app.post('/vehicles', async (req: Request, res: Response) => {
    try {
        await setVehicleCountById({ _id: req.body.id, count: req.body.count })
        res.json(JSON.parse(`{"message": "ok"}`))
    } catch (error) {
        if (error.response?.status) {
            // Handle errors from SWAPI
            res.status(error.response.status).json(error.response.data)

        } else if (error.statusCode) {
            // Handle errors from this server
            res.status(error.statusCode).json(JSON.parse(`{"message": "${error.message}"}`))

        } else {
            // Handle unexpected errors
            res.status(400).json(error.message)
        }
    }
})

app.listen(3000, () => console.log('Server running'))