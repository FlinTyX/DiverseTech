const craftFx = new Effect(35, e => {
  for (let i = 0; i < 2; i++){
  Draw.color(i == 0 ? Color.valueOf("f2f2f2") : Color.valueOf("ffffff"));
  
  let h = e.finpow() * 22;
  let w = e.fout() * 10;
  Drawf.tri(i == 0 ? e.x + 7 : e.x - 7, e.y, w, h, i == 0 ? 0 : 180);
  Drawf.tri(e.x, i == 0 ? e.y - 7 : e.y + 7, w, h, i == 0 ? -90 : 90);
    
  Draw.color(Color.valueOf("6e7080"), Color.valueOf("f3f3f3"), Color.valueOf("ffffff"), e.fin());

  e.scaled(7, i => {
    Lines.stroke(3 * i.fout());
    Lines.circle(e.x, e.y, 4 + i.fin() * 30);
  });

  Draw.color(Color.valueOf("f3f3f3"));
  Angles.randLenVectors(e.id, 8, 2 + 30 * e.finpow(), (x, y) => {
    Fill.circle(e.x+x, e.y+y, e.fout() * 2 + 0.5);
  });
  }
});

//it means fusion machine and not f*ck machine
const fuMachine = extend(GenericCrafter, "fusion-machine", {});
fuMachine.craftEffect = craftFx;

fuMachine.buildType = () => extend(GenericCrafter.GenericCrafterBuild, fuMachine, {});
