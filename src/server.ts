import express, { Application, Request, Response } from 'express'
import { index, getVehicleById, setVehicleCountById } from 'api/endpoints'
import bodyParser from 'body-parser'

const app: Application = express()
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
    res.send(index())
})

//TODO: Properly handle error codes
app.get('/vehicles/:vehicleId', async (req: Request, res: Response) => {
    const response = await getVehicleById(req.params.vehicleId)
    res.json(response)
})

app.post('/vehicles', async (req: Request, res: Response) => {
    const response = await setVehicleCountById({ _id: req.body.id, count: req.body.count })
    res.json(response)
})

app.listen(process.env.PORT || 3000, () => console.log('Server running'))