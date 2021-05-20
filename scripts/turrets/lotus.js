//tests
const fragB = extend(ContinuousLaserBulletType, {
  length: 150,
  drawSize: 150,
  damage: 50,
  lifetime: 100,
  continuous: false,
});

const lBullet = extend(ArtilleryBulletType, {
  damage: 10,
  speed: 2.2,
  lifetime: 70,
  width: 14,
  heigth: 12,
  collidesTiles: false,
  splashDamageRadius: 72,
  splashDamage: 65,
  
  //aaaaaaaaaaaaaaaa
  despawned(b){
    for(let i = 0; i < 4; ++i){
      let rotato = 0;
      let ang = i * 90;
      for(let z = 0; z < 360; ++z) rotato++
      fragB.create(b.owner, b.team, b.x, b.y, ang + b.rotation());
    }
  }
});

//bullet
const lotus = extend(PowerTurret, "lotus", {
  targetAir: false,
  shots: 1,
  inaccuracy: 3,
  reloadTime: 300,
  shootShake: 7,
  range: 290,
  minRange: 65,
  shootType: lBullet
});

lotus.buildType = () => extend(PowerTurret.PowerTurretBuild, lotus, {});
