const uc = n => Vars.content.getByName(ContentType.unit, "diversetech-" + n);
const ic = n => Vars.content.getByName(ContentType.item, "diversetech-" + n);

function plusRot(rot, n){
    if(rot > 360 && n >= 0){
        rot = n;
    } else {
        rot = rot + n;
    }
    return rot;
}

module.exports = {
    uc : uc,
    ic : ic,
    plusRot : plusRot
};
