const bAlloy = extend(BasicBulletType, {
  damage: 280,
  speed: 7,
  drag: 0.04,
  lifetime: 440,
  width: 19,
  height: 19,
  shrinkY: 0,
  sprite: "large-bomb",
  backColor: Color.valueOf("f3f3f3"),
  lightning: 0.2,
  collidesAir: false,
  collidesGround: true,
  collides: true,
  
  init(b){
    if(!b)return;
    b.data = new Trail(2);
  },
  update(b){
    this.super$update(b);
    b.data.update(b.x, b.y);
    if(Mathf.chance(0.05)){
      b.drag = b.drag + Math.random(-0.009, 0.023);
      b.vel.len(b.vel.len() - b.drag * 100);
    }
  },
  draw(b){
    this.super$draw(b);
    b.data.draw(Color.valueOf("f2f2f2"), 2);
  }
});

const trapper = extend(ItemTurret, "trapper", {
  shots: 3,
  range: 140,
  reloadTime: 200,
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
