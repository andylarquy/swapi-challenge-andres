import express, { Application, Request, Response } from 'express'
import { index, getVehicleById } from 'api/endpoints'
import bodyParser from 'body-parser'

const app: Application = express()
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
    res.send(index())
})

app.get('/vehicles/:vehicleId', (req: Request, res: Response) => {
    getVehicleById(req.params.vehicleId).then(res.send.bind(res))

})

app.get('/vehicles', (req: Request, res: Response) => {
    res.send('To Do')
})

app.listen(process.env.PORT || 3000, () => console.log('Server running'))