const trailedBullet = extend(BasicBulletType, {
    lifetime: 1,
    damage: 0,
    speed: 1,
    weaveMag: 3.5,
    weaveScale: 3,
    hitShake: 1,
    drag: -0.01,

    homingPower: 0.1,
    homingRange: 240,

    despawnEffect: Fx.blastExplosion,
    
    update(b){
        this.super$update(b);
        b.data.trail.update(b.x, b.y);
    },
    draw(b){
        b.data.trail.draw(b.data.trailColor, b.data.trailWidth + 0.1);
        this.super$draw(b);
    },
    removed(b){
        this.super$removed(b);
        Fx.trailFade.at(b.x, b.y, b.data.trailWidth, b.data.trailColor, b.data.trail.copy());
    }
});

function newOrbitatingBullet(obj){
    const bullet = extend(BasicBulletType, {
        sprite: "diversetech-orb",
        shrinkY: 0,
        shrinkX: 0,
        lifetime: 60 * 5,
        damage: 67.5 * 3, //stat only
        speed: 4.3,
        drag: 0.027,
        width: 8.8,
        height: 8.8,
        shake: 3,

        homingPower: 0.09, 
        homingRange: 95, 

        collides: false,
        absorbable: false,
        hittable: false,

        trailColor: Color.white,
        trailWidth: 2.2,
        trailLength: 8,
        fragLifetime: 100,
        despawnEffect: Fx.massiveExplosion,
        shootEffect: Fx.shootBigSmoke,
        
        amount: 3,
        orbHeight: 18,
        orbWidth: 1.1,
        orbRadius: 9.7,
        orbMag: 3.2,

        init(b){
            if(!b) return;
            b.data = [];
            for(let i = 0; i < this.amount; i++){
                b.data[i] = {
                    trail: new Trail(this.orbHeight),
                    vec2: new Vec2(),
                    rotation: i * (360 / this.amount),
                    angle: 0
                }
            }
        },
        update(b){
            this.super$update(b);
            b.data.forEach(o => {
                const mag = this.orbMag + b.data.indexOf(o) + (Math.PI * 2);
                const radius = this.orbRadius * b.fin(Interp.pow10Out);

                let rotation = 90 + o.rotation;
                let sin = Mathf.sin(Time.time, mag, radius / Math.PI);
                let cos = Mathf.cos(Time.time, mag, radius * Math.PI);
                let tan = Mathf.tan(Time.time, mag, cos / Math.PI);

                o.vec2.trns(rotation, cos, sin).add(b.x, b.y);
                o.trail.update(o.vec2.x, o.vec2.y);

                let angle = Angles.angle(o.vec2.x, o.vec2.y, o.vec2.x - tan * Math.PI, o.vec2.y + (cos / Math.PI)) + rotation;
                o.angle = angle;
            });
        },
        draw(b){
            this.super$draw(b);
            b.data.forEach(o => {
                Fill.circle(o.vec2.x, o.vec2.y, this.orbWidth * 1.85);
                o.trail.draw(this.trailColor, this.orbWidth);
            });
        },
        removed(b){
            this.super$removed(b);
            Effect.shake(this.shake, this.shake, b.x, b.y);
            b.data.forEach(o => {
                Fx.explosion.at(o.vec2.x, o.vec2.y);
                Fx.trailFade.at(o.vec2.x, o.vec2.y, this.trailWidth, this.trailColor, o.trail.copy());
                
                trailedBullet.create(
                    b, 
                    b.team, 
                    o.vec2.x, 
                    o.vec2.y,
                    o.angle,
                    b.damage / this.amount,
                    this.orbMag - 1.5,
                    this.fragLifetime,
                    {
                        trail: o.trail.copy(),
                        trailWidth: this.orbWidth,
                        trailColor: this.trailColor
                    }
                );
            });
        }
    });

    return !obj ? bullet : Object.assign(bullet, obj);
}

module.exports = newOrbitatingBullet;