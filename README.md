# Coding Challenge - Backend Extending The Star Wars API

## API REST Documentation
| Operation                    | Request                                                 | Response Status | Response Description                                                   |
|------------------------------|---------------------------------------------------------|-----------------|------------------------------------------------------------------------|
| Retrieve vehicle by ID       | ```GET /vehicles/8```                                   | 200 OK          | A vehicle with the id ```8``` and a count property                     |
|                              | ```GET /vehicles/999```                                 | 404 Not Found   | There is not a vehicle with the id ```999```                           |
|                              | ```GET /vehicles/asd```                                 | 404 Not Found   | There is not a vehicle with the id ```'asd'```                         |
|                              |                                                         |                 |                                                                        |
| Update vehicle counter value | ```PUT /vehicles/8``` Body: { "count": 5 }              | 200 OK          | The vehicle with the id ```8``` increments it's value by ```5``` units |
|                              | ```PUT /vehicles/8```  Body: { "count": -5 }            | 200 OK          | The vehicle with the id ```8``` decrements it's value by ```5``` units |
|                              | ```PUT /vehicles/999```                                 | 404 Not Found   | There is not a vehicle with the id ```999```                           |
|                              | ```PUT /vehicles/asd```                                 | 404 Not Found   | There is not a vehicle with the id ```'asd'```                         |
|                              | ```PUT /vehicles/8```  Body: { "count": -99999 }        | 400 Bad Request | Final amount of items can't be less than 0                                  |
|                              | ```PUT /vehicles/8``` Body: { "count": 5.3 }            | 400 Bad Request | Property 'count' can only  be an integer                               |
|                              |                                                         |                 |                                                                        |
| Set vehicle counter value    | ```POST /vehicles/``` Body: { "id": "8", "count": 5 }   | 200 OK          | The count value of the vehicle with the id ```8``` is set on ```5```   |
|                              | ```POST /vehicles/``` Body: { "id": "999", "count": 5 } | 404 Not Found   | There is not a vehicle with the id ```999```                           |
|                              | ```POST /vehicles/``` Body: { "id": "asd", "count": 5 } | 404 Not Found   | There is not a vehicle with the id ```asd```                           |
|                              | ```POST /vehicles/``` Body: { "id": 8, "count": -1 }    | 400 Bad Request | Property 'count' can't be less than 0  

## How to develop
1. ```docker-compose -f "docker-compose.yml" up -d --build```
2. ```npm install```
3. ```npm run dev```
4. You are ready!