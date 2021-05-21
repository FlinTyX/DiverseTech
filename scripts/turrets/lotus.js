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
  shootDuration: 200,
  shootType: lBullet
});

lotus.buildType = () => extend(LaserTurret.LaserTurretBuild, lotus, {
  updateTile(){
    this.super$updateTile();
    if(this.isShooting() && this.power.status > 0){
      this.rotation = this.rotation + 3;
    } else if(!this.isShooting()){
      this.rotation = this.rotation;
    }
  }
});
