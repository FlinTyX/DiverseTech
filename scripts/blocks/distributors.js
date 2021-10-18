const {ic} = require("libs/functions");

const valid = (block) => {
    return block.consumes.any() && !block.drillTime && (
    
    block.consumes.has(ConsumeType.item) && (block.upgrades != null || block.plans != null || block.craftTime != null) || 
    (block.consumes.has(ConsumeType.item) || block.itemDuration != null) ||
    block.ammo != null && block.hasItems

    );
}

const getConsume = (build, cons) => {
    const consumes = build.block.consumes;

    if(consumes.has(ConsumeType.item)){

        //power blocks
        if(build.block.outputsPower){
            if(consumes.get(ConsumeType.item).filter != null){
                for(let i = 0; i < Vars.content.items().size; i++){
                    if(consumes.get(ConsumeType.item).filter.get(Vars.content.items().get(i))){
                        cons.get(new ItemStack(Vars.content.items().get(i), 1))
                    };  
                }
            } else {
                cons.get(consumes.get(ConsumeType.item).items[0]);
            }
            return;
        }

        //turrets
        if(build.block.ammo != null){
            cons.get(this);
            return;
        }

        //unit factories
        if(build.block.plans != null){
            consumes.get(ConsumeType.item).items.get(build).forEach(i => cons.get(i));
            return;
        }

        //factories
        consumes.get(ConsumeType.item).items.forEach(i => cons.get(i));
    }
}

const newDistributor = (name, obj) => {
    const distributor = extend(Block, name, {
        size: 2,
        health: 690,
        update: true,
        solid: true, 
        category: Category.distribution,
        buildVisibility: BuildVisibility.shown,
        canOverdrive: true,
        inEditor: true,
        hasItems: true,
        hasLiquids: false,
        hasPower: true,
        itemCapacity: 28,

        research: "diversetech-steel-compound-mixer",
        nodeRequirements: ItemStack.with(
            Items.phaseFabric, 720,
            Items.silicon, 730,
            ic("nickel"), 2190,
            Items.lead, 3200
        ),
        requirements: ItemStack.with(
            Items.phaseFabric, 75,
            Items.silicon, 45,
            ic("nickel"), 140,
            Items.lead, 140,
        ),

        range: 8 * 7,
        reloadTime: 26,
        maxAmountItem: 2,
        powerUse: 1.8,

        drawPlace(x, y, rotation, valid){
            this.super$drawPlace(x, y, rotation, valid);
            Drawf.dashCircle((x * 8) + this.offset, (y * 8) + this.offset, this.range, Pal.placing);
        },
        setStats(){
            this.super$setStats();
            this.stats.remove(Stat.powerUse);
            this.stats.add(Stat.powerUse, (this.powerUse * 60).toString() + " [gray]* " + Core.bundle.get("unit.blocks"));
            this.stats.add(Stat.output, Math.round(((this.maxAmountItem * 60)/this.reloadTime) * 10)/10 + " " + Core.bundle.get("unit.itemssecond") + " [gray]* " + Core.bundle.get("unit.blocks"));
            this.stats.add(Stat.reload, Math.round((this.reloadTime / 60) * 10)/10 + " " + Core.bundle.get("unit.persecond"));
            this.stats.add(Stat.range, this.range);
        },
        init(){
            this.super$init();
            TechTree.TechNode(TechTree.get(Vars.content.getByName(ContentType.block, this.research)), this, this.nodeRequirements);
        }
    });

    distributor.consumes.add(new DynamicConsumePower(b => b.mpower()));
    !obj ? null : Object.assign(distributor, obj);

    distributor.buildType = () => extend(Building, {
        buildings: [],
        reload: 0,

        refresh(){
            if(this.buildings.length < 1) return;
            this.buildings.forEach(i => {
                if(Vars.world.build(i) == null){
                    this.buildings.splice(this.buildings.indexOf(i), 1);
                }
            });
        },
        counts(build){
            if(!this.items.any()) return false;
            
            let items = [];
            this.items.each(i => items.push(i));

            for(let i = 0; i < items.length; i++){
                if(build.block.ammo != null){
                    if(build.block.consumes.get(ConsumeType.item).filter.get(items[i])){
                        return true;
                    }
                } else {
                    let stack = [];

                    getConsume(build, cons(i => {
                        if(i.item != null) stack.push(i.item);
                    }));
                    
                    for(let s = 0; s < stack.length; s++){
                        if(this.items.has(stack[s])){
                            return true;
                        }
                    }
                }
            }
            return false;
        },        
        transferItem(build, stack){
            if(build.block.ammo != null){
                if(!this.items.any()) return;
                this.items.each(i => {
                    if(build.block.consumes.get(ConsumeType.item).filter.get(i)){
                        let max = Math.min(distributor.maxAmountItem, this.items.get(i));

                        if(this.items.has(i, max) && build.totalAmmo + (build.block.ammoTypes.get(i).ammoMultiplier * max) <= build.block.maxAmmo){
                            this.items.remove(i, max);
                            build.handleStack(i, build.acceptStack(i, max, null), null);
                            Fx.itemTransfer.at(this.x, this.y, max, i.color, build);
                        }
                    }
                });
                return;
            }

            let max = Math.min(distributor.maxAmountItem, build.block.itemCapacity - build.items.get(stack.item));

            if(max == 0) return;

            if(this.items.has(stack.item, max)){

                this.items.remove(stack.item, max);
                Fx.itemTransfer.at(this.x, this.y, max * 2, stack.item.color, build);
                build.items.add(stack.item, max);
            
            }
        },
        mpower(){
            return distributor.powerUse * this.buildings.length;
        },
        acceptItem(source, item){
            return source.team == this.team && this.items.get(item) <= this.block.itemCapacity - 1;
        },
        updateTile(){
            this.super$updateTile();
            if(Vars.state.isPaused() || this.power.status < 1) return;

            if(this.reload < distributor.reloadTime){
                this.reload += this.delta();
                return;
            } else {
                this.reload = 0;
            }

            if(this.timer.get(60)){
                this.refresh();
            }

            Vars.indexer.allBuildings(this.x, this.y, distributor.range, build => {
                if(build == this || !valid(build.block)) return;

                if(this.buildings.indexOf(build.pos()) == -1){
                    if(this.counts(build)) this.buildings.push(build.pos());
                } else {
                    if(!this.counts(build)) this.buildings.splice(this.buildings.indexOf(build.pos()), 1);
                }

                //items
                getConsume(build, cons(stack => {
                    this.transferItem(build, stack);
                }));
            });
        },
        display(table){
            this.super$display(table);
            table.row();
            table.table(null, t => {
                t.image(Icon.power).size(8, 8);
                t.add("").update(l => {
                    l.setText((this.power.status == 1 ? "[]" : "[#ff4444]") + " " + (Math.round(this.mpower() * 60 * 10)/10))
                }).wrap().padLeft(10);
            }).left().padLeft(10).padTop(10).padBottom(10);
        },
        drawSelect(){
            Drawf.dashCircle(this.x, this.y, distributor.range, this.team.color);
        }
    });
};

newDistributor("mega-distributor", {});

newDistributor("hyper-distributor", {
    size: 3,
    health: 1100,
    range: 8 * 11,
    maxAmountItem: 3,
    reloadTime: 25,
    powerUse: 3.4,
    itemCapacity: 42,

    research: "diversetech-mega-distributor",
    nodeRequirements: ItemStack.with(
        Items.surgeAlloy, 1380,
        Items.phaseFabric, 1040,
        Items.silicon, 2500
    ),
    requirements: ItemStack.with(
        Items.surgeAlloy, 95,
        Items.phaseFabric, 75,
        Items.silicon, 95,
    )
});