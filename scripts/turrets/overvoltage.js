const despawnB = extend(LightningBulletType, {
  shootEffect: Fx.none,
  lightning: 6,
  lighningColor: Pal.lancerLaser,
  lightningLength: 20,
  lightningLengthRand: 5,
  lightningDamage: 30,
  lightningCone: 360,
  lightningAngle: 10
});

const lightB = extend(LightningBulletType, {
  shootEffect: Fx.none,
  lightning: 3,
  lighningColor: Pal.lancerLaser,
  lightningLength: 13,
  lightningLengthRand: 5,
  lightningDamage: 15,
  lightningCone: 360,
  lightningAngle: 10
});

const orb = extend(BasicBulletType, {
  damage: 190,
  speed: 1.5,
  drag: 0.005,
  lifetime: 210,
  width: 22,
  height: 22,
  shrinkY: 1,
  shrinkX: 1,
  sprite: "diversetech-orb",
  backColor: Color.valueOf("f3f3f3"),
  lightning: 0.2,
  collidesAir: true,
  collidesGround: true,
  collides: true,
  splashRadius: 5,
  fragBullets: 1,
  fragBullet: despawnB,
  
  update(b){
    this.super$update(b);
    if(Mathf.chance(0.2)){
      lightB.create(b.owner, b.team, b.x, b.y, Mathf.range(360));
      if(Mathf.chance(0.2)) Effect.shake(6, 10, b.x, b.y);
    }
  }
});

const overvoltage = extend(PowerTurret, "overvoltage", {
  shots: 1,
  range: 190,
  reloadTime: 305,
  shootShake: 3,
  recoilAmount: 2,
  shootCone: 6,
  inaccuracy: 2,
  rotateSpeed: 2.5,
  shootType: orb,
  powerUse: 11
});

overvoltage.buildType = () => extend(PowerTurret.PowerTurretBuild, overvoltage, {
  updateTile(){
    this.super$updateTile();
    if(Mathf.chance(0.06)){
      let rand = this.rotation - 180 + Mathf.range(50);
      if(this.power.status >= 1){
        lightB.create(this, this.team, this.x + Angles.trnsx(rand, 20), this.y + Angles.trnsy(rand, 20), rand);
        if(Mathf.chance(0.15)) Effect.shake(8, 10, this.x, this.y);
      }
    }
  }
});
