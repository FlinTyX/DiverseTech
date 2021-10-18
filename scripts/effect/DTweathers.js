const thunder1 = loadSound("storm-thunder1");

function has(seq, compare){
    for(let i = 0; i < seq.size; i++){
        if(seq.get(i).weather == compare) return true;
    }
    return false;
};

//checks if the current map has certain weathers
function hasWeather(){
    if(!Vars.state.rules.weather.any()) return false;

    for(let i = 0; i < arguments.length; i++){  
        if(has(Vars.state.rules.weather, arguments[i])) return true;
    }
    return false;
};

//adds a weather to the current map that is being played.
function addWeather(){
    for(let i = 0; i < arguments.length; i++){
        if(Vars.state.isMenu() || hasWeather(arguments[i])) return;
        let bool = arguments[i + 1];
        if(typeof bool == "boolean" || bool == undefined ? bool : bool()) Vars.state.rules.weather.add(new Weather.WeatherEntry(arguments[i]));
    }
}

const stormLightning = new Effect(35, e => {
    e.lifetime = 14 + Mathf.randomSeed(e.id, 8);
    let x = Core.camera.position.x;
    let y = Core.camera.position.y;

    if(e.time - Time.delta == 0 && Mathf.chanceDelta(e.lifetime / 24)){
        let mag = Mathf.randomSeed(e.id, 5);
        
        if(mag > 1) Effect.shake(mag, mag * 2, x, y);

        if(mag > 3.5) thunder1.play(mag/5);
    }

    Draw.z(Layer.end + 0.01);
    Draw.color(Pal.lancerLaser, Pal.spore, e.fin());
    Draw.alpha(Mathf.randomSeed(e.id, 0.8) * e.fout());
    Fill.square(x, y, Core.graphics.getWidth(), Core.graphics.getHeight());
});

const storm = extend(ParticleWeather, "storm", {
    particleRegion: Core.atlas.find("particle"),
    xspeed: -8,
    yspeed: -11,
    color: Color.valueOf("a1b1d0"),
    rainColor: Color.valueOf("7a95eaff"),
    drawNoise: false,
    useWindVector: true,
    sizeMin: 75,
    sizeMax: 100,
    minAlpha: 0.02,
    maxAlpha: 0.12,
    baseSpeed: 6.2,
    force: 1,

    density: 20000,
    padding: 16,
   
    status: StatusEffects.wet,
    sound: Sounds.rain,
    soundVol: 0.9,
    
    splashes: [],

    generateThunder(obj){
        let x = Vars.player.x, y = Vars.player.y;
        let lines = [];

        const delay = 1.69 + Math.random();
        const radius = 15 * 17.6;
        const spacing = 10;
        const amount = Math.floor(radius / spacing);

        const width = 7;
        const seg2 = width / amount;

        !obj ? null : Object.assign(obj, this);

        cloud.at(x - 22, y + (radius - amount));

        for(let i = 0; i < amount; i++){

            let delta = (delay * i) - i;
            let curW = width - seg2 - (seg2 * i);
            let lastW = curW + seg2;

            Time.runTask(delta, () => {
                if(lines.length < amount + 1){
                    lines.push(new Vec2(x + Mathf.range(amount / 2), y + (radius - amount) - (spacing * lines.length)));
                }

                if(lines.length == amount){
                    print("H");
                }
                
                if(lines.length > 1 && i > 1){
                    thunder.at(x, y, 0, {
                        delta: (delay * amount) - delta,
                        curW: curW,
                        lastW: lastW,
                        current: lines[lines.length - 1],
                        last: lines[lines.length - 2]
                    });
                }
            });
        }
    },
    load(){
        this.super$load();

        for(let i = 0; i < 12; i++){
            this.splashes[i] = Core.atlas.find("splashes" + i);
        }
    },
    init(){
        this.super$init();
    },
    drawOver(state){
        if(Mathf.chanceDelta(0.005) && !Vars.state.isPaused()){
            this.generateThunder({});
        }

        this.drawRain(10, 40, 8, 10, 1000, state.intensity, 0.85, this.rainColor);

        if(Vars.state.isPlaying() && Mathf.chanceDelta(0.02 * state.intensity / 2)){
            stormLightning.at(Core.camera.position.x, Core.camera.position.y);
        }

        this.super$drawOver(state);
    },
    drawUnder(state){
        this.drawSplashes(this.splashes, 40, 1100, state.intensity, state.opacity, 18, 0.75, this.rainColor, Liquids.water);
    }
});
storm.attrs.set(Attribute.light, -0.4);
storm.attrs.set(Attribute.water, 0.5);

//Adds weathers when the world loads.
Events.on(WorldLoadEvent, () => {
    Time.runTask(60 * 2, () => {
        addWeather(
            storm, hasWeather(Weathers.rain, Weathers.snow)
        );
    });
});