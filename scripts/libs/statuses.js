const iceFx = new Effect(35, e => {
  Draw.color(Color.valueOf("f3f3f3"));
  Lines.stroke(0.6);
  Angles.randLenVectors(e.id, 10, 2 + 25 * e.finpow(), (x, y) => {
    Lines.spikes(e.x+x, e.y+y, e.fout() * 0.5, 0.5, 8);
  });
});

const ice = extend(StatusEffect, "ice", {
  damage: 0.2,
  speedMultiplier: 0.1,
  color: Color.white,
  effect: iceFx,
});

//exports
module.exports = {
  ice : ice
};
