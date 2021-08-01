const notepitch = ["♭","♮","♯"];
const midipitch = [-1,0,1];
const midiscl = [0,2,4,5,7,9,11,12];
let chromaticNotation = "C C# D D# E F F# G G# A A# B".split(" ")
var midinotes = []
for ( i = -1; i < 10; i++) {
    for (n of chromaticNotation) {
        if(midinotes.length<128){
            midinotes.push(n+i);   
        }
    }
}

function MusicScales(scl,root = 60){
	this.scales = [
		["Acoustic","1 2 3 ♯4 5 6 ♭7"],
		["Aeolian","1 2 ♭3 4 5 ♭6 ♭7"],
		["Algerian","1 2 ♭3 ♯4 5 ♭6 7"],
		["Altered","1 ♭2 ♭3 ♭4 ♭5 ♭6 ♭7"],
		["Augmented","1 ♭3 3 5 ♯5 7"],
		["Bebop dominant","1 2 3 4 5 6 ♭7 7"],
		["Blues","1 ♭3 4 ♭5 5 ♭7"],
		["Chromatic","1 ♯1 2 ♯2 3 4 ♯4 5 ♯5 6 ♯6 7"],
		["Dorian","1 2 ♭3 4 5 6 ♭7"],
		["Double harmonic","1 ♭2 3 4 5 ♭6 7"],
		["Enigmatic","1 ♭2 3 ♯4 ♯5 ♯6 7"],
		["Flamenco","1 ♭2 3 4 5 ♭6 7"],
		["Gypsy","1 2 ♭3 ♯4 5 ♭6 ♭7"],
		["Half diminished","1 2 ♭3 4 ♭5 ♭6 ♭7"],
		["Harmonic major","1 2 3 4 5 ♭6 7"],
		["Harmonic minor","1 2 ♭3 4 5 ♭6 7"],
		["Harmonics","1 ♭3 3 4 5 6"],
		["Hirajoshi","1 3 ♯4 5 7"],
		["Hungarian minor","1 2 ♭3 ♯4 5 ♭6 7"],
		["Hungarian major","1 ♯2 3 ♯4 5 6 ♭7"],
		["In","1 ♭2 4 5 ♭6"],
		["Insen","1 ♭2 4 5 ♭7"],
		["Ionian","1 2 3 4 5 6 7"],
		["Istrian","1 ♭2 ♭3 ♭4 ♭5 5"],
		["Iwato","1 ♭2 4 ♭5 ♭7"],
		["Locrian","1 ♭2 ♭3 4 ♭5 ♭6 ♭7"],
		["Lydian augmented","1 2 3 ♯4 ♯5 6 7"],
		["Lydian","1 2 3 ♯4 5 6 7"],
		["Major bebop","1 2 3 4 5 ♭6 6 7"],
		["Major Locrian","1 2 3 4 ♭5 ♭6 ♭7"],
		["Major pentatonic","1 2 3 5 6"],
		["Melodic minor",["1 2 ♭3 4 5 ♮6 ♮7","1 2 ♭3 4 5 ♭6 ♭7"]],
		["Minor pentatonic","1 ♭3 4 5 ♭7"],
		["Mixolydian","1 2 3 4 5 6 ♭7"],
		["Neapolitan major","1 ♭2 ♭3 4 5 6 7"],
		["Neapolitan minor","1 ♭2 ♭3 4 5 ♭6 7"],
		["Octatonic (WH)","1 2 ♭3 4 ♭5 ♭6 6 7"],
		["Octatonic (HW)","1 ♭2 ♭3 3 ♯4 5 6 ♭7"],
		["Persian","1 ♭2 3 4 ♭5 ♭6 7"],
		["Phrygian dominant","1 ♭2 3 4 5 ♭6 ♭7"],
		["Phrygian","1 ♭2 ♭3 4 5 ♭6 ♭7"],
		["Prometheus","1 2 3 ♯4 6 ♭7"],
	//	["Quarter tone",["1 half-sharp1 ♯1 three-quarter-sharp1 2 half-sharp2 ♯2 three-quarter-sharp2 3 half-sharp3 4 half-sharp4 ♯4 three-quarter-sharp4 5 half-sharp5 ♯5 three-quarter-sharp5 6 half-sharp6 ♯6 three-quarter-sharp6 7 half-sharp7","half-flat8 7 half-flat7 ♭7 three-quarter-flat7 6 half-flat6 ♭6 three-quarter-flat6 5 half-flat5 ♭5 three-quarter-flat5 4 half-flat4 3 half-flat3 ♭3 three-quarter-flat3 2 half-flat2 ♭2 three-quarter-flat2 1"]],
		["Tritone","1 ♭2 3 ♭5 5 ♭7"],
		["Two-semitone tritone","1 ♭2 ♮2 ♯4 5 ♭6"],
		["Ukrainian Dorian","1 2 ♭3 ♯4 5 6 ♭7"],
	//	["Vietnamese harmonics","1 three-quarter-flat3 ♭3 ♮3 5 7"],
		["Whole tone","1 2 3 ♯4 ♯5 ♯6"],
		["Yo","1 ♭3 4 5 ♭7"]
	];
	
	this.majorScales = [];
	this.minorScales = [];
	for (let i = 0; i < this.scales.length; i++) {
	    if (i === 31) {
	        this.minorScales.push(i)
	    } else {
    	    let sc = this.scales[i][1].split(" ");
    	    if (sc.length === 7) {
    	        if (sc[2] === '3') {
    	            this.majorScales.push(i);
    	        } else if (sc[2] === '♭3') {
    	            this.minorScales.push(i);
    	        }
    	    }
	    }
	}

	this.getScaleIndex = function(s){
		if (typeof s == "number"){
			if (s < this.scales.length){
				return s;
			}
		} else {
			for (var i = 0; i < this.scales.length; i++){
				if (this.scales[i][0] == s){
					return i;
				}
			}
		}
		return 22;
	}

	this.setScale = function(s){
		this.scl = this.getScaleIndex(s);
		this.midiscale = scale2midi(this.scales[this.scl][1]);
		return this.scales[this.scl];
	}

	function note2midi(nt){
		let p = "";
		let note = nt.toString().split("");
		let n = Number(note[0]);
		if (note.length > 1){
			for (var i = 0; i < note.length; i++){
				if(Number(note[i])){
					n = Number(note[i]);
				} else {
					p = note[i];
				}
			}
		}
		let m = midiscl[n-1];
		notepitch.forEach(function(v,i,a){
			if (v == p){
				m += midipitch[i];
			}
		});
		return m;
	}

	function scale2midi(s){
		var scale = [];
		if (Array.isArray(s)){
			for (var i = 0; i < s.length; i++){
				scale.push(s[i].split(" "));
			}
		} else {
			scale.push(s.split(" "));
		}
		for (var si = 0; si < scale.length; si++){
			scale[si].forEach(function(v,i,a){
				a[i] = note2midi(v);
			});
		}
		return scale;
	}

	this.scaleindex = 22;
	this.midiscale = scale2midi(this.scales[this.scaleindex][1]);
	this.setScale(scl);

	this.rootnote = root;
	this.octaves = 6;
	this.currindex = 0;
	this.previndex = 0;
	this.noise2note = function(nval){	
		var scale = this.midiscale[0];
// 		console.log(scale);
		this.currindex = wasm.round(nval.lmap(-1,1,-scale.length*(this.octaves/2),scale.length*(this.octaves/2)));
// 		console.log(this.currindex,scale[this.currindex]);
		if(this.scales[this.scl][0] == "Melodic minor"){
			if (this.currindex-this.previndex < 0){
				scale = this.midiscale[1];
			}
		}
// 		console.log(this.currindex,scale[(this.currindex+scale.length)%scale.length]);
		this.previndex = this.currindex;
		let index = (this.currindex+(scale.length*this.octaves/2))%scale.length
		let sclnt = scale[index];
		let octave = wasm.floor(this.currindex/scale.length)*12;
// 		console.log(index,sclnt,octave);
		return (sclnt+octave)+this.rootnote;
	}
}

var musicScales = new MusicScales(31);