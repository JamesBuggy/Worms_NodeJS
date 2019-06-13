import { Worm } from './worm'

export class Team {

    public username: string; // Team owner
    public name: string; // Tema name
    public worms: Worm[]; // Worms on the team

    private teamSize = 4;

    constructor() {
        this.worms = [];
        for(var i = 0; i < this.teamSize; i++) {
            this.worms.push(new Worm());
        }
    }
}