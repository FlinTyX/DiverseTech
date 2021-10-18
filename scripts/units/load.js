let {uc, ic} = require("libs/functions");

let requn = (n, seck) => {
  let unit = Vars.content.getByName(ContentType.unit, "diversetech-" + n);
  TechTree.get(unit).setupRequirements(seck);
  return unit;
};

//missing category unit's code
let addPlan = (recon, plan) => {
    plan.forEach(e => {
      recon.upgrades.add(e.toArray(UnitType));
    });
};

Events.on(ContentInitEvent, () => {
  //factories
  Blocks.airFactory.plans.add(
    new UnitFactory.UnitPlan(requn("veni", ItemStack.with(Items.silicon, 800, Items.lead, 400)), 60 * 25, ItemStack.with(Items.silicon, 30, Items.lead, 20))
  );

  //tier 2
  addPlan(Blocks.additiveReconstructor, [
      Seq.with(
        uc("veni"),
        requn("borealis", ItemStack.with(Items.silicon, 2100, Items.graphite, 2100))
      )
  ]);
  
  //tier 3
  addPlan(Blocks.multiplicativeReconstructor, [
      Seq.with(
        uc("borealis"),
        requn("caeli", ItemStack.with(Items.silicon, 9800, Items.titanium, 7000, ic(ContentType.item, "nickel"), 2080))
      )
  ]);
  
  //tier 4
  addPlan(Blocks.exponentialReconstructor, [
      Seq.with(
        uc("caeli"),
        requn("venti", ItemStack.with(Items.silicon, 90000, Items.titanium, 6590, ic(ContentType.item, "nitinol"), 32000))
      )
  ]);

  //tier 5
  addPlan(Blocks.tetrativeReconstructor, [
    Seq.with(
      uc("venti"),
      requn("azimuth", ItemStack.with(Items.silicon, 95000, Items.plastanium, 45000, ic(ContentType.item, "nitinol"), 22000, ic(ContentType.item, "hyper-alloy"), 19900))
    )
  ]);
});

[

  Blocks.airFactory,
  Blocks.additiveReconstructor,
  Blocks.multiplicativeReconstructor,
  Blocks.exponentialReconstructor,
  Blocks.tetrativeReconstructor

].forEach(e => {
  e.init();
});