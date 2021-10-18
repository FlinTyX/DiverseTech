let hitFx = new Effect(48, e => {
    Draw.color(Color.white);

    e.scaled(10, i => {
        Lines.stroke(2.2 * i.fout());
        Lines.circle(e.x, e.y, 4 + i.finpow() * 30);
    });

    for(let i = -1; i < 2; i++){
        Drawf.tri(e.x, e.y, 8 * e.fout(),  15 * e.finpow() + 35 * e.fin(), e.rotation + (30 - (5 * e.fin())) * i);
    }

    for(let i = 0; i < 3; i++){
        Drawf.tri(e.x, e.y, 7 * e.fout(), 15 * e.fout(), e.rotation * e.fin() + (360 / 3) * i + 180 * e.fout());
    }
});

let shootEffect2 = new Effect(20, e => {

    Draw.color(Color.lightGray, Color.gray, Pal.darkerGray, e.fin());
    Angles.randLenVectors(e.id, 5, 5 + 10 * e.fin(), e.rotation, 30, (x, y) => {
        Fill.circle(e.x + x, e.y + y, e.fout() * 1.5);
    });

    Draw.color(Pal.accent, Color.gray, e.fin());
    Angles.randLenVectors(e.id + 10, 5, 5 + 10 * e.fin(), e.rotation, 30, (x, y) => {
        Fill.circle(e.x + x, e.y + y, e.fout() * 1.5);
    });

    Draw.color(Color.white);
    Drawf.tri(e.x, e.y, 7 * e.fout(), 15, e.rotation);
    Drawf.tri(e.x, e.y, 7 * e.fout(), 5, e.rotation + 180);
});

let nitinolfx = new Effect(45, e => {

    for(let i = -1; i < 2; i++){

        let w = 4.2 * -e.fout();
        let h = 20 + (5 * e.fout())

        Draw.color(Color.white);
        Tmp.v1.trns(e.rotation + 90, (9.2 + (1 * e.finpow())) * i,  i == 0 ? -5 : -2.5).add(e.x, e.y);
        Drawf.tri(Tmp.v1.x, Tmp.v1.y, w, h, e.rotation - 14 * i);
        Drawf.tri(Tmp.v1.x, Tmp.v1.y, -w, -h / 2, e.rotation + 14 * i);

        Draw.color(Color.valueOf("f2f2f2"));
        Drawf.tri(Tmp.v1.x, Tmp.v1.y, w/1.8, h/2.2, e.rotation - 14 * i);
        Drawf.tri(Tmp.v1.x, Tmp.v1.y, -w/1.8, -h/2.2, e.rotation + 14 * i);

    }
});

let frag = extend(BasicBulletType, {
    damage: 0,
    speed: 3,
    drag: 0.03,
    lifetime: 30,
    width: 0,
    height: 0,
    trailWidth: 0,
    trailLength: 0,
    weaveMag: 0,
    weaveScale: 0,
    collidesAir: false,
    collidesGround: false,
    hittable: false,
    hitShake: 1,
    pierce: true,
    absorbable: false,

    init(b){
        if(!b) return;
        b.data = {
            t1: new Trail(30),
            t2: new Trail(30)
        }
    },
    update(b){
        this.super$update(b);
        this.a = Mathf.sin(3.5 + b.time * Mathf.PI, 3.5, 7 * b.fout());

        Tmp.v1.trns(b.rotation() + 90, this.a);
        Tmp.v2.trns(b.rotation() - 90, this.a);
        b.data.t1.update(b.x + Tmp.v1.x, b.y + Tmp.v1.y);
        b.data.t2.update(b.x + Tmp.v2.x, b.y + Tmp.v2.y);
    },
    draw(b){
        this.super$draw(b);
        b.data.t1.draw(Color.white, 1);
        b.data.t2.draw(Color.white, 1);
    },
    removed(b){
        this.super$removed(b);
        Fx.trailFade.at(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 1, Color.white, b.data.t1.copy());
        Fx.trailFade.at(b.x + Tmp.v2.x, b.y + Tmp.v2.y, 1, Color.white, b.data.t2.copy());
    }
});

let nitinol = extend(BasicBulletType, {
    damage: 79.8,
    drag: -0.0278,
    speed: 1.45,
    lifetime: 55,
    trailColor: Color.valueOf("c4d8ff"),
    trailWidth: 1,
    trailLength: 42,
    weaveMag: 0,
    weaveScale: 0,
    hitShake: 3,
    ammoMultiplier: 4,

    homingPower: 0.06,
    homingRange: 35,

    shootEffect: nitinolfx,
    hitEffect: hitFx,
    despawnEffect: hitFx,

    init(b){
        if(!b) return;
        b.data = {
            t1: new Trail(35),
            t2: new Trail(35)
        }
    },
    update(b){
        this.super$update(b);
        this.a = Mathf.sin(5.8 + b.time * Mathf.PI, 5.8, 11 * b.fout());

        Tmp.v1.trns(b.rotation() + 90, this.a);
        Tmp.v2.trns(b.rotation() - 90, this.a);
        b.data.t1.update(b.x + Tmp.v1.x, b.y + Tmp.v1.y);
        b.data.t2.update(b.x + Tmp.v2.x, b.y + Tmp.v2.y);
    },
    draw(b){
        this.super$draw(b);
        b.data.t1.draw(this.trailColor, 1);
        b.data.t2.draw(this.trailColor, 1);
    },
    removed(b){
        this.super$removed(b);
        Effect.shake(3, 5, b.x, b.y);
        Sounds.bang.at(b.x, b.y);
        Fx.trailFade.at(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 1, Color.white, b.data.t1.copy());
        Fx.trailFade.at(b.x + Tmp.v2.x, b.y + Tmp.v2.y, 1, Color.white, b.data.t2.copy());
    },
    hit(b, x, y){
        let r = (b.rotation() + 180) + Mathf.range(50);
        frag.create(b.owner, b.team, b.x, b.y, r);
        this.super$hit(b, b.x, b.y);
    }
});

let nickel = extend(BasicBulletType, {
    damage: 65.5,
    drag: -0.024,
    speed: 1.451,
    lifetime: 55,
    trailColor: Color.white,
    trailWidth: 1,
    trailLength: 40,
    weaveMag: 3,
    weaveScale: 6,
    hitShake: 3,
    ammoMultiplier: 2,

    shootEffect: shootEffect2,
    hitEffect: hitFx,
    despawnEffect: hitFx,

    init(b){
        if(!b) return;
        b.data = {
            t1: new Trail(35),
            t2: new Trail(35)
        }
    },
    update(b){
        this.super$update(b);
        this.a = Mathf.sin(Time.time, 3, 11 * b.fslope());

        Tmp.v1.trns(b.rotation() + 90, this.a);
        Tmp.v2.trns(b.rotation() - 90, this.a);
        b.data.t1.update(b.x + Tmp.v1.x, b.y + Tmp.v1.y);
        b.data.t2.update(b.x + Tmp.v2.x, b.y + Tmp.v2.y);
    },
    draw(b){
        this.super$draw(b);
        b.data.t1.draw(Color.white, 1);
        b.data.t2.draw(Color.white, 1);
    },
    removed(b){
        this.super$removed(b);
        Effect.shake(3, 5, b.x, b.y);
        Sounds.bang.at(b.x, b.y);
        Fx.trailFade.at(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 1, Color.white, b.data.t1.copy());
        Fx.trailFade.at(b.x + Tmp.v2.x, b.y + Tmp.v2.y, 1, Color.white, b.data.t2.copy());
    },
    hit(b, x, y){
        let r = (b.rotation() + 180) + Mathf.range(50);
        frag.create(b.owner, b.team, b.x, b.y, r);
        this.super$hit(b, b.x, b.y);
    }
});

let metaglass = extend(BasicBulletType, {
    damage: 68.8,
    drag: -0.03,
    speed: 1.35,
    lifetime: 55,
    trailColor: Color.white,
    trailWidth: 1,
    trailLength: 42,
    weaveMag: 0,
    weaveScale: 0,
    hitShake: 3,
    ammoMultiplier: 2.8,

    shootEffect: nitinolfx,
    hitEffect: hitFx,
    despawnEffect: hitFx,

    init(b){
        if(!b) return;
        b.data = {
            t1: new Trail(26),
            t2: new Trail(26)
        }
    },
    update(b){
        this.super$update(b);
        this.a = Mathf.sin(5.8 + b.time * Mathf.PI, 4.5, 11 * b.fout());

        Tmp.v1.trns(b.rotation() + 90, this.a);
        Tmp.v2.trns(b.rotation() - 90, this.a);
        b.data.t1.update(b.x + Tmp.v1.x, b.y + Tmp.v1.y);
        b.data.t2.update(b.x + Tmp.v2.x, b.y + Tmp.v2.y);
    },
    draw(b){
        this.super$draw(b);
        b.data.t1.draw(Color.white, 1);
        b.data.t2.draw(Color.white, 1);
    },
    removed(b){
        this.super$removed(b);
        Effect.shake(3, 5, b.x, b.y);
        Sounds.bang.at(b.x, b.y);
        Fx.trailFade.at(b.x + Tmp.v1.x, b.y + Tmp.v1.y, 1, Color.white, b.data.t1.copy());
        Fx.trailFade.at(b.x + Tmp.v2.x, b.y + Tmp.v2.y, 1, Color.white, b.data.t2.copy());
    },
    hit(b, x, y){
        for(let i = 0; i < 4; i++){
            let r = (b.rotation() + 180) + Mathf.range(50);
            frag.create(b.owner, b.team, b.x, b.y, r);
        }
        this.super$hit(b, b.x, b.y);
    }
});

let graphite = extend(BasicBulletType, {
    damage: 60.7,
    drag: -0.02,
    speed: 1.482,
    lifetime: 58,
    trailColor: Color.valueOf("e9ebff"),
    trailWidth: 1.3,
    trailLength: 17.5,
    weaveMag: 1.1,
    weaveScale: 3,
    hitShake: 3,
    reloadMultiplier: 0.8,
    ammoMultiplier: 2.6,

    shootEffect: shootEffect2,
    hitEffect: hitFx,
    despawnEffect: hitFx,

    draw(b){
        this.super$draw(b);
        Draw.color(this.trailColor);
        Draw.z(Layer.bullet - 0.0002);
        Drawf.tri(b.x, b.y, 7 * b.fout(), 25 - (5 * b.finpow()), b.rotation() + 180 + 30);
        Drawf.tri(b.x, b.y, 7 * b.fout(), 25 - (5 * b.finpow()), b.rotation() + 180 - 30);
    },
    removed(b){
        this.super$removed(b);
        Effect.shake(3, 5, b.x, b.y);
        Sounds.bang.at(b.x, b.y);
    },
    hit(b, x, y){
        for(let i = 0; i < 2; i++){
            let r = (b.rotation() + 180) + Mathf.range(50);
            frag.create(b.owner, b.team, b.x, b.y, r);
        }
        this.super$hit(b, b.x, b.y);
    }
});

const refraction = extend(ItemTurret, "refraction", {
    range: 167,
    reloadTime: 62,
    shots: 1,
    shootCone: 2,
    recoilAmount: 2.7,
    shootShake: 3,
    ammoUseEffect: Fx.casing2,
    coolantMultiplier: 0.24,
    coolantUsage: 3,
    heatColor: Color.valueOf("ab3400ff"),

    load(){
        this.super$load();
        this.barrelRegion = Core.atlas.find(this.name + "-barrel");
        this.barrelHeat = Core.atlas.find(this.name + "-barrel-heat");
        this.barrelOutline = Core.atlas.find(this.name + "-barrel-outline");
        this.bodyRegion = Core.atlas.find(this.name + "-body");
        this.bodyHeat = Core.atlas.find(this.name + "-body-heat");
        this.bodyOutline = Core.atlas.find(this.name + "-body-outline");
    },
    init(){
        this.ammo(
            Items.metaglass, metaglass,
            Items.graphite, graphite,
            Vars.content.getByName(ContentType.item, "diversetech-nickel"), nickel,
            Vars.content.getByName(ContentType.item, "diversetech-nitinol"), nitinol
        )
        this.super$init();
    }
});

refraction.buildType = () => extend(ItemTurret.ItemTurretBuild, refraction, {
    recoilb: 0,

    draw(){
        Draw.rect(refraction.baseRegion, this.x, this.y);
        Draw.z(Layer.turret);

        refraction.tr2.trns(this.rotation, -this.recoil);
        Tmp.v1.trns(this.rotation, -this.recoil);
        Tmp.v2.trns(this.rotation, -this.recoilb);

        Draw.rect(refraction.bodyOutline, this.x + Tmp.v1.x, this.y + Tmp.v1.y, this.rotation - 90);
        Draw.rect(refraction.barrelOutline, this.x + Tmp.v2.x, this.y + Tmp.v2.y, this.rotation - 90);

        Draw.rect(refraction.barrelRegion, this.x + Tmp.v2.x, this.y + Tmp.v2.y, this.rotation - 90);
        Draw.rect(refraction.bodyRegion, this.x + Tmp.v1.x, this.y + Tmp.v1.y, this.rotation - 90);

        Draw.blend(Blending.additive);
        Draw.color(this.block.heatColor);
        Draw.alpha(this.heat);
        Draw.rect(refraction.barrelHeat, this.x + Tmp.v2.x, this.y + Tmp.v2.y, this.rotation - 90);
        Draw.rect(refraction.bodyHeat, this.x + Tmp.v1.x, this.y + Tmp.v1.y, this. rotation - 90);

        Draw.blend();
        Draw.reset();
        Draw.color();
    },
    updateTile(){
        this.super$updateTile();
        this.recoilb = Mathf.lerpDelta(this.recoilb, -0.005, 0.04 * this.delta());
    },
    shoot(type){
        this.super$shoot(type);
        Sounds.explosion.at(this.x + refraction.tr2.x, this.y + refraction.tr2.y);
        Sounds.bang.at(this.x + refraction.tr2.x, this.y + refraction.tr2.y);
        this.recoilb = 6;
    },
    write(writes){
        this.super$write(writes);
        writes.f(this.recoilb);
    },
    read(reads){
        this.super$read(reads);
        this.recoilb = reads.f();
    }
});