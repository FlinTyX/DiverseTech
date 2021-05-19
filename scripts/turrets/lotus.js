//tests

const fragB = extend(ContinuousLaserBulletType, {
  length: 150,
  drawSize: 150,
  damage: 405,
});

const lBullet = extend(ArtilleryBulletType, {
  //pain
  despawned(b){
    for (let i = 0; i < 4; ++i){
      let rot = (i * 90 + b.rot);
      fragB.create(this.owner, b.x, b.y, rot + b.fin() * 100);
    }  
  }
});
lBullet.damage = 10;
lBullet.speed = 2.2;
lBullet.lifetime = 80;
lBullet.width = 14;
lBullet.height = 12;
lBullet.collidesTiles = false;
lBullet.splashDamageRadius = 72;
lBullet.splashDamage = 65;

//bullet
const lotus = extend(PowerTurret, "lotus", {
  targetAir: false,
  shots: 1,
  inaccuracy: 3,
  reloadTime: 120,
  shootShake: 7,
  range: 290,
  minRange: 65,
  shootType: lBullet
});

lotus.buildType = () => extend(PowerTurret.PowerTurretBuild, lotus, {});
