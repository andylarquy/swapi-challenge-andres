import { plainToClass } from 'class-transformer'

export class Vehicle {

    constructor(
        public count?: number,
        public name?: string,
        public model?: string,
        public manufacturer?: string,
        public costInCredits?: string,
        public length?: string,
        public maxAtmospheringSpeed?: string,
        public crew?: string,
        public passengers?: string,
        public cargoCapacity?: string,
        public consumables?: string,
        public vehicle_class?: string,
        public pilots?: [string],
        public films?: [string],
        public createDate?: Date,
        public editDate?: Date,
        public url?: string,
    ) { }

    static fromJson(vehicleJSON: Vehicle): Vehicle {
        return plainToClass(Vehicle, vehicleJSON)
    }

}