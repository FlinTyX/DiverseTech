let craftFx = new Effect(38, e => {
  if(e.time - Time.delta == 0 && !Vars.state.isPaused()){

    let r = Math.random()/1.5;

    Effect.shake(3.3, 7, e.x, e.y);
    Fx.blastExplosion.at(e.x, e.y);
    Sounds.bang.at(e.x, e.y, 0, r);
  }

  for (let i = 0; i < 8; i++){
    Draw.color(i > 4 ? Color.valueOf("f1f1f1") : Color.valueOf("ffffff"));
    Tmp.v1.trns(90 * i, 6.8).add(e.x, e.y);
    
    let h = e.finpow() * 22;
    let w = e.fout() * 10;
    Drawf.tri(Tmp.v1.x, Tmp.v1.y, w, h, 90 * i);
    Drawf.tri(Tmp.v1.x, Tmp.v1.y, w - 2, h/2, 90 * i);

    Draw.color(Pal.meltdownHit, Color.gray, e.fin());
    Angles.randLenVectors(e.id + (i * 10), 6, 5 + 15 * e.finpow(), i * 90, 30, (x, y) => {
      Fill.circle(Tmp.v1.x + x, Tmp.v1.y + y, e.fout() * 1.8);
    });
  }

  Draw.color(Color.valueOf("6e7080"), Color.valueOf("f3f3f3"), Color.valueOf("ffffff"), e.fin());

  e.scaled(7, i => {
    Lines.stroke(3 * i.fout());
    Lines.circle(e.x, e.y, 4 + i.fin() * 30);
  });

  Draw.color(Color.valueOf("f3f3f3"));
  Angles.randLenVectors(e.id, 8, 2 + 30 * e.finpow(), (x, y) => {
    Fill.circle(e.x+x, e.y+y, e.fout() * 2 + 0.5);
  });
});

const fusionMachine = extend(GenericCrafter, "fusion-machine", {
  craftEffect: craftFx,

  load(){
    this.heat = Core.atlas.find(this.name + "-heat");
    this.super$load();
  }
});

fusionMachine.buildType = () => extend(GenericCrafter.GenericCrafterBuild, fusionMachine, {
  warm2: 0,

  validl(){
    return this.progress >= 0.972 && this.power.status > 0;
  },
  updateTile(){
    this.super$updateTile();
    if(Vars.state.isPaused()) return;

    if(this.validl()){
      this.warm2 = 1.2;
    } else {
      this.warm2 = Mathf.lerpDelta(this.warm2, 0, 0.029);
    }
  },
  draw(){
    this.super$draw();
    Draw.color(Pal.meltdownHit);
    Draw.alpha(this.warm2);
    Draw.blend(Blending.additive);
    Draw.rect(fusionMachine.heat, this.x, this.y);
    Draw.blend();
    Draw.reset();
  }
});
