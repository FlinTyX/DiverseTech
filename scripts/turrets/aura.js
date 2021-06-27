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
  e.scaled(25, i => {
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
  damage: 455,
  speed: 1.7,
  drag: 0.005,
  lifetime: 293,
  width: 30,
  height: 30,
  shrinkY: 0.1,
  shrinkX: 0.1,
  sprite: "diversetech-orb",
  backColor: Color.valueOf("f3f3f3"),
  lightning: 10,
  collidesAir: true,
  collidesGround: true,
  hittable: false,
  hitShake: 10,
  trailChance: 1,
  pierce: true,
  absorbable: false,

  //effects
  shootEffect: sFx,
  trailEffect: tFx,
  
  init(b){
    if(!b) return;
    spawned = true;
  },
  update(b){
    this.super$update(b);

    if(Mathf.chance(0.48)){
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
    Effect.shake(25, 40, b.x, b.y);
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
  shootShake: 20,
  recoilAmount: 12,
  shootCone: 6,
  inaccuracy: 3,
  rotateSpeed: 1.2,
  shootType: orb,
  powerUse: 32,
  coolantMultiplier: 0.1,
  coolantUsage: 2.4,
  shootSound: Sounds.shotgun,
  shootLength: 30
});

aura.buildType = () => extend(PowerTurret.PowerTurretBuild, aura, {
    setVars(){
      this.rot = 0;
      this.rotBoost = 2.5;
      this.length = 20;
      this.shootingTimer = 0;
    },
    onDestroyed(){
      this.super$onDestroyed();
      hFx.at(this.x, this.y);
      Fx.massiveExplosion.at(this.x, this.y);
      Effect.shake(20, 20, this.x, this.y);
    },
    updateTile(){
      this.super$updateTile();
      if(!this.rot || !this.length) this.setVars(); //checking undefined variables
      if(this.power.status >= 0.5) this.rot = fc.plusRot(this.rot, (Time.delta * 2 + this.rotBoost) * this.power.status);
      
      this.trX = this.x + Angles.trnsx(this.rotation, (this.block.shootLength + 2) - this.recoil);
      this.trY = this.y + Angles.trnsy(this.rotation, (this.block.shootLength + 2) - this.recoil);
        
      if(spawned && this.power.status == 1){
        spawned = false;
        for(let i = 0; i < 12; i++){
          Timer.schedule(() => {
            if(Mathf.chance(0.4)) Sounds.spark.at(this.x, this.y);
            if(!Vars.state.isPaused()){

            let rand = this.rotation - 180 + Mathf.range(40);
            lightB.create(this, this.team, this.x + Angles.trnsx(rand, lightLength), this.y + Angles.trnsy(rand, lightLength), rand);

            }
          }, Math.random(0.35));
        }
      }

      if(Mathf.chance(0.06) && this.power.status == 1 || spawned && this.power.status == 1){

        let rand = this.rotation - 180 + Mathf.range(40);
        let x = this.x + Angles.trnsx(rand, lightLength);
        let y = this.y + Angles.trnsy(rand, lightLength);

        if(this.health >= this.maxHealth/4){
          if(Mathf.chance(0.05)) Effect.shake(8, 10, this.x, this.y);
          lightB.create(this, this.team, x, y, rand);
          Sounds.spark.at(this.x, this.y);
        } else {
          spark.at(x, y, this.rotation - 180);
          Sounds.plasmaboom.at(this.x, this.y);
        }
      }

      this.shootingTimer = this.shootingTimer >= 31 ? 0 : this.shootingTimer + 1;
      if(this.isShooting() && this.power.status == 1 && this.shootingTimer == 30) shootingFx.at(this.trX, this.trY);

      if(this.isShooting() && this.power.status == 1){
        this.length = Mathf.lerpDelta(this.length, 20, 0.1);
        this.rotBoost = Mathf.lerpDelta(this.rotBoost, 3, 0.08);
      } else {
        this.rotBoost = Mathf.lerpDelta(this.rotBoost, 0, 0.03);
      }

      if(this.power.status == 1){
        if(!this.isShooting()) this.length = Mathf.lerpDelta(this.length, 24, 0.1);
      } else {
        this.length = Mathf.lerpDelta(this.length, 20, 0.1);
      }

      if(spawned || this.power.status == 1 && Mathf.chance(0.05)){
        if(spawned || this.isShooting() && Mathf.chance(0.15)) Effect.shake(8, 12, this.x, this.y);
        for(let i = 0; i < 10; i++){
          if(Mathf.chance(0.5)) Sounds.spark.at(this.trX, this.trY);
          let iRot = this.rot + (36 * i);
          hB.create(this, this.team, this.trX + Angles.trnsx(iRot, this.length + 5), this.trY + Angles.trnsy(iRot, this.length + 5), iRot + 5);
        }
      }
    },
    draw(){
        this.super$draw();
        this.thingRegion = Core.atlas.find("diversetech-aura-thing");
        Draw.z(Layer.turret + 1)

        for(let i = 0; i < 10; i++){
            let iRot = this.rot + (36 * i);
            let x = this.trX + Angles.trnsx(iRot, this.length);
            let y = this.trY + Angles.trnsy(iRot, this.length);

            Draw.rect(this.thingRegion, x, y, iRot + 90);
            Drawf.shadow(this.thingRegion, x - 7, y - 7, iRot + 90);
        }
    }
});
