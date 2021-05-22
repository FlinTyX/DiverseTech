const b1 = extend(MissileBulletType, {
  damage: 340,
  speed: 3,
  lifetime: 150,
  homingPower: 0.01,
  width: 8,
  height: 8,
  
  update(b){
    Timer.schedule(() => {
      b.speed += 20;
      b.homingPower += 0.1;
    }, 3)
  },
  despawned(b){
    b.speed = 3;
    b.homingPower = 0.01;
  }
});

const b2 = extend(MissileBulletType, {
  damage: 110,
  speed: 2.7,
  lifetime: 150,
  homingPower: 0.1,
  width: 8,
  height: 8
});

const turret = extend(ItemTurret, "the", {
  shots: 1,
  range: 150,
  shootCone: 2,
  reloadTime: 210,
  rotateSpeed: 5,
  shootShake: 5,
  
  init(){
    this.ammo(
      Vars.content.getByName(ContentType.item, "diversetech-hyper-alloy"), b1,
      Vars.content.getByName(ContentType.item, "diversetech-nitinol"), b2
    );
    this.super$init();
  }
});

turret.buildType = () => extend(ItemTurret.ItemTurretBuild, turret, {});
