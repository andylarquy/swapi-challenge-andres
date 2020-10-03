import bodyParser from 'body-parser'
import { errorHandler } from 'api/errorHandler'
import express, { Application, Request, Response } from 'express'
import { index, getVehicleById, setVehicleCountById, updateVehicleCountById } from 'api/endpoints'

const app: Application = express()
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
    res.send(index())
})

app.get('/vehicles/:vehicleId', async (req: Request, res: Response) => {
    try {
        const response = await getVehicleById(req.params.vehicleId)
        res.json(response)
    } catch (error) {
       errorHandler(error, res)
    }
})

app.put('/vehicles/:vehicleId', async (req: Request, res: Response) => {
    try {
        await updateVehicleCountById({ _id: req.params.vehicleId, count: req.body.count })
        res.json(JSON.parse(`{"message": "ok"}`))
    } catch (error) {
        errorHandler(error, res)
    }
})

app.post('/vehicles', async (req: Request, res: Response) => {
    try {
        await setVehicleCountById({ _id: req.body.id, count: req.body.count })
        res.json(JSON.parse(`{"message": "ok"}`))
    } catch (error) {
        errorHandler(error, res)
    }
})

app.listen(3000, () => console.log('Server running'))