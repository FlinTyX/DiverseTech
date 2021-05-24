const bAlloy = extend(BesicBulletType, {
  damage: 270,
  speed: 8,
  drag: 0.07,
  lifetime: 300,
  heght: 22,
  width: 22,
  lightning: 3,

  update(b){
    b.rotation(b.rotation + 1);
    this.super$update(b);
  }
});

const bNitinol = extend(BasicBulletType, {
  damage: 195,
  speed: 8,
  drag: 0.07,
  lifetime: 285,
  heght: 22,
  width: 22,
  lightning: 3,

  update(b){
    b.rotation(b.rotation + 1);
    this.super$update(b);
  }
});

const trapper = extend(ItemTurret, "trapper", {
  shots: 3,
  range: 105,
  reloadTime: 110,
  shootShake: 3,
  recoilAmount: 2,
  shootCone: 8,
  spread: 20,
  inaccuracy: 0,
  rotateSpeed: 1.8,

  init(){
    this.ammo(
      Vars.content.getByName(ContentType.item, "diversetech-hyper-alloy", bAlloy,
      Vars.content.getByName(ContentType.item, "diversetech-nitinol", bNitinol
    );
    this.super$init();
  }
});

trapper.buildType = () => extend(ItemTurret.ItemTurretBuild, trapper, {});
