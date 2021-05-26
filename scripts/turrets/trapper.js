const bAlloy = extend(BasicBulletType, {
  damage: 280,
  speed: 8.5,
  drag: 0.03,
  lifetime: 400,
  width: 45,
  heihgt: 45,
  sprite: "diversetech-trap",
  backColor: Color.valueOf("ffffff"),
  lightning: 3,
  collidesAir: false,
  collidesGround: true,
  collides: true,
  
  init(b){
    if(!b)return;
    b.data = new Trail(5);
  },
  update(b){
    this.super$update(b);
    b.data.update(b.x, b.y);
    Timer.schedule(() => {
      b.rotation(b.rotation() + 3);
    }, 1.02);
  },
  draw(b){
    this.super$draw(b);
    b.data.draw(Color.valueOf("ffffff"), 5);
  }
});

const trapper = extend(ItemTurret, "trapper", {
  shots: 3,
  range: 140,
  reloadTime: 140,
  shootShake: 3,
  recoilAmount: 2,
  shootCone: 8,
  spread: 20,
  inaccuracy: 8,
  rotateSpeed: 2.5,

  init(){
    this.ammo(
      Vars.content.getByName(ContentType.item, "diversetech-hyper-alloy"), bAlloy
    );
    this.super$init();
  }
});

trapper.buildType = () => extend(ItemTurret.ItemTurretBuild, trapper, {});
