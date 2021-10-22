const repairOrb = extend(BasicBulletType, {
    width: 25,
    height: 25,
    speed: 0.5,
    lifetime: 60 * 8,
    targetRange: 90,
    healAmount: 3.4,
    drag: 1,
    sprite: "large-bomb",
    backColor: Pal.heal,
    weaveScale: 90,
    weaveMag: 10,
    shrinkY: 0,

    collidesAir: false,
    collidesGround: false,
    hittable: false,
    pierce: true,
    absorbable: false,
    despawnEffect: Fx.heal,

    load(){
        this.super$load();
        this.laser = Core.atlas.find("laser");
        this.laserEnd = Core.atlas.find("laser-end");
        this.frontR = Core.atlas.find("large-bomb");
        this.backR = Core.atlas.find("large-bomb-back");
    },
    createStats(owner, team, x, y, rotation, plus){
        this.multipliedHeal = this.healAmount + plus;
        this.create(owner, team, x, y, rotation);
    },
    drawHeal(b, unit, mag, color){
        let rad = 4.5 + Mathf.absin(Time.time, 12, mag);
        let rand1 = Mathf.absin(Time.time + 48, 12, 3.5), x = unit.x + 2 - rand1;
        let rand2 = Mathf.absin(Time.time + 48, 12 + 2, 3.5), y = unit.y + 2 - rand2;

        Draw.color(color);
        Draw.z(Layer.flyingUnit + 1);
        Draw.alpha(mag == 0 ? 0.7 : 0.6 + Mathf.absin(Time.time, 12, mag/4));
        Drawf.laser(
            b.team,
            this.laser,
            this.laserEnd,
            b.x - 1 + rand1/2,
            b.y - 1 + rand2/2,
            x, y, 0.35 + rad/12
        );
        Draw.alpha(mag == 0 ? 0.7 : 1 - Mathf.absin(Time.time, 12, mag/4));
        Fill.circle(x, y, rad);
        Draw.z(Layer.flyingUnit + 1.1);
        Draw.color(Color.white);
        Fill.circle(x, y, rad/2);
    },
    init(b){
        if(!b) return;
        b.data = {
            length: Mathf.random(30),
            rotation: (b.fin() * b.type.lifetime + Time.time + Mathf.random(5)) * Math.PI,
        }
    },
    update(b){
        let target = Units.closest(b.team, b.x, b.y, this.targetRange, u => u.team == b.team);
        if(target != null){
            let x = target.x + Angles.trnsx(b.data.rotation, 20 + b.data.length);
            let y = target.y + Angles.trnsy(b.data.rotation, 20 + b.data.length);

            //vertical and horizontal speed control based on target's position
            let dst = Mathf.dst(b.x, b.y, x, y)/12;
            b.vel.set(dst, dst);
            b.rotation(b.angleTo(x, y));
        }
    },
    draw(b){
        let pulse = ((this.width + this.height)/2) + Mathf.absin(Time.time, 8, 6);

        Draw.z(Layer.flyingUnit + 1.2);
        Draw.color(this.backColor);
        Draw.rect(this.backR, b.x, b.y, pulse, pulse, b.rotation() + (Time.time * 2) + pulse/2);
        Draw.z(Layer.flyingUnit + 1.4);
        Draw.color(Pal.bulletYellow);
        Draw.rect(this.frontR, b.x, b.y, pulse + 0.5, pulse + 0.5, b.rotation() - (Time.time * 2));

        Groups.unit.each(e => {
            if(e.within(b.x, b.y, this.targetRange) && e.team == b.team){
                this.drawHeal(b, e, e.damaged() ? 2 : 0, e.damaged() ? Color.valueOf("8fffa9") : Pal.plastanium);
                if(!Vars.state.isPaused()) e.heal(this.multipliedHeal * Time.delta);  
            };
        });
    }
});

const rc = extend(Block, "repairCenter", {
    liquidCapacity: 25,
    reloadTime: 280,
    canOverdrive: false,
    range: 90,

    load(){
        this.super$load();
        this.blendRegion = Core.atlas.find(this.name + "-blend");
    },
    setStats(){
        this.super$setStats();
        this.stats.add(Stat.reload, "0.2");
        this.stats.add(Stat.range, this.range);
    },
    drawPlace(x, y, rotation, valid){
        this.super$drawPlace(x, y, rotation, valid);
        Drawf.dashCircle((x * 8) + this.offset, (y * 8) + this.offset, this.range, Pal.placing);
    }
});

rc.buildType = () => extend(Building, {
    updateTile(){
        this.super$updateTile();

        this.multiplier = (this.liquids.get(Liquids.cryofluid)/(this.block.liquidCapacity/2)) * this.power.status;
        this.shootTimer = this.shootTimer == undefined || this.shootTimer > (rc.reloadTime - (20 * this.multiplier)) ? 0 : this.shootTimer += Time.delta;

        if(this.power.status == 1 && this.shootTimer > (rc.reloadTime - (20 * this.multiplier))){
            repairOrb.createStats(this, this.team, this.x, this.y, 90, this.multiplier - 1);
            spawn.at(this.x, this.y);
            Fx.heal.at(this.x, this.y);
        }
    },
    draw(){
        this.super$draw();
        Draw.z(Layer.effect);
        if(this.power.status >= 0.1){
            let s = (32 * 5)/8;
            let pulse = Mathf.absin(Time.time, 20, 6) * this.power.status;

            Draw.color(Pal.heal);
            Lines.stroke(-pulse/5);
            Draw.alpha(this.power.status);
            Lines.square(this.x, this.y, s - pulse, (Time.time + pulse * 2));
            Lines.square(this.x, this.y, s + pulse, (-Time.time - pulse * 2.5 ));
        }
    },
    drawSelect(){
        Drawf.dashCircle(this.x, this.y, rc.range, this.team.color);
    }
});

const spawn = new Effect(52, e => {
    let s = (32 * 5)/8;
    Draw.color(Pal.heal);
    Draw.alpha(1 * e.fout());
    Lines.stroke(1 * e.fout());
    Lines.square(e.x, e.y, s);

    Draw.color(Pal.heal);
    Draw.blend(Blending.additive);
    Draw.alpha(0.9 - (0.9 * e.finpow()));
    Draw.rect(rc.blendRegion, e.x, e.y);
    Draw.blend();
    Draw.reset();
});
