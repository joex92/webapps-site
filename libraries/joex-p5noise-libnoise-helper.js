class PerlinNoise extends LibNoise{
    constructor(seed){
        super().then((lN)=>{
            this.perlin = new lN.Perlin();
            this.perlin.SetSeed(seed);
            this.ready = true;
        })
    }
}