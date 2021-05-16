
//status effect Fx
const iceFx = new Effect(35, e => {
  Draw.color(Color.valueOf("f3f3f3"));
  Lines.stroke(0.6);
  Angles.randLenVectors(e.id, 10, 2 + 25 * e.finpow(), (x, y) => {
    Lines.spikes(e.x+x, e.y+y, e.fout() * 0.5, 0.5, 8);
  });
});

//charge effect
const cFx = new Effect(80, e => {
  Draw.color(Color.valueOf("ffffff"));

  Angles.randLenVectors(e.id, 20,1 + 100 * e.fout(), (x, y) => {
    Lines.spikes(e.x+x, e.y+y, 0.3, e.finpow() * 1.2, 8);
  });
      
  Angles.randLenVectors(e.id + 1, 12, 5 + 100 * e.fout(), (x, y) => {
    Lines.lineAngle(e.x + x, e.y + y, Mathf.angle(x, y), 1 + e.fslope() * 6);
  });
  
  for (let i = 0; i < 2; i++){
    Draw.color(i == 0 ? Color.valueOf("ffffff") : Color.valueOf("f4f4f4"));
    Fill.circle(e.x, e.y, i == 0 ? e.finpow() * 7 : e.finpow() * 4);
  }
});

//hit effect
const hFx = new Effect(30, e => {
  for (let i = 0; i < 2; i++){
  
    let h = 75;
    let w = e.fout() * 10;
 
    Draw.color(i == 0 ? Color.valueOf("ffffff") : Color.valueOf("f4f4f4"));
    Fill.circle(e.x, e.y, i == 0 ? w/2 : w/3);
    Drawf.tri(e.x, e.y, w, h + 5, i == 0 ? e.rotation + e.fin() * 40 : e.rotation - e.fin() * 40);
    Angles.randLenVectors(e.id, 5, 2 + 30 * e.finpow(), (x, y) => {
      Fill.circle(e.x+x, e.y+y, e.fout() * 1 + 0.5);
    });
  
    Lines.stroke(e.fout() * 2);
    Lines.circle(e.x, e.y, e.finpow() * 35);
  }
});

//shoot effect
const sFx = new Effect(40, e => {
  e.rotation = e.fin()*250;

  for (let i = 0; i < 2; i++){

  let m = i == 0 ? 1 : 0;
  let h = 20 + e.fin() * 35;
  let w = e.fslope() * 8;
  
  Drawf.tri(e.x, e.y, w, h + 5, i == 0 ? e.rotation + 90 : e.rotation - 90);
  Drawf.tri(e.x, e.y, w, h + 5, i == 0 ? e.rotation : e.rotation + 180);

  Draw.color(i == 0 ? Color.valueOf("ffffff") : Color.valueOf("f4f4f4"));
  Fill.circle(e.x, e.y, i == 0 ? e.fout() * 8 : e.fout() * 6);
  }
});


//status effect
const ice = extend(StatusEffect, "ice", {
  
});

ice.damage = 0.2;
ice.speedMultiplier = 0.05;
ice.color = Color.white;
ice.effect = iceFx;

//bullet
const mBullet = extend(PointBulletType, {
  damage: 500,
  speed: 400,
  status: ice,
  statusDuration: 60 * 8,
  buildingDamageMultiplier: 0.6,
  shootEffect: sFx,
  despawnEffect: Fx.none,
  hitEffect: hFx,
  trailEffect: Fx.none,
  trailSpacing: 15,
  hitShake: 6
});

//turret
const mist = extend(PowerTurret, "mist", {
  shootType: mBullet,
  shootShake: 6,
  chargeEffect: cFx,
  range: 400,
  shootCone: 2,
  reloadTime: 200,
  recoilAmount: 2,
  restitution: 0.01,
  cooldown: 0.01,
  coolantMultiplier: 2.5,
  shootSound: Sounds.railgun,
  shots: 1,
  rotateSpeed: 4.5
});

mist.buildType = () => extend(PowerTurret.PowerTurretBuild, mist, {});
