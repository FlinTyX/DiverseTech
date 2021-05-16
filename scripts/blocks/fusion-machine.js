const craftFx = new Effect(30, e => {
  for (let i = 0; i < 2; i++){
  Draw.color(i == 0 ? Color.valueOf("f2f2f2") : Color.valueOf("ffffff"));
  
  let h = e.finpow() * 22;
  let w = e.fout() * 10;
  Drawf.tri(i == 0 ? e.x + 9 : e.x - 9, e.y, w, h, i == 0 ? 0 : 180);
  Drawf.tri(e.x, i == 0 ? e.y - 9 : e.y + 9, w, h, i == 0 ? -90 : 90);
  }
}
                           
const fuMachine = extend(GenericCrafter, "fusion-machine", {
  craftEffect: craftFx
});
