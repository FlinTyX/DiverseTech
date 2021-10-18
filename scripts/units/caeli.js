const caeli = extend(UnitType, "caeli", {
    load(){
        this.propeller = Core.atlas.find(this.name + "-propeller");
        this.propellerOutline = Core.atlas.find(this.name + "-propeller-outline");
        this.super$load();
    },
    draw(unit){
        this.super$draw(unit);

        Tmp.v1.trns(unit.rotation - 90, 0, -2).add(unit.x, unit.y);
        Draw.z(Layer.flyingUnitLow - 0.002);

        Draw.rect(
            this.propeller,
            Tmp.v1.x,
            Tmp.v1.y,
            -Time.time * 8
        );
        Draw.rect(
            this.propellerOutline,
            Tmp.v1.x,
            Tmp.v1.y,
            -Time.time * 8
        );
        Drawf.shadow(
            this.propeller,
            Tmp.v1.x - (12.55 * unit.elevation),
            Tmp.v1.y - (12.55 * unit.elevation),
            -Time.time * 8
        );
        Draw.reset();
    }
});

caeli.constructor = () => extend(UnitEntity, {});