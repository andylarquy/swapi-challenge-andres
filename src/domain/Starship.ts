import { plainToClass } from 'class-transformer'

export class Starship {

    constructor(
        public count?: number,
        public name?: string,
        public model?: string,
        public manufacturer?: string,
        public costInCredits?: string,
        public crew?: string,
        public passengers?: string,
        public cargoCapacity?: string,
        public consumables?: string,
        public hyperdriveRating?: string,
        public mglt?: string,
        public starship_class?: string,
        public pilots?: [string],
        public films?: [string],
        public createDate?: Date,
        public editDate?: Date,
        public url?: string,
    ) { }

    static fromJson(starshipJSON: Starship): Starship {
        return plainToClass(Starship, starshipJSON)
    }

}