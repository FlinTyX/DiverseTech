//tests
const lBullet = extend(ContinuousLaserBulletType, {
  length: 120,
  drawSize: 140,
  damage: 50,
  collides: true,
  lifetime: 300,
  continuous: true
});

const lotus = extend(ItemTurret, "lotus", {
  shots: 4,
  spacing : 90,
  shootCone : 360,
  shootLength : 0,
  inaccuracy: 0,
  reloadTime: 300,
  shootShake: 7,
  range: 290,
  liquidMultiplier: 1,
  shootDuration: 250,
  shootType: lBullet
});

lotus.buildType = () => extend(ItemTurret.ItemTurretBuild, lotus, {
  updateTile(){
    this.super$updateTile();
    if(this.isShooting() && this.power.status > 0 && !this.isControlled()){
      this.rotation = this.rotation7;
    }
  }
});
