//tests

const fragB = extend(ContinuousLaserBulletType, {});
fragB.length = 150;
fragB.drawSize = 150;
fragB.damage = 50;

const lBullet = extend(ArtilleryBulletType, {
  //pain
  let despawned = false;
  let rot = 0;
  
  despawned(b){
    despawned = true;
  },
  update(b){
    rot = rot + 0.5;
    if(despawned){
      for (let i = 0; i < 4; ++i){
        let ang = i * 90 + b.rotation();
        fragB.create(this, b.x, b.y, ang + rot);
      }
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
