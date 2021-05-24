const bAlloy = extend(BasicBulletType, {
  damage: 270,
  speed: 8,
  drag: 0.02,
  lifetime: 360,
  heght: 22,
  width: 22,
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
     b.rotation(b.rotation() + 2);
    }, 1.2)
  },
  draw(b){
    this.super$draw(b);
    b.data.draw(Color.valueOf("ffffff"), 5);
  }
});

const bNitinol = extend(BasicBulletType, {
  damage: 195,
  speed: 8,
  drag: 0.02,
  lifetime: 355,
  heght: 22,
  width: 22,
  sprite: "diversetech-trap",
  backColor: Color.valueOf("ffffff"),
  lightning: 3,
  collidesAir: false,
  collidesGround: false,
  collides: true,

  init(b){
    if(!b)return;
    b.data = new Trail(5);
  },
  update(b){
    this.super$update(b);
    b.data.update(b.x, b.y);
    Timer.schedule(() => {
      b.rotation(b.rotation() + 2);
    }, 1)
  },
  draw(b){
    this.super$draw(b);
    b.data.draw(Color.valueOf("ffffff"), 5);
  }
});

const trapper = extend(ItemTurret, "trapper", {
  shots: 3,
  range: 125,
  reloadTime: 100,
  shootShake: 3,
  recoilAmount: 2,
  shootCone: 8,
  spread: 20,
  inaccuracy: 0,
  rotateSpeed: 2.5,

  init(){
    this.ammo(
      Vars.content.getByName(ContentType.item, "diversetech-hyper-alloy"), bAlloy,
      Vars.content.getByName(ContentType.item, "diversetech-nitinol"), bNitinol
    );
    this.super$init();
  }
});

trapper.buildType = () => extend(ItemTurret.ItemTurretBuild, trapper, {});
