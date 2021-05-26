//effects
const shootFx = new Effect(40, e => {
  Draw.color(Color.valueOf("f49d7c"));

  for(let i = 0; i < 3; ++i){
    Drawf.tri(e.x, e.y, e.fout() * 7, e.fout() * 90, e.rotation - 30 + (30 * i));
  };

  Lines.stroke(0.6);
    Angles.randLenVectors(e.id, 8, 40 * e.finpow(), (x, y) => {
      for(let i = 0; i < 4; ++i){
        Drawf.tri(e.x+x, e.y+y, e.fout() * 3, e.fout () * 8, e.rotation + (90 * i) + e.fin() * 100);
      }
  });

  e.scaled(7, i => {
    Lines.stroke(3 * i.fout());
    Lines.circle(e.x, e.y, 4 + i.finpow() * 30);
  });
 
  Draw.color(Color.valueOf("f49d7c"), Color.valueOf("6e7080"), e.fin());
  Angles.randLenVectors(e.id + 10, 8, 40 * e.finpow(), (x, y) => {
    Fill.circle(e.x+x, e.y+y, e.fout() * 2);
  });
});

const despawnFx = new Effect(45, e => {
  e.rotation = e.fin() * 200;

  Draw.color(Color.valueOf("f49d7c"));
  for(let i = 0; i < 4; ++i){
    Drawf.tri(e.x, e.y, e.fout() * 5, e.fout() * 70, e.rotation + (90 * i));
  };

  Lines.stroke(e.fout() * 1.5);
  Lines.circle(e.x, e.y, 20 + e.fin() * 10);
});

const hitFx = new Effect(30, e => {
  Draw.color(Color.valueOf("f49d7c"));

  for(let i = 0; i < 2; ++i){
    Drawf.tri(e.x, e.y, e.fout() * 5, e.fout() * 70, e.rotation - 190 + (25 * i) - e.fin());
  };

  Lines.stroke(e.fout() * 1.5);
  Fill.circle(e.x, e.y, e.fout() * 3);
  Lines.circle(e.x, e.y, e.finpow() * 20);
});

const fragB1 = extend(BasicBulletType, {
  damage: 95,
  speed: 4.5,
  lifetime: 80,
  height: 23,
  width: 19,
  homingPower: 0.2,
  homingRange: 200,
  weaveScale: 3,
  weaveMag: 3,
  lightning: 3.5,
  lightningLenght: 10,
  sprite: "diversetech-arrow",
  backColor: Color.valueOf("ffc999"),
  shrinkY: 0,
  
  //fx
  hitEffect: hitFx,
  despawnEffect: despawnFx,
  
  init(b){
    if(!b)return;
    b.data = new Trail(10);
  },
  update(b){
    this.super$update(b);
    b.data.update(b.x, b.y);
  },
  draw(b){
    this.super$draw(b);
    b.data.draw(Color.valueOf("ffc999"), 4);
  }
});

const  bullet1  = extend(BasicBulletType, {
  damage: 60,
  speed: 7,
  lifetime: 125,
  drag: 0.04,
  height: 18,
  width: 18,
  collidesGround: true,
  collides: true,
  weaveScale: 3,
  weaveMag: 3,
  lightning: 3,
  lightningLenght: 8,
  trailEffect: Fx.artilleryTrail,
  trailChance: 5,
  fragBullets: 1,
  fragCone: 80,
  shrinkY: 0,
  sprite: "diversetech-smallArrow",
  backColor: Color.valueOf("ffc999"),
  
  //fx
  shootEffect: shootFx,
  fragBullet: fragB1
});

const turret = extend(ItemTurret, "magma", {
  shots: 3,
  range: 290,
  reloadTime: 225,
  shootShake: 5,
  recoilAmount: 2,
  shootCone: 10,
  spread: 30,
  inaccuracy: 15,
  rotateSpeed: 3,
  shootType: bullet1,
  
  init(){
    this.ammo(
      Vars.content.getByName(ContentType.item, "diversetech-hyper-alloy"), bullet1
    );
    this.super$init();
  }
});

turret.buildType = () => extend(ItemTurret.ItemTurretBuild, turret, {});
