let scripts = Seq.with(
  //libs
  "libs/functions",
  //blocks
  "blocks/fusion-machine", "blocks/quantum-former",
  //turrets (yes it's organized)
  "turrets/conductor", "turrets/overvoltage", "turrets/aura",
  "turrets/mist",
  "turrets/magma"
);
scripts.each(e => {
  require(e);
});
print("DiverseTech is loaded, are you sure that u will play this?");

//client load info
let shutUp = false;
Events.on(ClientLoadEvent, () => {
  if(!shutUp){
    Vars.ui.showOkText("[#ff4444]Confirm[]", "[accent]DiverseTech Mod[] \n \nIf you are playing this mod, be aware it is under testing and it still in development. \n \nIf you want to make a suggestion/pull request go to FlinTyX/DiverseTech.",
    () => {
      shutUp = true;
    });
  }
});
