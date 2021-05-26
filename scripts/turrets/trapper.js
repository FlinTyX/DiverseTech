const bAlloy = extend(BasicBulletType, {
  damage: 280,
  speed: 7,
  drag: 0.035,
  lifetime: 420,
  width: 25,
  height: 25,
  shrinkY: 0,
  sprite: "diversetech-trap",
  backColor: Color.valueOf("ffffff"),
  lightning: 1,
  collidesAir: false,
  collidesGround: true,
  collides: true,
  
  init(b){
    if(!b)return;
    b.data = new Trail(4);
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
    b.data.draw(Color.valueOf("ffffff"), 4);
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
