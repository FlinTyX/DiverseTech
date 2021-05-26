const bAlloy = extend(BasicBulletType, {
  damage: 280,
  speed: 5,
  drag: -0.01,
  lifetime: 999,
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
    b.rotation(b.rotation() + b.fin() * 360);
  },
  draw(b){
    this.super$draw(b);
    b.data.draw(Color.valueOf("ffffff"), 5);
  }
});

const trapper = extend(ItemTurret, "trapper", {
  shots: 3,
  range: 135,
  reloadTime: 100,
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
