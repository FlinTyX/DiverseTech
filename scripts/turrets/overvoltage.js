let despawned = false;
let spawned = false;

const tFx = new Effect(60, e => {
  Draw.color(Pal.lancerLaser);
  Lines.stroke(1 + e.fout() * 2);
  Lines.circle(e.x, e.y, e.fout() * 8);
});

const dFx = new Effect(80, e => {
  Draw.color(Pal.lancerLaser);
  Lines.stroke(e.fout() * 3);
  Lines.circle(e.x, e.y, e.finpow() * 40);

  let f1 = e.finpow() * 40;
  let f2 = e.rotation + e.finpow() * 400;
  let h = 20 + e.fin() * 10;
  let w = e.fout() * 10;

  Drawf.tri(e.x + Angles.trnsx(f2, f1), e.y + Angles.trnsy(f2, f1), w, h, f2);
  Drawf.tri(e.x - Angles.trnsx(f2, f1), e.y - Angles.trnsy(f2, f1), w, -h, f2);

  e.scaled(7, i => {
    Lines.stroke(3 * i.fout());
    Lines.circle(e.x, e.y, 4 + i.fin() * 30);
  });
});

const hFx = new Effect(30, e => {
  Draw.color(Pal.lancerLaser);
  e.scaled(7, i => {
    Lines.stroke(3 * i.fout());
    Lines.circle(e.x, e.y, 4 + i.fin() * 60);
  });
});

const spark = new Effect(20, e => {
  Draw.color(Pal.bulletYellow);
  Angles.randLenVectors(e.id, 5, 1 + 20 * e.finpow(), e.rotation, 110, (x, y) => {
    Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), e.fslope() * 3 + 1);
  });
});

const lightB = extend(LightningBulletType, {
  lightning: 4,
  lighningColor: Pal.lancerLaser,
  lightningLength: 15,
  lightningLengthRand: 5,
  lightningDamage: 50,
  lightningCone: 360,
  lightningAngle: 10,
  shootSound: Sounds.spark
});

const hB = extend(LightningBulletType, {
  lightning: 3,
  lighningColor: Pal.lancerLaser,
  lightningLength: 10,
  lightningLengthRand: 5,
  lightningDamage: 15,
  lightningCone: 360,
  lightningAngle: 10,
  shootSound: Sounds.spark
});

const orb = extend(BasicBulletType, {
  damage: 205,
  speed: 1.5,
  drag: 0.005,
  lifetime: 210,
  width: 22,
  height: 22,
  shrinkY: 0.1,
  shrinkX: 0.1,
  sprite: "diversetech-orb",
  backColor: Color.valueOf("f3f3f3"),
  lightning: 0.2,
  collidesAir: true,
  collidesGround: true,
  collides: true,
  trailSpacing: 30,
  hitShake: 3,

  //effects
  shootEffect: Fx.none,
  trailEffect: tFx,
  
  init(b){
    if(!b) return;
    spawned = true;
  },
  update(b){
    this.super$update(b);
    if(Mathf.chance(0.4)){
      lightB.create(b.owner, b.team, b.x, b.y, Mathf.range(360));
      if(Mathf.chance(0.22)) Effect.shake(6, 10, b.x, b.y);
      Sounds.spark.at(b.x, b.y);
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

const overvoltage = extend(PowerTurret, "overvoltage", {
  shots: 1,
  range: 190,
  reloadTime: 300,
  shootShake: 6,
  recoilAmount: 4,
  shootCone: 6,
  inaccuracy: 2,
  rotateSpeed: 2.5,
  shootType: orb,
  powerUse: 16,
  boostMultiplier: 0.2,
  shootSound: Sounds.shotgun,
  shootLength: 15
});

overvoltage.buildType = () => extend(PowerTurret.PowerTurretBuild, overvoltage, {
  updateTile(){
    this.super$updateTile();
    if(spawned && this.power.status >= 1){
      for(let i = 0; i < 12; i++){
        let tTime = Math.random(0.4);
        Timer.schedule(() => {
          if(Mathf.chance(0.4)) Sounds.spark.at(this.x, this.y);
          let bRand = this.rotation - 180 + Mathf.range(40);
          lightB.create(this, this.team, this.x + Angles.trnsx(bRand, 18), this.y + Angles.trnsy(bRand, 18), bRand);
        }, tTime);
      }
      spawned = false;
    }

    if(Mathf.chance(0.05) && this.power.status >= 1){
      if(Mathf.chance(0.15) && this.health >= this.maxHealth/4) Effect.shake(8, 10, this.x, this.y);

      let rand = this.rotation - 180 + Mathf.range(40);
      let x = this.x + Angles.trnsx(rand, 18);
      let y = this.y + Angles.trnsy(rand, 18);

      if(this.health >= this.maxHealth/4){
        hB.create(this, this.team, x, y, rand);
        Sounds.spark.at(this.x, this.y);
      } else {
        spark.at(x, y, this.rotation - 180);
        Sounds.plasmaboom.at(this.x, this.y);
      }
    }
  }
});

