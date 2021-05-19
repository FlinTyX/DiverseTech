//tests

const fragB = extend(ContinuousLaserBulletType, {
  length: 150,
  drawSize: 150,
  damage: 405,
});

const lBullet = extend(ArtilleryBulletType, {
  damage: 10,
  speed: 2.2,
  lifetime: 80,
  width: 14,
  height: 12,
  collidesTiles: false,
  splashDamageRadius: 72,
  splashDamage: 65,
  
  //pain
  despawned(b){
    for (let i = 0; i < 4; ++i){
      let rot = (i * 90 + b.rot);
      fragB.create(this.owner, b.x, b.y, rot + b.fin() * 100);
    }
});
  
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
