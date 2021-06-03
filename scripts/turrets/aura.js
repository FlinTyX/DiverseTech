const fc = require("libs/functions");
let despawned = false;
let spawned = false;
let lightLength = 30;

const tFx = new Effect(40, e => {
  Draw.color(Pal.lancerLaser);
  Lines.stroke(1 + e.fout() * 2);
  Lines.circle(e.x, e.y, e.fout() * 8);
});

const dFx = new Effect(80, e => {
  Draw.color(Pal.lancerLaser);
  Lines.stroke(e.fout() * 3);
  Lines.circle(e.x, e.y, e.finpow() * 80);

  let f1 = e.finpow() * 80;
  let f2 = e.rotation + e.fin() * 450;
  let h = 20 + e.fin() * 20;
  let w = e.fout() * 20;

  for(let i = 0; i < 2; i++){
    f2 = i == 0 ? f2 : f2 + 90;
    Drawf.tri(e.x + Angles.trnsx(f2, f1), e.y + Angles.trnsy(f2, f1), w, h, f2);
    Drawf.tri(e.x - Angles.trnsx(f2, f1), e.y - Angles.trnsy(f2, f1), w, -h, f2);
  }

  e.scaled(7, i => {
    Lines.stroke(3 * i.fout());
    Lines.circle(e.x, e.y, 4 + i.fin() * 70);
  });
});

const hFx = new Effect(30, e => {
  Draw.color(Pal.lancerLaser);
  e.scaled(7, i => {
    Lines.stroke(3 * i.fout());
    Lines.circle(e.x, e.y, 4 + i.fin() * 60);
  });
});

const shootingFx  = new Effect(30, e => {
  Draw.color(Pal.lancerLaser);
  Lines.stroke(e.fslope() * 2.5)
  Lines.circle(e.x, e.y, 5 + e.fout() * 70);
});

const sFx = new Effect(30, e => {
  Draw.color(Pal.lancerLaser);
  Lines.stroke(e.fout() * 2.5)
  Lines.circle(e.x, e.y, 5 + e.fin() * 70);
});

const spark = new Effect(20, e => {
  Draw.color(Pal.bulletYellow);
  Angles.randLenVectors(e.id, 5, 1 + 20 * e.finpow(), e.rotation, 110, (x, y) => {
    Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), e.fslope() * 3 + 1);
  });
});

const lightB = extend(LightningBulletType, {
  lightning: 5,
  lighningColor: Pal.lancerLaser,
  lightningLength: 25,
  lightningLengthRand: 5,
  lightningDamage: 50,
  lightningCone: 360,
  lightningAngle: 15,
  shootSound: Sounds.spark
});

const hB = extend(LightningBulletType, {
  lightning: 1,
  lighningColor: Pal.lancerLaser,
  lightningLength: 6,
  lightningLengthRand: 5,
  lightningDamage: 25,
  lightningCone: 360,
  lightningAngle: 10,
  shootSound: Sounds.spark
});

const orb = extend(BasicBulletType, {
  damage: 335,
  speed: 1.5,
  drag: 0.005,
  lifetime: 300,
  width: 30,
  height: 30,
  shrinkY: 0.1,
  shrinkX: 0.1,
  sprite: "diversetech-orb",
  backColor: Color.valueOf("f3f3f3"),
  lightning: 0.2,
  collidesAir: true,
  collidesGround: true,
  collides: true,
  hitShake: 8,
  trailChance: 1,

  //effects
  shootEffect: sFx,
  trailEffect: tFx,
  
  init(b){
    if(!b) return;
    spawned = true;
  },
  update(b){
    this.super$update(b);

    if(Mathf.chance(0.4)){
      lightB.create(b.owner, b.team, b.x, b.y, Mathf.range(360));
      if(Mathf.chance(0.4)) Effect.shake(6, 10, b.x, b.y);
      if(Mathf.chance(0.6)) Sounds.spark.at(b.x, b.y);
    }
  },
  hit(b){
    hFx.at(b.x, b.y);
  },
  despawned(b){
    despawned = true;
    dFx.at(b.x, b.y);
    Effect.shake(10, 15, b.x, b.y);
    for(let i = 0; i < 10; i++){
      if(i < 5) Sounds.spark.at(b.x, b.y);
      lightB.create(b.owner, b.team, b.x, b.y, Mathf.range(360));
    }
  }
});

const aura = extend(PowerTurret, "aura", {
  shots: 1,
  range: 240,
  reloadTime: 340,
  shootShake: 10,
  recoilAmount: 4,
  shootCone: 6,
  inaccuracy: 2,
  rotateSpeed: 2.5,
  shootType: orb,
  powerUse: 32,
  boostMultiplier: 0.2,
  shootSound: Sounds.shotgun,
  shootLength: 30,
  coolantMultiplier: 0.1
});

aura.buildType = () => extend(PowerTurret.PowerTurretBuild, aura, {
    placed(){
        //idk why i made this but it works
        this.rot = 0;
        this.rotBoost = 2.5;
        this.length = 30;
        this.shootingTimer = 0;
        this.bTimer = 0;
    },
    updateTile(){
        this.super$updateTile();
        ++this.shootingTimer;

        //shit code start here
        if(spawned && this.power.status >= 1){
            for(let i = 0; i < 12; i++){
                let tTime = Math.random(0.35);
                Timer.schedule(() => {
                    if(Mathf.chance(0.4)) Sounds.spark.at(this.x, this.y);
                    let bRand = this.rotation - 180 + Mathf.range(40);
                    lightB.create(this, this.team, this.x + Angles.trnsx(bRand, lightLength), this.y + Angles.trnsy(bRand, lightLength), bRand);
                }, tTime);
            }
            spawned = false;
        }

        if(Mathf.chance(0.07) && this.power.status >= 1){
            if(Mathf.chance(0.15) && this.health >= this.maxHealth/4) Effect.shake(8, 10, this.x, this.y);

                let rand = this.rotation - 180 + Mathf.range(40);
                let x = this.x + Angles.trnsx(rand, lightLength);
                let y = this.y + Angles.trnsy(rand, lightLength);

            if(this.health >= this.maxHealth/4){
                lightB.create(this, this.team, x, y, rand);
                Sounds.spark.at(this.x, this.y);
            } else {
                spark.at(x, y, this.rotation - 180);
                Sounds.plasmaboom.at(this.x, this.y);
            }
        }

        if(this.shootingTimer >= 31) this.shootingTimer = 0;
        if(this.isShooting() && this.power.status >= 1 && this.shootingTimer == 30){
          Timer.schedule(() => {
            shootingFx.at(this.x + Angles.trnsx(this.rotation, this.block.shootLength + 5), this.y + Angles.trnsy(this.rotation, this.block.shootLength + 5));
          }, 0.3);
        }

        /*
        draw stuff
        */
        if(this.power.status >= 1) this.rot = fc.plusRot(this.rot, 1.5 + this.rotBoost);

        if(this.isShooting()){
            if(this.length > 30) this.length = this.length - this.length/16;
            this.rotBoost = 2.5;
        } else {
            if(this.rotBoost > 0) this.rotBoost = this.rotBoost - this.rotBoost/3;
        }
        
        if(this.power.status < 1){
          if(this.length > 30) this.length = this.length - this.length/26;
        } else {
           if(this.length < 40 && !this.isShooting()) this.length = this.length + this.length/24;
        }

        //consfuse bullet spawning
        let x = this.x + Angles.trnsx(this.rotation, this.block.shootLength + 5);
        let y = this.y + Angles.trnsy(this.rotation, this.block.shootLength + 5);

        if(spawned && this.power.status >= 1  && Mathf.chance(0.6) || this.power.status >= 1 && Mathf.chance(0.05)){
          if(spawned || this.isShooting() && Mathf.chance(0.15)) Effect.shake(8, 10, this.x, this.y);
          for(let i = 0; i < 10; i++){
            if(Mathf.chance(0.5)) Sounds.spark.at(x, y);
            let iRot = (this.rot + (36 * i));
            hB.create(this, this.team, x + Angles.trnsx(iRot, this.length + 5), y + Angles.trnsy(iRot, this.length + 5), iRot + 5);
          }
        }
    },
    draw(){
        this.super$draw();
        this.thingRegion = Core.atlas.find("diversetech-aura-thing");

        for(let i = 0; i < 10; i++){
            let iRot = this.rot + (36 * i);
            let x = this.x + Angles.trnsx(this.rotation, this.block.shootLength + 5) + Angles.trnsx(iRot, this.length);
            let y = this.y + Angles.trnsy(this.rotation, this.block.shootLength + 5) + Angles.trnsy(iRot, this.length);

            Draw.rect(this.thingRegion, x, y, iRot + 90);
            Drawf.shadow(this.thingRegion, x - 7, y - 7, iRot + 90);
        }
    }
});
