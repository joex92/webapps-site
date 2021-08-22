//
// export namespace LibNoise {
//
//     export class Perlin {}
// }

declare class Perlin {
    constructor();
    GetValue(x: number, y: number, z: number): number;
}

interface LibNoiseInterface {
    Perlin: typeof Perlin;
}


declare function LibNoiseFunction(): Promise<LibNoiseInterface>;

export = LibNoiseFunction;

