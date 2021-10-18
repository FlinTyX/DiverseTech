const orbitatingBullet = require("libs/bullets/orbitatingBullet");
const {ic} = require("libs/functions");

const equalization = extend(ItemTurret, "equalization", {
    shootSound: Sounds.bang,
    coolantMultiplier: 0.4,
    shootShake: 3,
    heatColor: Color.orange,
    recoilAmount: 8,

    init(){
        this.super$init();
        this.ammo(
            Items.thorium, orbitatingBullet(),
            ic("nitinol"), orbitatingBullet({
                damage: 49.6 * 6,
                trailColor: Color.valueOf("c4d8ff"),
                amount: 6,
                orbHeight: 22,
                orbWidth: 1,
                orbRadius: 10,
                orbMag: 3.93        
            }),
            Items.plastanium, orbitatingBullet({
                damage: 78.5 * 3,
                amount: 3,
                orbWidth: 1.4,
                trailColor: Pal.plastanium
            })
        );
    }
});
equalization.buildType = () => extend(ItemTurret.ItemTurretBuild, equalization, {});