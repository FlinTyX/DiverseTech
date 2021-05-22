const b1 = extend(MissileBulletType, {
  damage: 340,
  speed: 1.2,
  lifetime: 200,
  homingPower: 0.1,
  homingRange: 60,
  width: 8,
  height: 8,
  
  update(b){
    this.super$update(b);
    b.vel.lerp(b, b1.speed);
  },
  despawned(b){
    b1.speed = 1.2;
  },
  hit(b){
    b1.speed = 1.2;
  }
});

const b2 = extend(MissileBulletType, {
  damage: 110,
  speed: 2.7,
  lifetime: 200,
  homingPower: 0.1,
  homingRange: 60,
  width: 8,
  height: 8
});

const turret = extend(ItemTurret, "the", {
  shots: 1,
  range: 250,
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
