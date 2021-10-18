function newLotus(obj){
    const bullet = extend(ContinuousLaserBulletType, {
        lifetime: 170,
        damage: 37,
        width: 0,
        length: 0,
        height: 27,
        shake: 0.8,

        colors: [Color.valueOf("ec745855"), Color.valueOf("ec7458aa"), Color.valueOf("ff9c5a"), Color.white],
        lotusLength: 30,
        lotusWidth: 7.6,
        amount: 3,
        rotvel: -2.2,
        spaceMag: 32,
        homingPower: 0.23, 
        homingRange: 95, 

        despawnfx: Fx.none,
        continuous: true,

        init(b){
            if(!b){
                this.despawnfx = new Effect(this.lifetime / 5, e => {
                    Draw.color(e.color, Color.valueOf("6e7080"), e.fin());
    
                    for(let i = 0; i < e.data.amount; i++){
                        
                        e.scaled(8 * (i * 0.6), i => {
                            Lines.stroke(2.5 * i.fout());
                            Lines.circle(i.x, i.y, 10 + (e.data.length * 2 + 10) * i.fin());
                        });

                        let angle = i * (360 / e.data.amount);
                        Drawf.tri(e.x, e.y, e.fout() * e.data.width - 0.2, (e.data.length / 1.6) + (e.data.length / 2 * e.fout()), angle + e.rotation);
                    }
                });
            } else b.fdata = b.rotation();
        },
        update(b){
            let target = Units.closestEnemy(b.team, b.x, b.y, this.homingRange, u => u.team != b.team);
            let s = !target ? 0 : this.homingPower;

            b.fdata = Time.time * this.rotvel;
            b.vel.set(s, s);
            if(target != null){
                b.rotation(b.angleTo(target.x, target.y));
            }

            if(b.timer.get(5)){
                for(let i = 0; i < this.amount; i++){
                    Damage.collideLine(b, b.team, this.hitEffect, b.x, b.y, b.fdata + i * (360 / this.amount), this.lotusLength, this.largeHit);
                }
            }

            if(this.shake > 0){
                Effect.shake(this.shake, this.shake, b);
            }
        },
        draw(b){
            let fout = Mathf.clamp(b.time > b.lifetime - this.fadeTime ? 1 - (b.time - (this.lifetime - this.fadeTime)) / this.fadeTime : 1);
            let width = this.lotusWidth * fout + Mathf.absin(Time.time, this.oscScl, this.oscMag);
            let realLength = Damage.findLaserLength(b, this.lotusLength);

            for(let h = 0; h < this.amount; h++){
                let angle = b.fdata + h * (360 / this.amount);

                Lines.lineAngle(b.x, b.y, angle, realLength);
                for(let s = 0; s < this.colors.length; s++){

                    Draw.color(Tmp.c1.set(this.colors[s]).mul(1 + Mathf.absin(Time.time, 1, 0.1)));

                    Draw.z(Layer.bullet + 5);
                    Fill.circle(b.x, b.y, 2 + width * this.tscales[s]);
                    Draw.z(Layer.bullet);

                    for(let i = 0; i < this.tscales.length; i++){
                        Tmp.v1.trns(angle, (this.lenscales[i] - 1) * this.spaceMag);
                        Lines.stroke(width * this.strokes[s] * this.tscales[i]);
                        Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, angle, realLength * this.lenscales[i], false);
                    }
                }
                Tmp.v1.trns(angle, realLength * 1.1);
                Drawf.light(b.team, b.x, b.y, b.x + Tmp.v1.x, b.y + Tmp.v1.y, this.lightStroke, this.lightColor, 0.7);
            }
            Draw.reset();
        },
        despawned(b){
            this.despawnfx.at(b.x, b.y, b.fdata, this.colors[this.colors.length - 2], {amount: this.amount, width: this.lotusWidth, length: this.lotusLength});
            Effect.shake(3, 3, b);
        }
    });
    return !obj ? bullet : Object.assign(bullet, obj);
}

function newArtillery(obj){
    const bullet = extend(ArtilleryBulletType, {
        lifetime: 80,
        damage: 0,
        speed: 1,
        width: 30,
        height: 30,

        fragBullet: Bullets.standardCopper,
        fragBullets: 1,

        frontColor: Pal.bulletYellow,
        backColor: Pal.bulletYellowBack,

        trailEffect: Fx.artilleryTrail,
        hitEffect: Fx.massiveExplosion,
        despawnEffect: Fx.blastExplosion,

        collides: false,
        hittable: false,
        absorbable: false,
        collidesTiles: false,
        makeFire: true,

        load(){
            this.super$load();
            this.sprite = Core.atlas.find("large-bomb");
            this.spriteBack = Core.atlas.find("large-bomb-back");
        },
        init(b){
            if(!b) return;
            b.fdata = b.rotation();
        },
        update(b){
            this.super$update(b);
            b.fdata = Time.time * (2 + Mathf.randomSeed(b.id, 1));
        },
        draw(b){
            let r = this.width * 0.5 + b.fin() / 2;

            Draw.z(Layer.bullet + 5);
            Draw.color(this.backColor);  
            Draw.rect(this.sprite, b.x, b.y, r, r, b.fdata);  
            Draw.color(this.frontColor);
            Draw.rect(this.spriteBack, b.x, b.y, r, r, b.fdata);  
            Draw.reset();
        },
        despawned(b){
            this.fragBullet.create(b, b.x, b.y, b.rotation());
        }
    });
    return !obj ? bullet : Object.assign(bullet, obj);
}

module.exports = {
    newArtillery : newArtillery,
    newLotus : newLotus
}