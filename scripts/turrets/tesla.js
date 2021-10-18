let {ic} = require("libs/functions");
let ams = loadSound("sparks-ambient");

function chargeEffect(range, colorFrom, colorTo){
    return new Effect(range * 2, e => {
        Draw.z(Layer.bullet + 10.001);
        Lines.stroke(e.fout() * 4);
        Draw.color(colorFrom, colorTo, e.fin());
        Lines.circle(e.x, e.y, e.fin() * range);
    });
};

let t1 = new Effect(95, e => {
    let rad = 96/2;
    Draw.z(Layer.bullet + 10);
    Lines.stroke(e.fout() * 4);
    Draw.color(Pal.lancerLaser, Color.purple, e.fin());
    Lines.circle(e.x, e.y, e.fin() * rad);
});

let t4 = new Effect(120, e => {
    let rad = 15 * 6;
    Draw.z(Layer.bullet + 10);
    Lines.stroke(e.fout() * 4);
    Draw.color(Pal.lancerLaser, Color.purple, e.fin());
    Lines.circle(e.x, e.y, e.fin() * rad);
});

const newTesla = (name, obj) => {
    const tesla = extend(Block, name, {
        size: 3,
        health: 1090,
        update: true,
        solid: true, 
        category: Category.turret,
        buildVisibility: BuildVisibility.shown,
        canOverdrive: false,
        ambientSound: ams,

        inEditor: true,
        hasItems: false,
        hasLiquids: false,

        nodeRequirements: ItemStack.with(
            Items.copper, 3140,
            Items.lead, 2805,
            Items.silicon, 2800,
        ),
        requirements: ItemStack.with(
            Items.copper, 300,
            Items.lead, 300,
            Items.silicon, 260
        ),

        research: "diversetech-overvoltage",
        amount: 2,
        powerUse: 19.5,
        damage: 7.2,
        range: 60,
        alpha: 0.088,
        stroke: 1.9,

        colorFrom: Pal.lancerLaser,
        colorTo: Color.purple,
        lineColor: Color.purple,
        color: Color.purple,
        lightColor: Pal.spore,
        colours: [Pal.spore, Color.purple, Pal.lancerLaser],
        midColors: [Pal.spore, Color.purple, Pal.lancerLaser],

        init(){
            this.super$init();
            TechTree.TechNode(TechTree.get(Vars.content.getByName(ContentType.block, this.research)), this, this.nodeRequirements);
            
            this.charge = chargeEffect(
                this.range,
                this.colorFrom,
                this.colorTo
            );
        },
        setStats(){
            this.super$setStats();
            this.stats.add(Stat.damage, this.damage * (this.amount * 2) * 60);
            this.stats.add(Stat.reload, true);
            this.stats.add(Stat.range, this.range);
        },
        drawPlace(x, y, rotation, valid){
            this.super$drawPlace(x, y, rotation, valid);
            Drawf.dashCircle((x * 8) + this.offset, (y * 8) + this.offset, this.range - Mathf.sin(Time.time, 15, 0.2), Pal.placing);
        }
    });
    !obj ? null : Object.assign(tesla, obj);
    tesla.consumes.power(tesla.powerUse);

    tesla.buildType = () => extend(Building, {
        timerFx: 0,
        
        createSpark(team, id, x, y, damage, lenght, colours, multiplier, amount, chance){
            if(!Mathf.chanceDelta(chance)) return;
            for(let i = 0; i < Mathf.floor(amount * Time.delta); i++){
                let color = !colours[i] ? colours[0] : colours[i];
                let m = !multiplier[i] ? 1 : multiplier[i];
                Lightning.create(team, color, damage, x, y, (Time.time * Mathf.randomSeed(id + i, 6 * m)), lenght / 6);
            }
        },
        drawCircle(x, y, radius, alpha, linecolor, color, midcolor, mag, pulseAmount, multiplier){
            let h = Mathf.absin(mag, pulseAmount/4);
            let radius2 = radius * multiplier;

            Draw.z(Layer.light);
            Draw.color(color);
            Draw.alpha(alpha);
            Fill.poly(x, y, Lines.circleVertices(radius), radius);

            Draw.z(Layer.effect + 0.001);
            Draw.color(linecolor);
            Lines.stroke((tesla.stroke + Mathf.absin(Time.time, 5, tesla.stroke/3)) * multiplier);
            Lines.poly(x, y, Lines.circleVertices(radius), radius);

            Draw.z(Layer.effect);
            Draw.color(midcolor[0]);
            Draw.alpha(0.3);
            Fill.poly(x, y, Lines.circleVertices(radius/4), radius/4 - Mathf.absin(Time.time, mag, pulseAmount));

            Draw.color(midcolor[1]);
            Draw.alpha(0.6);
            Fill.poly(x, y, Lines.circleVertices(radius2/10 + h), radius2/10 + h);

            Draw.color(midcolor[2]);
            Draw.alpha(1);
            Fill.poly(x, y, Lines.circleVertices(radius2/12 + h), radius2/12 + h);

            Draw.color(Color.white);
            Fill.poly(x, y, Lines.circleVertices(radius2/16 + h), radius2/16 + h);
        },
        updateTile(){
            this.super$updateTile();
            if(this.power.status == 0) return;

            this.timerFx > tesla.range * 2.15 ? this.timerFx = 0 : this.timerFx += Time.delta;
            this.createSpark(this.team, this.id, this.x, this.y, tesla.damage * this.power.status, tesla.range, tesla.colours, [1, 1, -1, -1], tesla.amount, this.power.status);
            if(this.timerFx > tesla.range * 2.15 && Mathf.chanceDelta(this.power.status)) tesla.charge.at(this.x, this.y);
        },
        draw(){
            this.super$draw();
            if(this.power.status == 0) return;
            this.drawCircle(this.x, this.y, tesla.range, tesla.alpha * this.power.status, tesla.lineColor, tesla.color, tesla.midColors, 6, 8, this.power.status);
            
            //light
            Drawf.light(this.team, this.x, this.y, tesla.range * 1.5, Pal.accent, this.power.status);
            Drawf.light(this.team, this.x, this.y, tesla.range/2, Pal.lancerLaser, 0.6 * this.power.status);
            Drawf.light(this.team, this.x, this.y, tesla.range/2 - 20, tesla.lightColor, this.power.status);
            Draw.reset();
        },
        drawSelect(){
            Drawf.dashCircle(this.x, this.y, tesla.range - Mathf.sin(Time.time, 15, 0.2), this.team.color);
        }
    });
};

//teslas
newTesla("tesla-markg1", {
    health: 910,
    colorFrom: Pal.plastanium,
    colorTo: Pal.heal,
    lineColor: Pal.heal,
    color: Pal.plastanium,
    lightColor: Pal.plastaniumBack,
    colours: [Pal.plastaniumBack, Pal.plastanium, Pal.heal],
    midColors: [Pal.heal, Pal.plastanium, Pal.plastaniumBack],
});

newTesla("tesla-markp1", {
    health: 950,
    damage: 9.2,
    powerUse: 24.2,

    requirements: ItemStack.with(
        Items.copper, 380,
        Items.lead, 275,
        Items.titanium, 200,
        Items.silicon, 300
    ),
    nodeRequirements: ItemStack.with(
        Items.copper, 4800,
        Items.lead, 3990,
        Items.titanium, 3100,
        Items.silicon, 3895
    ),
    research: "diversetech-tesla-markg1"
});

newTesla("tesla-markg2", {
    health: 1560,
    damage: 15.3,
    powerUse: 32,
    range: 75,
    size: 4,

    requirements: ItemStack.with(
        Items.copper, 500,
        Items.lead, 490,
        Items.silicon, 535,
        Items.titanium, 445,
    ),
    nodeRequirements: ItemStack.with(
        Items.copper, 5820,
        Items.lead, 5050,
        Items.silicon, 5880,
        Items.titanium, 4680,
    ),
    research: "diversetech-tesla-markg1",

    colorFrom: Pal.plastanium,
    colorTo: Pal.heal,
    lineColor: Pal.heal,
    color: Pal.plastanium,
    lightColor: Pal.plastaniumBack,
    colours: [Pal.plastaniumBack, Pal.plastanium, Pal.heal],
    midColors: [Pal.heal, Pal.plastanium, Pal.plastaniumBack],
});

newTesla("tesla-markp2", {
    health: 1650,
    damage: 18.6,
    powerUse: 39.5,
    range: 75,
    size: 4,

    requirements: ItemStack.with(
        Items.copper, 600,
        Items.lead, 550,
        Items.silicon, 560,
        Items.plastanium, 380
    ),
    nodeRequirements: ItemStack.with(
        Items.copper, 6300,
        Items.lead, 5850,
        Items.silicon, 5360,
        Items.plastanium, 3880    
    ),
    research: "diversetech-tesla-markp1"
});

newTesla("tesla-tower", {
    health: 4600,
    size: 6,
    charge: t4,
    range: 15 * 6,
    powerUse: 175,
    damage: 31,
    stroke: 2,
    research: "diversetech-tesla-markp2",
    requirements: ItemStack.with(
        Items.lead, 2880,
        Items.silicon, 2900,
        Items.titanium, 3480,
        ic("hyper-alloy"), 1310,
        Items.phaseFabric, 940
    ),
    nodeRequirements: ItemStack.with(
        Items.lead, 28880,
        Items.silicon, 32200,
        Items.titanium, 23400,
        ic("hyper-alloy"), 15610,
        Items.phaseFabric, 19900
    )
});