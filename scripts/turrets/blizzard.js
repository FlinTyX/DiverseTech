let statuses = require("libs/statuses");
let fc = require("libs/functions");

let rad = 80;
let spawned = false;

const sFx = new Effect(60, e => {
  Draw.color(Color.valueOf("f2f2f2"));
  Lines.stroke(e.fout() * 2.5);

  let f1 = 20 + e.fin() * 90;
  let f2 = e.fin() * 360;
  let h = 20 + e.fin() * 10;
  let w = e.fout() * 20;
  
  Lines.circle(e.x, e.y, f1);
  for(let i = 0; i < 2; i++){
    f2 = i == 0 ? f2 : f2 + 90;
    Drawf.tri(e.x + Angles.trnsx(f2, f1), e.y + Angles.trnsy(f2, f1), w, h, f2);
    Drawf.tri(e.x - Angles.trnsx(f2, f1), e.y - Angles.trnsy(f2, f1), w, -h, f2);
    Drawf.tri(e.x + Angles.trnsx(f2, f1), e.y + Angles.trnsy(f2, f1), w, -h, f2);
    Drawf.tri(e.x - Angles.trnsx(f2, f1), e.y - Angles.trnsy(f2, f1), w, h, f2);
  }
});

const randFx = new Effect(40, e => {
  Draw.z(Layer.turret + 0.002);
  Draw.color(Color.valueOf("f3f3f3"));
  Lines.stroke(0.5);
  let f = e.fout() * 2;
  Angles.randLenVectors(e.id, 12, 10 + 35 * e.finpow(), (x, y) => {
    Lines.spikes(e.x+x, e.y+y, f/3, f/2, 8);
  });
});

const tFx = new Effect(45, e => {
  for (let i = 0; i < 2; i++){
    Draw.color(i == 0 ? Color.valueOf("ffffff") : Color.valueOf("f4f4f4"));
  
    let m = i == 0 ? 1 : 0.5;
  
    let s = e.fout() * (55 + Mathf.randomSeedRange(e.id, 10));
    let rot = e.rotation + 180;
    let w = 14 * e.fout() * m;
  
    Drawf.light(e.x, e.y, 50 - e.finpow() * 10, Color.valueOf("222222"), e.fout() * 1.00);
    Drawf.tri(e.x, e.y, w, (s - 5) * m, rot + 33);
    Drawf.tri(e.x, e.y, w, (s - 5) * m, rot - 33);
    Drawf.tri(e.x, e.y, w, e.fout() * 50 * m, rot);
    Drawf.tri(e.x, e.y, w, e.fout() * 21 * m, rot - 180);
  }
});

//big effect
const c = new Effect(60 * 5, e => {
  let cRad = (rad + 5) - e.fin() * 15;
  let alpha = 0.2 - e.fin() * 0.2;
  Draw.z(Layer.flyingUnit - 1);
  Draw.color(Pal.lightOrange, Color.valueOf("f6f6f6"), Color.lightGray, e.fin());

  Angles.randLenVectors(e.id, 8, 30 + e.fin() * 1 + rad * e.finpow(), (x, y) => {
    Draw.color(Color.valueOf("f6f6f6"), Color.gray, e.finpow());
    let a = 5 + e.fin() * 10; 
    Draw.alpha(e.fout() * 1.00);

    Drawf.light(e.x+x, e.y+y, a + e.finpow() * 40, Color.gray, alpha);
    Drawf.light(e.x+x, e.y+y, a + 5, Color.lightGray, e.fout() * 1.00);
    Fill.circle(e.x+x, e.y+y, a);
    Fill.circle(e.x-x, e.y-y, e.fout() * 15);
  });

  Draw.color(Color.valueOf("f6f6f6"));
  Draw.z(Layer.flyingUnit);
  Drawf.light(e.x, e.y, rad + 35 * e.fout(), Pal.lighterOrange, e.fout() * 1.00);
  Drawf.light(e.x, e.y, rad/2 + e.finpow() * rad, Color.lightGray, e.fslope() * 10);

  Lines.stroke(e.fout() * 3);
  Lines.circle(e.x, e.y, cRad);

  Draw.color(Color.valueOf("f0f0ff"));
  Lines.stroke(e.fout() * 1);
  Draw.alpha(alpha);
  Fill.circle(e.x, e.y, cRad - e.fin() * 25);

  let rand = Mathf.range(180);
  let x = e.x + Angles.trnsy(rand, Mathf.range(cRad));
  let y = e.y + Angles.trnsy(rand, Mathf.range(cRad));
  if(!Vars.state.isPaused() && Mathf.chance(0.5)) statuses.ice.effect.at(x, y);

  e.scaled(25, i => {
    Lines.stroke(3 * i.fout());
    Lines.circle(e.x, e.y, 30 + i.fin() * 70);
  });
});

const bullet1 = extend(PointBulletType, {
  hitEffect: Fx.none,
  trailEffect: tFx,
  shootEffect: Fx.none,
  despawnEffect: Fx.none,
  smokeEffect: Fx.smokeCloud,
  trailSpacing: 62,
  damage: 1885,
  speed: 505,
  status: statuses.ice,
  statusDuration: 60 * 4,
  hitShake: 10,
  
  //not stolen from sh1p
  freeze(b){
      c.at(b.x, b.y);
      Units.nearbyEnemies(b.team, b.x - rad, b.y - rad, rad * 2, rad * 2, cons(u => {
        if(!u.isDead && u.team != b.team){
          if(u.within(b.x, b.y, rad + 8)) u.apply(statuses.ice, 900 - Mathf.dst(b.x, b.y, u.x, u.y)/180 * 900);
        }
      }));
  },
  despawned(b){
    this.super$despawned(b);
    this.freeze(b);
    spawned = true;
  }
});
  
const blizzard = extend(PowerTurret, "blizzard", {
  shootType: bullet1,
  range: 500,
  shots: 1,
  shootCone: 2.3,
  inaccuracy: 8,
  shootSound: Sounds.railgun,
  reloadTime: 418,
  rotateSpeed: 2,
  shootShake: 10,
  recoilAmount: 12,
  coolantMultiplier: 0.3,
  coolantUsage: 3.3,
  restitution: 0.008,
  cooldown: 0.03,
  shootLength: 55,
  heatColor: Color.orange,
});

blizzard.buildType = () => extend(PowerTurret.PowerTurretBuild, blizzard, {
    setVars(){
      this.boost = 0.01;
      this.cH = 15, this.cW = this.cH/2;
      this.lightRad = 0;
      this.rot = Mathf.range(180), this.c = 0;
    },
    updateTile(){
      this.super$updateTile();
      if(!this.boost || !this.rot) this.setVars();
      this.cX = this.x + Angles.trnsx(this.rotation, this.block.shootLength/2 - this.recoil);
      this.cY = this.y + Angles.trnsy(this.rotation, this.block.shootLength/2 - this.recoil);

      //rotation
      this.rot = fc.plusRot(this.rot, Time.delta * (this.c + this.boost));

      //stuff
      this.c = Mathf.lerpDelta(this.c, 3.5 * this.power.status, 0.03);
      this.heat = Mathf.lerpDelta(this.heat, this.isShooting() && this.power.status == 1 ? spawned ? 1 : 1 : 0, 0.01);
      this.boost = Mathf.lerpDelta(this.boost, this.isShooting() && this.power.status == 1 ? 7 + spawned ? 2 : 1 : 0, 0.06);
      this.cH = Mathf.lerpDelta(this.cH, this.isShooting() && this.power.status == 1 ? 30 : 15, 0.05);

      if(spawned){
        this.cH = this.cH + Mathf.lerpDelta(this.cH, 15, 0.2), this.cW = this.cH/3.5;
        sFx.at(this.cX, this.cY);
        spawned = false;
      } else {
        this.cH = Mathf.lerpDelta(this.cH, 20, 0.05), this.cW = this.cH/2.5;
      }
    },
    draw(){
      this.super$draw();
      Draw.z(Layer.effect);
      if(!Vars.state.isPaused() && this.power.status >= 0.5){
        if(Mathf.chance(0.02) || spawned) randFx.at(this.cX, this.cY);
      }

      this.lightRad = Mathf.lerpDelta(
        this.lightRad,
        this.power.status >= 0.5 ? (rad + 20) * this.power.status : 0,
        this.power.status >= 0.5 ? 0.1 : 0.15
      );

      Drawf.light(this.team, this.x, this.y, this.lightRad, Color.valueOf("222222"), 0.6);
      Drawf.light(
        this.team,
        this.cX,
        this.cY,
        this.lightRad/3 + (20 * this.heat),
        Pal.accent,
        0.9
      );

      //effects
      Draw.color(Color.valueOf("f1f1f1"));
      Fill.circle(this.cX, this.cY, 3 + this.cW/4);
      for(let i = 0; i < 3; i++){
        let tR = 120 * i;
        Drawf.tri(this.cX, this.cY, this.cW, this.cH, this.rot + tR);
      }
      Draw.color(Color.white);
      Fill.circle(this.cX, this.cY, this.cW/5);
    }
});

blizzard.unitSort = (u, x, y) => -u.maxHealth + Mathf.dst2(u.x, u.y, x, y) / 6400;