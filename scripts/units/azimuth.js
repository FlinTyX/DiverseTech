//effects
let shootFx = new Effect(40, e => {
    Draw.color(Color.valueOf("f49d7c"));
  
    for(let i = 0; i < 3; ++i){
      Drawf.tri(e.x, e.y, e.fout() * 7, e.fout() * 90, e.rotation - 30 + (30 * i));
    };
  
    Lines.stroke(0.6);
      Angles.randLenVectors(e.id, 8, 40 * e.finpow(), (x, y) => {
        for(let i = 0; i < 4; ++i){
          Drawf.tri(e.x+x, e.y+y, e.fout() * 3, e.fout () * 8, e.rotation + (90 * i) + e.fin() * 100);
        }
    });
  
    e.scaled(7, i => {
      Lines.stroke(3 * i.fout());
      Lines.circle(e.x, e.y, 4 + i.finpow() * 30);
    });
   
    Draw.color(Color.valueOf("f49d7c"), Color.valueOf("6e7080"), e.fin());
    Angles.randLenVectors(e.id + 10, 8, 40 * e.finpow(), (x, y) => {
      Fill.circle(e.x+x, e.y+y, e.fout() * 2);
    });
});

let shootFx2 = new Effect(28, e => {

    Draw.color(Pal.meltdownHit, Color.gray, Pal.darkerGray, e.fin());
    Angles.randLenVectors(e.id, 5, 5 + 10 * e.fin(), e.rotation, 30, (x, y) => {
        Fill.circle(e.x + x, e.y + y, e.fout() * 1.5);
    });

    Draw.color(Pal.accent, Color.gray, e.fin());
    Angles.randLenVectors(e.id + 10, 5, 5 + 10 * e.fin(), e.rotation, 30, (x, y) => {
        Fill.circle(e.x + x, e.y + y, e.fout() * 1.5);
    });

    Draw.color(Color.valueOf("f49d7c"));
    Drawf.tri(e.x, e.y, 8 * e.fout(), 18, e.rotation);
    Drawf.tri(e.x, e.y, 8 * e.fout(), 7, e.rotation + 180);
});
  
let despawnFx = new Effect(45, e => {
    e.rotation = e.fin() * 200;
  
    Draw.color(Color.valueOf("f49d7c"));
    for(let i = 0; i < 4; ++i){
      Drawf.tri(e.x, e.y, e.fout() * 5, e.fout() * 70, e.rotation + (90 * i));
    };
  
    Lines.stroke(e.fout() * 1.5);
    Lines.circle(e.x, e.y, 20 + e.fin() * 10);
});
  
let hitFx = new Effect(30, e => {
    Draw.color(Color.valueOf("f49d7c"));
  
    for(let i = 0; i < 2; ++i){
      Drawf.tri(e.x, e.y, e.fout() * 5, e.fout() * 70, e.rotation - 190 + (25 * i) - e.fin());
    };
  
    Lines.stroke(e.fout() * 1.5);
    Fill.circle(e.x, e.y, e.fout() * 3);
    Lines.circle(e.x, e.y, e.finpow() * 20);
});
  
let arrow = extend(BasicBulletType, {
    damage: 47.5,
    speed: 3.6,
    lifetime: 60,
    drag: -0.002,
    height: 18,
    width: 15,
    homingPower: 0.05,
    homingRange: 180,
    weaveScale: 3,
    weaveMag: 3,
    lightning: 3,
    lightningLenght: 5,
    sprite: "diversetech-arrow",
    backColor: Color.valueOf("ffc999"),
    shrinkY: 0,
    trailColor: Color.valueOf("ffc999"),
    trailWidth: 2.1,
    trailLength: 15,
    shootEffect: shootFx2,
    
    //fx
    hitEffect: hitFx,
    despawnEffect: despawnFx
});
  
let bigArrow = extend(BasicBulletType, {
    damage: 100,
    speed: 2.2,
    lifetime: 105,
    height: 25,
    width: 20,
    collidesGround: true,
    collides: true,
    weaveScale: 3,
    weaveMag: 3,
    lightning: 3,
    lightningLenght: 8,
    trailEffect: Fx.artilleryTrail,
    trailChance: 5,
    shrinkY: 0,
    sprite: "diversetech-smallArrow",
    backColor: Color.valueOf("ffc999"),
    homingPower: 0.1,
    homingRange: 100,
    lowRange: 90,
    trailColor: Color.valueOf("ffc999"),
    trailWidth: 1.8,
    trailLength: 8,
    
    //fx
    shootEffect: shootFx,

    spawnArrow(b){
        if(b.data) return;

        Effect.shake(10, 20, b.x, b.y);
        despawnFx.at(b.x, b.y);
        for(let i = 0; i < 3; i++){
            let n = b.rotation() - 50 + (50 * i);
            arrow.create(b.owner, b.team, b.x, b.y, n);
        }
        b.data = true;
    },
    init(b){
        if(!b) return;
        b.data = false;
    },
    update(b){
        this.super$update(b);
        let target = Units.closestTarget(b.team, b.x, b.y, this.lowRange, e => e.team != b.team);
        if(target != null){
            this.spawnArrow(b);
        }
    },
    despawned(b){
        this.super$despawned(b);
        this.spawnArrow(b);
    },
});

let cannon = extend(Weapon, "diversetech-azimuth-cannon", {
    mirror: false,
    shootSound: Sounds.shotgun,
    shots: 1,
    inaccuracy: 8,
    reload: 150,
    rotate: true,
    rotateSpeed: 1.2,
    shake: 10,
    ejectEffect: Fx.casing2,

    x: 0,
    y: -12.5,

    shootY: 8.8,
    bullet: bigArrow
});

let gun = extend(Weapon, "diversetech-azimuth-gun", {
    mirror: true,
    shootSound: Sounds.shotgun,
    shots: 1,
    spacing: 45,
    velocityRnd: 0.5,
    inaccuracy: 8,
    reload: 60,
    rotate: true,
    rotateSpeed: 3,
    shake: 3,
    ejectEffect: Fx.casing2,

    shootSmoke: Fx.shootBigSmoke,

    x: 32.2,
    y: 14,

    shootY: 8.3,
    bullet: arrow
});

const azimuth = extend(UnitType, "azimuth", {
    data: [
        {
            x: 23,
            y: 16.2,
            side: 1
        },
        {
            x: 19.78,
            y: -15.9,
            side: 1
        },
        {
            x: -19.78,
            y: -15.9,
            side: -1
        },
        {
            x: -23,
            y: 16.2,
            side: -1
        }
    ],
    load(){
        this.topPropeller = Core.atlas.find(this.name + "-topPropeller");
        this.topPropellerOutLine = Core.atlas.find(this.name + "-topPropeller-outline");
        this.propeller = Core.atlas.find(this.name + "-propeller");
        this.propellerOutline = Core.atlas.find(this.name + "-propeller-outline");
        this.super$load();
    },
    draw(unit){
        this.super$draw(unit);
        Draw.z(Layer.flyingUnitLow - 0.01);
      
        for(let i = 0; i < this.data.length/2; i++){
            
            Tmp.v1.trns(unit.rotation + 90, this.data[i].x, this.data[i].y).add(unit.x, unit.y);
            Tmp.v2.trns(unit.rotation + 90, this.data[2 + i].x, this.data[2 + i].y).add(unit.x, unit.y);
            let rot = -Time.time * 5.5;

            Draw.rect(
                this.topPropeller, 
                Tmp.v1.x, 
                Tmp.v1.y, 
                rot * this.data[i].side
            );
            Draw.rect(
                this.topPropellerOutLine, 
                Tmp.v1.x, 
                Tmp.v1.y,
                rot * this.data[i].side
            );
            Draw.rect(
                this.propeller, 
                Tmp.v2.x, 
                Tmp.v2.y,
                rot * this.data[2 + i].side
            );
            Draw.rect(
                this.propellerOutline, 
                Tmp.v2.x, 
                Tmp.v2.y, 
                rot * this.data[2 + i].side
            );

            //shadow
            Drawf.shadow(
                this.topPropeller, 
                Tmp.v1.x - (12.5 * unit.elevation),
                Tmp.v1.y - (12.5 * unit.elevation),
                rot * this.data[i].side
            );
            Drawf.shadow(
                this.propeller, 
                Tmp.v2.x - (12.5 * unit.elevation),
                Tmp.v2.y - (12.5 * unit.elevation),
                rot * this.data[2 + i].side
            )
        }
        Draw.reset();
    },
});
azimuth.weapons.add(cannon, gun);
azimuth.constructor = () => extend(UnitEntity, {});
  