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

const chanceSpark = (x, y, team, damage, rotation, length, chance, shake) => {
  if(Mathf.chanceDelta(chance)){
    if(shake) Effect.shake(3, 8, x, y);
    Sounds.spark.at(x, y, 0, Math.random()/2);
  }

  Lightning.create(team, Pal.lancerLaser,damage, x, y, rotation, length);
};

let orb = extend(BasicBulletType, {
  damage: 1560, //stat only
  speed: 1.8,
  drag: 0.0052,
  lifetime: 295,
  width: 30,
  height: 30,
  shrinkY: 0.1,
  shrinkX: 0.1,
  sprite: "diversetech-orb",
  backColor: Color.valueOf("f3f3f3"),
  lightning: 10,
  collides: false,
  hittable: false,
  hitShake: 10,
  trailChance: 1,
  pierce: true,
  absorbable: false,
  reflectable: false,

  homingPower: 0.045,
  homingRange: 40,

  trailColor: Pal.lancerLaser,
  trailWidth: 2.2,
  trailLength: 10,
  
  shootEffect: sFx,
  trailEffect: tFx,
  
  update(b){
    this.super$update(b);

    if(Mathf.chanceDelta(0.5)){
      Lightning.create(b.team, Pal.lancerLaser, 43, b.x, b.y, Math.random() * 360, 16);

      if(Mathf.chanceDelta(0.1)) Effect.shake(3, 5, b.x, b.y);
      if(Mathf.chanceDelta(0.08)) Sounds.spark.at(b.x, b.y, 0, Math.random()/2);
    }
  },
  hit(b){
    hFx.at(b.x, b.y);
  },
  despawned(b){
    dFx.at(b.x, b.y);

    Sounds.explosionbig.at(b.x, b.y);
    Sounds.bang.at(b.x, b.y);
    Sounds.explosion.at(b.x, b.y);
    Effect.shake(20, 35, b.x, b.y);

    for(let i = 0; i < 15; i++){
      chanceSpark(b.x, b.y, b.team, 28, Math.random() * 360, 17 + (Math.random() * 5), 0.05, false);
    }
  }
});

const aura = extend(PowerTurret, "aura", {
  shots: 1,
  range: 240,
  reloadTime: 340,
  shootShake: 12,
  recoilAmount: 12,
  shootCone: 6,
  inaccuracy: 8,
  rotateSpeed: 1.2,
  shootType: orb,
  powerUse: 32,
  coolantMultiplier: 0.1,
  coolantUsage: 2.4,
  shootSound: Sounds.shotgun,
  shootLength: 30,

  lightLength: 29,

  load(){
    this.spinnerRegion = Core.atlas.find(this.name + "-spinner");
    this.super$load();
  }
});

aura.buildType = () => extend(PowerTurret.PowerTurretBuild, aura, {
  shootTimer: 0,  
  rot: 0,
  rotBoost: 0,
  length: 20,

  onDestroyed(){
    this.super$onDestroyed();

    hFx.at(this.x, this.y);
    Fx.massiveExplosion.at(this.x, this.y);
    Effect.shake(25, 20, this.x, this.y);
  },
  updateTile(){
    this.super$updateTile();
    this.rot >= 360 - Time.delta * this.rotBoost ? this.rot = 0 : this.rot += Time.delta * this.rotBoost;

    this.trX = this.x + Angles.trnsx(this.rotation, (this.block.shootLength + 2) - this.recoil);
    this.trY = this.y + Angles.trnsy(this.rotation, (this.block.shootLength + 2) - this.recoil);
    this.length = Mathf.lerpDelta(this.length, this.power.status > 0.2 ? this.isShooting() ? 20 : 24.5 : 20, 0.1);

    if(this.isShooting() && this.power.status > 0.2){

      this.length = Mathf.lerpDelta(this.length, 20, 0.1);
      this.rotBoost = Mathf.lerpDelta(this.rotBoost, 4.5, 0.15);

    } else {
      if(this.rotBoost > 0.1) this.rotBoost = Mathf.lerpDelta(this.rotBoost, 0, 0.1);
    }

    if(this.power.status < 0.2 || Mathf.chanceDelta(0.4)) return;
    
    let rand = this.rotation - 180 + Mathf.range(35);
    Tmp.v1.trns(rand, aura.lightLength).add(this.x, this.y);

    if(Mathf.chanceDelta(0.1)){
      if(this.health > this.maxHealth/5){
        chanceSpark(Tmp.v1.x, Tmp.v1.y, this.team, 3, rand, 11, 0.7, false);
      } else {
        Sounds.plasmaboom.at(this.x, this.y);
        spark.at(Tmp.v1.x, Tmp.v1.y, this.rotation - 180);
      }
    }

    this.shootTimer += Time.delta;

    if(this.isShooting()){

      if(this.shootTimer > 10){
        this.shootTimer = 0;
        shootingFx.at(this.trX, this.trY);
      }

      this.length = Mathf.lerpDelta(this.length, 20, 0.1);
      this.rotBoost = Mathf.lerpDelta(this.rotBoost, 4.5, 0.15);

    } else {
      this.rotBoost = Mathf.lerpDelta(this.rotBoost, 0, 0.1);
    }
  },
  shoot(type){
    this.super$shoot(type);
    for(let i = 0; i < 12; i++){
      let rot = this.rotation - 180 + Mathf.range(35);
      Tmp.v2.trns(rot, aura.lightLength).add(this.x, this.y);

      chanceSpark(Tmp.v2.x, Tmp.v2.y, this.team, 6, rot, 13 + Math.random(), 0.3, true);
    }
  },
  draw(){
      this.super$draw();

      for(let i = 0; i < 7; i++){
          let rot = this.rot + ((360 / 7) * i);
          let x = this.trX + Angles.trnsx(rot, this.length);
          let y = this.trY + Angles.trnsy(rot, this.length);

          Draw.z(Layer.turret + 1);
          Draw.rect(aura.spinnerRegion, x, y, rot + 90);
          Draw.z(Layer.turret + 0.8);
          Drawf.shadow(aura.spinnerRegion, x - 7, y - 7, rot + 90);
      }
      Draw.reset();
  }
});