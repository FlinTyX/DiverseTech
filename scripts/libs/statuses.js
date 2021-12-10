const iceFx = new Effect(35, e => {
  Draw.color(Color.valueOf("f3f3f3"));
  Lines.stroke(0.6);
  Angles.randLenVectors(e.id, 10, 2 + 25 * e.finpow(), (x, y) => {
    Lines.spikes(e.x+x, e.y+y, e.fout() * 0.5, 0.5, 8);
  });
});

const ice = extend(StatusEffect, "ice", {
  damage: 0.2,
  speedMultiplier: 0.2,
  color: Color.white,
  effect: iceFx,
  transitionDamage: 2.8,
  show: true,

  init(){
    this.super$init();

    this.opposite(StatusEffects.melting, StatusEffects.burning);

    this.affinity(StatusEffects.blasted, ((unit, result, time) => {
      unit.damagePierce(this.transitionDamage);
    }));
  },
  load(){
    this.super$load();
    this.region = Core.atlas.find(this.name);
  },
  icons(){
    return this.region;
  },
  isHidden(){
    return false;
  }
});

//exports
module.exports = {
  ice : ice
}

