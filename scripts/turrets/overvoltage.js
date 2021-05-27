const lightB = extend(LightningBulletType, {
  lightning: 3,
  lighningColor: Pal.lancerLaser,
  lightningLength: 10,
  lightningLengthRand: 5,
  lightningDamage: 10,
  lightningCone: 360,
  lightningAngle: 10
});

const orb = extend(BasicBulletType, {
  damage: 120,
  speed: 0.5,
  drag: -0.007,
  lifetime: 90,
  width: 30,
  height: 30,
  shrinkY: 0,
  sprite: "large-bomb",
  backColor: Color.valueOf("f3f3f3"),
  lightning: 0.2,
  collidesAir: true,
  collidesGround: true,
  collides: true,
  
  init(b){
    if(!b)return;
    b.data = new Trail(2);
  },
  update(b){
    this.super$update(b);
    b.data.update(b.x, b.y);
    if(Mathf.chance(0.2)){
      lightB.create(b.owner, b.team, b.x, b.y, b.rotation());
    }
  },
  draw(b){
    this.super$draw(b);
    b.data.draw(Color.valueOf("f2f2f2"), 2);
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
    if(Mathf.chance(0.1)){
      let rand = Math.floor(Mathf.range(6));
      lightB.create(this.owner, this.team, this.x + rand, this.y + rand, this.rotation);
    }
  }
});
