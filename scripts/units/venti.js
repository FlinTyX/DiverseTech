let shootFx = new Effect(35, e => {
  Draw.color(Color.valueOf("e58956"));

  Drawf.tri(e.x, e.y, e.fout() * 10, e.fout() * 47, e.rotation);
  Drawf.tri(e.x, e.y, e.fout() * 10, -e.fout() * 11, e.rotation);
  
  Lines.stroke(0.6);
    Angles.randLenVectors(e.id, 8, 10 * e.finpow(), (x, y) => {
      for(let i = 0; i < 4; ++i){
        Drawf.tri(e.x+x, e.y+y, e.fout() * 2, e.fout () * 4, e.rotation + (90 * i) + e.fin() * 100);
      }
  });
  
  e.scaled(7, i => {
    Lines.stroke(3 * i.fout());
    Lines.circle(e.x, e.y, 4 + i.finpow() * 10);
  });
  
  Draw.color(Color.valueOf("e58956"), Color.valueOf("6e7080"), e.fin());
  Angles.randLenVectors(e.id + 10, 8, 10 * e.finpow(), (x, y) => {
    Fill.circle(e.x+x, e.y+y, e.fout() * 2);
  });
});

let shootFx2 = new Effect(35, e => {
  Draw.color(Color.valueOf("e58956"));

  Drawf.tri(e.x, e.y, e.fout() * 5, e.fout() * 17, e.rotation);
  Drawf.tri(e.x, e.y, e.fout() * 5, -e.fout() * 6, e.rotation);
})

let ventiLauncher = extend(Weapon, "diversetech-venti-launcher", {
    mirror: true,
    shootSound: Sounds.missile,
    shots: 3,
    spacing: 2,
    velocityRnd: 0.38,
    inaccuracy: 5.5,
    reload: 10,
    rotate: true,
    shake: 1.8,

    x: 22.3,
    y: 8,

    bullet: extend(MissileBulletType, {
      damage: 18.6,
      speed: 3,
      lifetime: 69,
      drag: -0.009,
      keepVelocity: false,
      width: 8,
      height: 8.3,

      splashDamageRadius: 24,
      splashDamage: 27.9,
      
      shootEffect: shootFx2,
      hitEffect: Fx.massiveExplosion,
      despawnEffect: Fx.blastExplosion,
      smokeEffect: Fx.shootBigSmoke,
  })
});

let ventiGun = extend(Weapon, "diversetech-venti-launcher", {
  mirror: true,
  shootSound: Sounds.missile,
  shots: 1,
  spacing: 3,
  velocityRnd: 0.5,
  inaccuracy: 2,
  reload: 20,
  rotate: true,
  shake: 2.1,
  ejectEffect: Fx.casing1,

  x: 8.8,
  y: 3.75,

  bullet: extend(BasicBulletType, {
    damage: 28.2,
    speed: 4.2,
    lifetime: 70,
    drag: 0.003,
    keepVelocity: false,
    width: 8.2,
    height: 9.5,
    splashDamageRadius: 11,
    splashDamage: 15,

    shootEffect: shootFx2,
    hitEffect: Fx.massiveExplosion,
    despawnEffect: Fx.blastExplosion,
    smokeEffect: Fx.shootBigSmoke
  })
});

let ventiCannon = extend(Weapon, "diversetech-venti-cannon", {
    mirror: false,
    shots: 1,
    inaccuracy: 3,
    reload: 80,
    rotate: true,
    rotateSpeed: 4,
    shake: 2,
    shootSound: Sounds.shootBig,
    ejectEffect: Fx.casing1,

    x: 0,
    y: -8.2,
    shootY: 9.1,

    bullet: extend(BasicBulletType, {
        damage: 52.8,
        speed: 5.1,
        lifetime: 70,
        drag: 0.003,
        keepVelocity: false,
        width: 10.1,
        height: 12,
        shrinkX: 0.2,
        
        shootEffect: shootFx,
        hitEffect: Fx.massiveExplosion,
        despawnEffect: Fx.blastExplosion,
        smokeEffect: Fx.shootBigSmoke,
    }),
});

const venti = extend(UnitType, "venti", {
  init(){
    this.weapons.add(ventiGun, ventiLauncher, ventiCannon)
    this.super$init();
  }
});
venti.constructor = () => extend(UnitEntity, {});
