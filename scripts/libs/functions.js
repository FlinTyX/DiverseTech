function plusRot(rot, n){
    if(rot > 360 && n >= 0){
        rot = n;
    } else {
        rot = rot + n;
    }
    return rot;
}

function alphaPlus(alpha, n){
    if(alpha > 1 + n && n >= 0){
        alpha = 1;
    } else if(alpha < 0 - n && n <= 0){
        alpha = 0;
    } else {
        alpha = alpha + n;
    }
    return alpha;
}

module.exports = {
    plusRot : plusRot,
    alphaPlus : alphaPlus
};
