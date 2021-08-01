class SoundSource {
    constructor(filesource,r,cnv="",x=0,y=0,z=0){
        this.activated = false;
        this.radius = r;
        this.pan = [0,0,0];
        this.vol = 0;
        this.pos = wasm.create_vector_3d(x,y,z)
        this.cnv = cnv;
        this.wad = new Wad({
            source: filesource, 
            panning: this.pan, 
            // panningModel: 'HRTF',
            volume: this.vol,
            loop: true
        })
    }

    p5GetDistance(pvec) {
        return this.pos.dist(pvec);
    }

    p5Draw() {
        // if (this.pos.z === 0){
            stroke(255,0,0);
            point(this.pos.x+woff,this.pos.y+hoff);
            stroke(255,255,0);
            ellipse(this.pos.x+woff,this.pos.y+hoff,2*this.radius/3);
            noFill();
            stroke(0,255,0);
            ellipse(this.pos.x+woff,this.pos.y+hoff,2*this.radius);
            stroke(0);
        // } else {
        //     translate(this.pos.x,this.pos.y,this.pos.z);
        //     sphere(radius/3);
        //     noFill();
        //     sphere(radius);
        //     translate(0,0,0)
        // }
    }

    p5SetPanning(pvec){
        // this.pan = wasm.round_decimal(wasm.constrain(wasm.map(this.pos.x-pvec.x,-this.radius,this.radius,-1,1),-1,1),2);
        this.pan = [
            wasm.round_decimal(wasm.constrain(wasm.map(this.pos.x-pvec.x,-this.radius,this.radius,-1,1),-1,1),2),
            0,
            wasm.round_decimal(wasm.constrain(wasm.map(this.pos.y-pvec.y,-this.radius,this.radius,-1,1),-1,1),2)
        ]
        this.wad.setPanning(this.pan);
        return this.pan;
    }

    p5SetVolume(pvec){
        this.vol = wasm.round_decimal(wasm.constrain(wasm.map(this.p5GetDistance(pvec),0,this.radius,1,0),0,1),2);
        this.wad.setVolume(this.vol);
        return this.vol;
    }
}