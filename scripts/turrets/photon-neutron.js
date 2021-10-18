const {ic} = require("libs/functions");

function newTrailed(obj){
    const bullet = extend(BasicBulletType, {
        sprite: Core.atlas.find("diversetech-orb"),
        damage: 0,
        speed: 2.6,
        width: 4,
        height: 4,
        lifetime: 65,
        hitShake: 1,
        drag: -0.003,
        shrinkY: 0,
        shrinkX: 0,

        hitEffect:  Fx.flakExplosion,
        despawnEffect: Fx.explosion,
        shootEffect: Fx.shootSmallSmoke,

        frontColor: Pal.bulletYellow,
        backColor: Pal.bulletYellowBack,

        trailColor: Color.white,
        trailLength: 0,
        trailWidth: 1
    });

    return !obj ? bullet : Object.assign(bullet, obj);
}

//photon
const photon = extend(ItemTurret, "photon", {});
photon.buildType = () => extend(ItemTurret.ItemTurretBuild, photon, {});

//neutron
const neutron = extend(ItemTurret, "neutron", {
    heatColor: Color.orange,
    init(){
        this.ammo(
            Items.graphite, newTrailed({
                damage: 13.6,
                reloadMultiplier: 0.85,
                ammoMultiplier: 2.6,
                
                backColor: Color.white,
                frontColor: Color.valueOf("e9ebff"),

                trailColor: Color.valueOf("e9ebff"),
                trailLength: 20
            }),
            ic("nickel"), newTrailed({
                damage: 14.3,
                reloadMultiplier: 0.8,
                
                backColor: Color.white,
                frontColor: Color.valueOf("f2f2f2"),

                trailLength: 16.2
            }),
            Items.metaglass, newTrailed({
                damage: 13.6,
                
                splashDamage: 22,
                splashDamageRadius: 19.5,
                fragBullets: 4,
                fragBullet: Bullets.flakGlassFrag,

                trailLength: 12.3
            })
        )
        this.super$init();
    }
});

neutron.buildType = () => extend(ItemTurret.ItemTurretBuild, neutron, {});