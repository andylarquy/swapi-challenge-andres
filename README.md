# Coding Challenge - Extending The Star Wars API

## Introduction
This API Rest project runs on ```NodeJs``` with a ```MongoDB``` database running on ```Docker```.

Using the [Star Wars API](https://swapi.dev/) the goal is to extend its behavior to track the number of vehicles and starships.

## Prerequisites
 - [NodeJs](https://nodejs.org/)
 - [NPM](https://www.npmjs.com/)
 - [Docker](https://www.docker.com/)

## How to run the project

### Starting the database
Run on a terminal:
 - ```docker-compose -f "docker-compose.yml" up -d --build```

### Starting the server
Run on a terminal:
- ```npm install```
- ```npm run dev```

You are now ready to go!

## Testing the app
 - Run on a terminal:
```npm test```

## Approach decisions
The problem asks to consume the API Rest for starships and vehicles and keep track of the number of units for each. In order to do that, I‘ll have to work with JSON objects. With NodeJs doing that is relatively easier than with other languages, so I decided to go with it. 
I have four topics to tackle:
 - Get the total number of units.
 - Set the total number of units.
 - Increment the total number of units.
 - Decrement the total number of units.
 
All these four tasks can be managed on a database with pretty simple queries, so to choose the technology for the DB I just go with the one that I think is more suitable to work with node: MongoDB.

Every vehicle and starship has an ID, so in order to keep the DB design as simple as possible, I will store each ID with its corresponding count value.

Now, before the start, I have to design the endpoints of the API.
The first two are not difficult, an HTTP GET and a POST method. 
However, there are multiple ways to implement the last two topics. I think the best one for this case is having an endpoint PUT that can only increment but allows you to pass a negative count value (which ends up being equivalent to subtracting) because it’s simpler and it gives you a homogeneous way to interact with the API.

 Another decision to make was whether to have or not a domain class to represent the vehicles and starships. While I think for this case working directly with the JSON representation would be enough (because the objects currently don’t have behavior), I created them anyway thinking that the solution may escalate over time so it can save time in the future.

This system has two data repositories (the one I’m creating and the one the SW API uses), so I have to make sure to keep them consistent. In order to do that when the user makes a request to a certain vehicle or starship, the system will first check if it exists in the SW API. If it doesn’t it will not allow the request.
Additionally, when a user tries to retrieve the data of a valid vehicle the system checks the DB, and if it doesn’t find a count property will initialize it with 0 by default.



## API REST Documentation

### Vehicles
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

### Starships
| Operation                    | Request                                                 | Response Status | Response Description                                                    |
|------------------------------|---------------------------------------------------------|-----------------|-------------------------------------------------------------------------|
| Retrieve vehicle by ID       | ```GET /starships/8```                                  | 200 OK          | A starship with the id ```8``` and a count property                     |
|                              | ```GET /starships/999```                                | 404 Not Found   | There is not a starship with the id ```999```                           |
|                              | ```GET /starships/asd```                                | 404 Not Found   | There is not a starship with the id ```'asd'```                         |
|                              |                                                         |                 |                                                                         |
| Update vehicle counter value | ```PUT /starships/8``` Body: { "count": 5 }             | 200 OK          | The starship with the id ```8``` increments it's value by ```5``` units |
|                              | ```PUT /starships/8```  Body: { "count": -5 }           | 200 OK          | The starship with the id ```8``` decrements it's value by ```5``` units |
|                              | ```PUT /starships/999```                                | 404 Not Found   | There is not a starship with the id ```999```                           |
|                              | ```PUT /starships/asd```                                | 404 Not Found   | There is not a starship with the id ```'asd'```                         |
|                              | ```PUT /starships/8```  Body: { "count": -99999 }       | 400 Bad Request | Final amount of items can't be less than 0                              |
|                              | ```PUT /starships/8``` Body: { "count": 5.3 }           | 400 Bad Request | Property 'count' can only  be an integer                                |
|                              |                                                         |                 |                                                                         |
| Set vehicle counter value    | ```POST /vehicles/``` Body: { "id": "8", "count": 5 }   | 200 OK          | The count value of the vehicle with the id ```8``` is set on ```5```    |
|                              | ```POST /vehicles/``` Body: { "id": "999", "count": 5 } | 404 Not Found   | There is not a vehicle with the id ```999```                            |
|                              | ```POST /vehicles/``` Body: { "id": "asd", "count": 5 } | 404 Not Found   | There is not a vehicle with the id ```asd```                            |
|                              | ```POST /vehicles/``` Body: { "id": 8, "count": -1 }    | 400 Bad Request | Property 'count' can't be less than 0                                   |

## Author
Andrés Esteban Suárez

![May the code be with you](https://i.postimg.cc/8zxbjVSp/Coding-Challenge-Backend-Extending-The-Star-Wars-API-4.png)