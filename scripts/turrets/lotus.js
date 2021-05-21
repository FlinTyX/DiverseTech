//tests
const lBullet = extend(ContinuousLaserBulletType, {
  length: 120,
  drawSize: 140,
  damage: 50,
  collides: true,
  lifetime: 70,
});

const lotus = extend(LaserTurret, "lotus", {
  shots: 1,
  inaccuracy: 3,
  reloadTime: 300,
  shootShake: 7,
  range: 290,
  liquidMultiplier: 1,
  shots: 4,
  shootDuration: 250,
  shootLength: 0,
  shootType: lBullet
});

lotus.buildType = () => extend(LaserTurret.LaserTurretBuild, lotus, {
  updateTile(){
    this.super$updateTile();
    if(this.isShooting() && this.power.status > 0 && !this.isControlled()this.power.status > 0){
      this.rotation = this.rotation + 7;
      lBullet.rotation(this.rotation + 90);
    }
  }
});
