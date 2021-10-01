const deathEffect = new Effect(30, e => {
  Draw.color(Pal.lancerLaser);
  e.scaled(20, i => {
    Lines.stroke(2.2 * i.fout());
    Lines.circle(e.x, e.y, 4 + i.fin() * 30);
  });
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

const orb = extend(BasicBulletType, {
  damage: 350,
  speed: 1.1,
  drag: 0.0052,
  lifetime: 210,
  width: 20,
  height: 20,
  shrinkY: 0.1,
  shrinkX: 0.1,
  sprite: "diversetech-orb",
  backColor: Color.valueOf("f3f3f3"),

  lightning: 5,
  collides: false,
  hittable: false,
  hitShake: 4,
  pierce: true,
  absorbable: false,
  reflectable: false,

  homingPower: 0.038,
  homingRange: 40,

  trailColor: Pal.lancerLaser,
  trailWidth: 3,
  trailLength: 15,

  shootEffect: Fx.none,

  update(b){
    this.super$update(b);

    if(Mathf.chanceDelta(0.4)){
      Lightning.create(b.team, Pal.lancerLaser, 10, b.x, b.y, Math.random() * 360, 12.5);

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
    Effect.shake(8, 15, b.x, b.y);

    for(let i = 0; i < 15; i++){
      if(b.owner != null) b.owner.block.buildType.get().chanceSpark(b.x, b.y, 5, Math.random() * 360, 12.5 + (Math.random() * 3), 0.05, false);
    }
  }

});

const overvoltage = extend(PowerTurret, "overvoltage", {
  shots: 1,
  range: 150,
  reloadTime: 290,
  shootShake: 6,
  recoilAmount: 4,
  shootCone: 6,
  inaccuracy: 2,
  rotateSpeed: 2.5,
  shootType: orb,
  powerUse: 0.1,
  boostMultiplier: 0.2,
  shootSound: Sounds.shotgun,
  shootLength: 15
});

overvoltage.buildType = () => extend(PowerTurret.PowerTurretBuild, overvoltage, {
  chanceSpark(x, y, damage, rotation, length, chance, shake){
    Time.run(Math.random() * 32, () => {
      if(Mathf.chanceDelta(chance)){
        if(shake) Effect.shake(3, 8, x, y);
        Sounds.spark.at(x, y, 0, Math.random()/2);
      }

      Lightning.create(this.team, Pal.lancerLaser,damage, x, y, rotation, length);
    });
  },
  onDestroyed(){
    this.super$onDestroyed();

    tFx.at(this.x, this.y);
    Fx.massiveExplosion.at(this.x, this.y);
    Effect.shake(25, 20, this.x, this.y);
  },
  updateTile(){
    this.super$updateTile();
    if(this.power.status < 0.99 || Mathf.chanceDelta(0.4)) return;
    
    let rand = this.rotation - 180 + Mathf.range(35);
    Tmp.v1.trns(rand, overvoltage.shootLength).add(this.x, this.y);

    if(Mathf.chanceDelta(0.1)){
      if(this.health > this.maxHealth/5){
        this.chanceSpark(Tmp.v1.x, Tmp.v1.y, 2, rand, 10, 0.7, false);
      } else {
        Sounds.plasmaboom.at(this.x, this.y);
        spark.at(Tmp.v1.x, Tmp.v1.y, this.rotation - 180);
      }
    }
  },
  shoot(type){
    this.super$shoot(type);
    for(let i = 0; i < 12; i++){
      let rot = this.rotation - 180 + Mathf.range(35);
      Tmp.v2.trns(rot, overvoltage.shootLength).add(this.x, this.y);

      this.chanceSpark(Tmp.v2.x, Tmp.v2.y, 6, rot, 13 + Math.random(), 0.3, true);
    }
  },
});
