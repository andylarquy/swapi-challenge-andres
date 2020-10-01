import express, { Application, Request, Response } from 'express'
import { index } from 'api/endpoints'
import bodyParser from 'body-parser'

const app: Application = express()
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
    res.send(index())
})

app.listen(process.env.PORT || 3000, () => console.log('Server running'))