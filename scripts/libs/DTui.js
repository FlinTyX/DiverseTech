function showOkTextRegion(title, text, region, cons){
    let dialog = new Dialog();
    let table = new Table();

    table.table(null, t => {
        t.add(new Image(region)).center();
        t.add(title, Styles.defaultLabel, 1).padLeft(4).center();
    });

    table.row();
    table.image(Tex.whiteui, Pal.accent).growX().height(3).pad(4).padTop(6).width(500).align(Align.center);
    table.row();
    table.add(text).width(500).wrap().pad(10).get().setAlignment(Align.center, Align.center);
    table.row();
    table.button("@ok", () => {
  
        dialog.hide();
        cons.get(this);
  
    }).size(200, 54).pad(4).padTop(6).align(Align.center);
    dialog.add(table);
    dialog.show();
};

function showOkTextAnim(title, text, frames, cons){
    let dialog = new Dialog();
    let table = new Table();
    
    //animation
    let interval = new Interval();
    let frame = 0;

    table.table(null, t => {
        t.add(new Image(frames[0])).update(i => {
            if(interval.get(2.56)){
                if(frame == frames.length - 1){
                    frame = 0;
                } else {
                    ++frame;
                }
            }

            i.setDrawable(frames[frame]);
        }).center();
        t.row();
        t.add(title, Styles.defaultLabel, 1).padBottom(5).padTop(5).center();
    });

    table.row()
    table.image(Tex.whiteui, Pal.accent).growX().height(3).pad(4).padTop(6).width(500).align(Align.center);
    table.row();
    table.add(text).width(500).wrap().pad(10).get().setAlignment(Align.center, Align.center);
    table.row();
    table.button("@ok", () => {
  
        dialog.hide();
        cons.get(this);
  
    }).size(200, 54).pad(4).padTop(6).align(Align.center);
    dialog.add(table);
    dialog.show();
};

module.exports = {
    showOkTextRegion : showOkTextRegion,
    showOkTextAnim : showOkTextAnim
}