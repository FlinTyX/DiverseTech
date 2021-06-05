let spawned = false;

const dFx = new Effect(35, e => {
  Draw.color(Pal.lancerLaser);
  Lines.stroke(e.fout() * 2)
  Lines.circle(e.x, e.y, 5 + e.fin() * 20);
});

const sFx = new Effect(30, e => {
    Draw.color(Pal.lancerLaser);
    Lines.stroke(e.fout() * 2)
    Lines.circle(e.x, e.y, 5 + e.fin() * 30);
});

const hFx = new Effect(30, e => {
    Draw.color(Pal.lancerLaser);
    e.scaled(15, i => {
      Lines.stroke(3 * i.fout());
      Lines.circle(e.x, e.y, 4 + i.fin() * 35);
    });
});

const lightB = extend(LightningBulletType, {
    lightning: 2,
    lighningColor: Pal.lancerLaser,
    lightningLength: 7,
    lightningLengthRand: 3,
    lightningDamage: 9,
    lightningCone: 360,
    lightningAngle: 10,
    shootSound: Sounds.spark
});

const orb = extend(BasicBulletType, {
    damage: 52,
    speed: 1.2,
    drag: 0.005,
    lifetime: 115,
    width: 12,
    height: 12,
    shrinkY: 0.1,
    shrinkX: 0.1,
    sprite: "diversetech-orb",
    backColor: Color.valueOf("f3f3f3"),
    lightning: 0.2,
    collidesAir: true,
    collidesGround: true,
    hittable: false,
    hitShake: 1,
  
    //effects
    shootEffect: sFx,
    trailEffect: Fx.none,
    
    init(b){
      if(!b) return;
      spawned = true;
    },
    update(b){
      this.super$update(b);
      if(Mathf.chance(0.1)){
        lightB.create(b.owner, b.team, b.x, b.y, Mathf.range(360));
        if(Mathf.chance(0.2)) Effect.shake(2, 5, b.x, b.y);
        Sounds.spark.at(b.x, b.y);
      }
    },
    hit(b){
      hFx.at(b.x, b.y);
    },
    despawned(b){
      dFx.at(b.x, b.y);
      Effect.shake(3, 5, b.x, b.y);
      for(let i = 0; i < 5; i++){
        if(i < 3) Sounds.spark.at(b.x, b.y);
        lightB.create(b.owner, b.team, b.x, b.y, Mathf.range(360));
      }
    }
});

const conductor = extend(PowerTurret, "conductor", {
    shots: 1,
    range: 105,
    reloadTime: 160,
    recoilAmount: 2,
    shootCone: 6,
    inaccuracy: 3,
    rotateSpeed: 4,
    shootType: orb,
    powerUse: 6.5,
    boostMultiplier: 0.2,
    shootSound: Sounds.spark,
    shootLength: 5
});

conductor.buildType = () => extend(PowerTurret.PowerTurretBuild, conductor, {
    updateTile(){
        this.super$updateTile();
        if(spawned && this.power.status >= 1){
            for(let i = 0; i < 3; i++){
                lightB.create(
                    this, this.team, 
                    this.x + Angles.trnsx(this.rotation, this.block.shootLength + 1),
                    this.y + Angles.trnsy(this.rotation, this.block.shootLength + 1),
                    this.rotation + Mathf.range(15)
                );
            }
          spawned = false;
        }
    }
});
