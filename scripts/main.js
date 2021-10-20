const scripts = [
  //effect
  "effect/DTweathers",
  
  //crafter
  "blocks/fusion-machine", "blocks/quantum-former",
  
  //blocks/units
  "blocks/repairCenter",

  //distribution
  "blocks/distributors",
  
  //units
  "units/load", "units/caeli", "units/venti", "units/azimuth",
  
  //turrets
  "turrets/photon-neutron", "turrets/refraction", "turrets/equalization",
  "turrets/conductor", "turrets/overvoltage", "turrets/aura",
  "turrets/mist", "turrets/blizzard",
  "turrets/magma", 
  "turrets/lotus",
  "turrets/tesla"
];
scripts.forEach(e => require(e));
print("0.2 is here!");

const {showOkTextRegion, showOkTextAnim} = require("libs/DTui");

//setting
if(!Core.settings.has("diversetech-randomDialogs")){
  Core.settings.put("diversetech-randomDialogs", true);
}

Events.on(ClientLoadEvent, () => {
  Vars.ui.settings.graphics.checkPref(
    "randomDialogs", 
    Core.settings.getBool("diversetech-randomDialogs"),
    bool => {
      
      Core.settings.put("diversetech-randomDialogs", bool);
      
      showOkTextRegion(
        Core.bundle.get("dtui.settings-warning.title"),
        Core.bundle.get("dtui.settings-warning.text"),
        Icon.warning,
        cons(() => {})
      )
    }
  );
});

//random dialogs
if(Core.settings.getBool("diversetech-randomDialogs")){
  let shutUp = false;
  let showing = false;
  let frames = [], nggyu = loadSound("neverGonnaGiveYouUp");

  Events.on(ContentInitEvent, () => {
    if(!frames) return;

    for(let i = 0; i < 32; i++){
      frames[i] = Core.atlas.find("diversetech-rick-" + i);
    }
  });

  function showRandomDialog(){
    if(!Mathf.chance(0.02)){
      if(shutUp){
        const rand = Math.round(Math.random() * 9).toString();
        
        showOkTextRegion(
          Core.bundle.get("dtui.load-dialog" + rand + ".title"),
          Core.bundle.get("dtui.load-dialog" + rand + ".text"),
          Core.atlas.find("diversetech-uicon" + rand),
          cons(() => {
            shutUp = true;
            showing = false;
          })
        );

      } else if(Mathf.chanceDelta(0.5)){

        showOkTextRegion(
          Core.bundle.get("dtui.load-basedialog.title"),
          Core.bundle.get("dtui.load-basedialog.text"),
          Core.atlas.find("diversetech-uicon"),
          cons(() => {
            shutUp = true;
            showing = false;
          })
        );

      }

    } else {

      nggyu.play();
      showOkTextAnim(
        Core.bundle.get("dtui.load-rick.title"),
        Core.bundle.get("dtui.load-rick.text"),
        frames,
        cons(() => {
          shutUp = true;
          showing = false;
          nggyu.stop();
        })
      );
    }
  };

  Events.on(WorldLoadEvent, () => {
    if(!shutUp){
      showRandomDialog();
    }
  });

  Events.run(Trigger.update, () => {
    if(!Vars.state.isPlaying()) return;

    if(!showing && Mathf.chanceDelta(0.0004/60)){
      showing = true;
      showRandomDialog();
    }
  });
}