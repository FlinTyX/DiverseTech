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

let fragB1 = extend(BasicBulletType, {
  damage: 80,
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
  
  trailColor: Color.valueOf("ffc999"),
  trailWidth: 1.8,
  trailLenght: 16,

  //fx
  hitEffect: hitFx,
  despawnEffect: despawnFx,
});

let fragB2 = extend(BasicBulletType, {
  damage: 66.2,
  speed: 4.2,
  lifetime: 78,
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
  
  trailColor: Color.valueOf("ffc999"),
  trailWidth: 2,
  trailLenght: 14.5,

  //fx
  hitEffect: hitFx,
  despawnEffect: despawnFx,
});

let bullet1  = extend(BasicBulletType, {
  damage: 80,
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
  ejectEffect: Fx.casing2,
  
  fragVelocityMin : 0.7,
  
  //fx
  shootEffect: shootFx,
  fragBullet: fragB1
});

let bullet2 = extend(BasicBulletType, {
  damage: 66.2,
  speed: 6.8,
  lifetime: 123,
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
  ejectEffect: Fx.casing2,
  
  fragVelocityMin : 0.7,
  
  //fx
  shootEffect: shootFx,
  fragBullet: fragB1
});

const magma = extend(ItemTurret, "magma", {
  shots: 3,
  range: 240,
  reloadTime: 185,
  shootShake: 6,
  recoilAmount: 3,
  shootCone: 20,
  spread: 30,
  inaccuracy: 15,
  rotateSpeed: 3,
  coolantMultiplier: 0.2,
  coolantUsage: 2,
  shootType: bullet1,
  
  init(){
    this.ammo(
      Vars.content.getByName(ContentType.item, "diversetech-nitinol"), bullet2,
      Vars.content.getByName(ContentType.item, "diversetech-hyper-alloy"), bullet1
    );
    this.super$init();
  }
});

magma.buildType = () => extend(ItemTurret.ItemTurretBuild, magma, {});
