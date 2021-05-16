const craftFx = new Effect(40, e => {
  Draw.color(Color.valueOf("6e7080"), Color.valueOf("f3f3f3"), Color.valueOf("ffffff"), e.fin());

  Draw.color(Color.valueOf("f3f3f3"));
  Angles.randLenVectors(e.id, 8, 2 + 30 * e.finpow(), (x, y) => {
    Fill.circle(e.x+x, e.y+y, e.fout() * 2 + 0.5);
  });
});

const quantumFo = extend(GenericCrafter, "quantum-former", {});
quantumFo.craftEffect = craftFx;

quantumFo.buildType = () => extend(GenericCrafter.GenericCrafterBuild, quantumFo, {});
