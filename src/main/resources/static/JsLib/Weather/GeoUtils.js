/**
 * Created by user on 10.03.2017.
 */
function getXYZ(lat, lon) {
    // lat+=90;
    // lon=180-lon;
    var Lat   = (lat)*(Math.PI/180);
    var Long  = (lon)*(Math.PI/180);

    var x = (Math.cos(Long) * Math.cos(Lat));
    var y = (Math.sin(Lat));
    var z = (Math.sin(Long) * Math.cos(Lat));

    return new THREE.Vector3(x,y,z);
}

function distance(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1));
}