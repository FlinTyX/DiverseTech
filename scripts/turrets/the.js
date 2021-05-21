const bullet = extend(MissileBulletType, {
  damage: 200,
  speed: 3,
  lifetime: 150,
  homingPower: 0.01,
  width: 8,
  height: 8,
  
  update(b){
    Timer.schedule(() => {
      b.speed += 20;
      b.homingPower += 0.1;
    }, 3}
  },
  despawned(b){
    b.speed = 3;
    b.homingPower = 0.01;
  }
});

const turret = extend(ItemTurret, "the", {
  shots: 1,
  range: 150,
  shootCone: 2,
  reloadTime: 210,
  rotateSpeed: 5,
  shootShake: 5,
});

turret.buildType = () => extend(ItemTurret.ItemTurretBuild, turret, {});
