const {newArtillery, newLotus} = require("libs/bullets/laserLotus");
const {ic} = require("libs/functions");

const s = new Effect(40, e => {
    Draw.color(Pal.meltdownHit, Color.valueOf("6e7080"), e.fin());

    for(let i = 0; i < 2; i++){
        let s = i == 0 ? 1 : -1;
        let r = e.rotation + 180 - (45 * s);
        
        Tmp.v1.trns(e.rotation + 180, 19.5, 8.73 * s);
        Tmp.v1.add(e.x, e.y);
        
        let vx = Tmp.v1.x, vy = Tmp.v1.y;
        
        Angles.randLenVectors(e.id, 8, 5 + 10 + e.finpow(), r, 22.5, (x, y) => {
            if(Mathf.chance(0.1)) Damage.createIncend(vx + (x * 4), vy + (y * 4), 0, 1);
            Fill.circle(vx + x, vy + y, e.fout() * 1.5);
        });
        
        Tmp.v1.trns(e.rotation + 180, 20.92 - (0.06 + (8 * e.finpow())), 8.8 * s);
        Tmp.v1.add(e.x, e.y);
        
        Drawf.tri(Tmp.v1.x, Tmp.v1.y, 3.8 * e.fout(), 17 - (5 * e.fout()), r);
    }
});

const shootFx = new Effect(42, e => {
    Draw.color(Pal.meltdownHit, Color.valueOf("6e7080"), e.fin());

    let w = 10 * e.fout();
    let h = 20 - (5 * e.fin());

    e.scaled(7, i => {
        Lines.stroke(3 * i.fout());
        Lines.circle(e.x, e.y, 4 + i.finpow() * 30);
    });

    Angles.randLenVectors(e.id + 1, 8, 25 * e.finpow(), e.rotation, 50, (x, y) => {
        for(let i = 0; i < 4; ++i){
            Drawf.tri(e.x+x, e.y+y, e.fout() * 2, e.fout () * 6, e.rotation + (90 * i) + e.fin() * Mathf.randomSeed(e.id, 200));
        }
    });

    for(let i = 0; i < 2; i++){
        Drawf.tri(e.x, e.y, w, i == 0 ? h : -h/2, e.rotation);
    }
});

const lotus = extend(ItemTurret, "lotus", {
    range: 225,
    shots: 1,
    reloadTime: 360,
    maxAmmo: 100,
    ammoPerShot: 33,
    minRange: 50,
    shootShake: 8,
    recoilAmount: 7.5,
    rotateSpeed: 2.5,
    restitution: 0.06,
    shootEffect: shootFx,

    init(){
        this.ammo(
            Items.silicon, newArtillery({
                ammoMultiplier: 3,
                fragBullet: newLotus()
            }),
            ic("hyper-alloy"), newArtillery({
                fragBullet: newLotus({
                    damage: 55.8,
                    lifetime: 200,
                    amount: 4,
                    homingPower: 0.3,
                    homingRange: 100
                })
            }),
            Items.plastanium, newArtillery({
                frontColor: Pal.plastaniumFront,
                backColor: Pal.plastaniumBack,
                fragBullet: newLotus({
                    damage: 44,
                    lifetime: 190,
                    lotusLength: 27.5,
                    colors: [Color.valueOf("98ffa965"), Color.valueOf("98ffa985"), Pal.heal, Color.white],
                    amount: 4,
                    rotvel: 2.2,
                    homingPower: 0.2
                })
            }),
            Items.surgeAlloy, newArtillery({
                fragBullet: newLotus({
                    damage: 49.5,
                    lifetime: 200,
                    colors: [Color.valueOf("c9c55c40"), Color.valueOf("eae96555"), Pal.surge, Color.white],
                    amount: 4,
                    rotvel: 2.5,
                    homingPower: 0.35,
                    homingRange: 100
                })
            })
        );
        this.super$init();
    }
});

lotus.buildType = () => extend(ItemTurret.ItemTurretBuild, lotus, {
    shoot(type){
        this.super$shoot(type);
        s.at(this.x, this.y, this.rotation);
    }
});

lotus.consumes.add(new ConsumeLiquidFilter(liquid => liquid.temperature <= 0.5 && liquid.flammability < 0.1, 0.5));
lotus.unitSort = (u, x, y) => -u.maxHealth + Mathf.dst2(u.x, u.y, x, y) / 6400;