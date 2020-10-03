import { Response } from 'express'

export const errorHandler = (error: any, res: Response): void => {
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
