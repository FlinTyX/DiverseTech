//tests
const lBullet = extend(ContinuousLaserBulletType, {
  length: 120,
  drawSize: 140,
  damage: 50,
  collides: true,
  lifetime: 70,
});

const lotus = extend(LaserTurret, "lotus", {
  shots: 4,
  inaccuracy: 3,
  reloadTime: 300,
  shootShake: 7,
  range: 290,
  liquidMultiplier: 1,
  shootDuration: 250,
  shootLength: -10,
  shootType: lBullet
});

lotus.buildType = () => extend(LaserTurret.LaserTurretBuild, lotus, {
  updateTile(){
    this.super$updateTile();
    if(this.isShooting() && this.power.status > 0 && !this.isControlled()){
      this.rotation = this.rotation + 7;
    }
  }
});
