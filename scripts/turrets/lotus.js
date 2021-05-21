//tests
const lBullet = extend(ContinuousLaserBulletType, {
  length: 150,
  drawSize: 150,
  damage: 50,
  collides: true,
  lifetime: 200,
});

const lotus = extend(LaserTurret, "lotus", {
  shots: 1,
  inaccuracy: 3,
  reloadTime: 300,
  shootShake: 7,
  range: 290,
  minRange: 65,
  shootDuration: 250,
  shootType: lBullet
});

lotus.buildType = () => extend(LaserTurret.LaserTurretBuild, lotus, {
  updateTile(){
    this.super$updateTile();
    if(this.isShooting() && this.power.status > 0 || this.wasShooting && this.isControlled() && this.power.status > 0){
      this.rotation = this.rotation + 15;
    } else if(!this.isShooting() || !this.wasShooting){
      this.rotation = this.rotation;
    }
  }
});
