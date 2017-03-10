/**
 * Created by user on 10.03.2017.
 */

//"http://b.tile.openstreetmap.org/"
function Planet(radius, currentZoom, tileUrl) {
    this.radius = radius;
    this.zoom = currentZoom;
    this.tileUrl = tileUrl;

    this.getMesh = function () {
        var horizontal = Math.pow(2, this.zoom), vertical=Math.pow(2, this.zoom);
        var geometry   = new THREE.SphereGeometry(this.radius, horizontal, vertical);

        var materials = [];
        for(var j=0;j<vertical;j++)
            for(var i=0;i<horizontal;i++){
                THREE.ImageUtils.crossOrigin = '';
                var texture = THREE.ImageUtils.loadTexture(this.tileUrl+"/"+this.zoom+"/"+i+"/"+j+".png");
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set( horizontal, vertical );
                var material1 = new THREE.MeshBasicMaterial( { map:texture});
                materials.push(  material1);
                if(j==0)
                    i++;
            }
        var l = geometry.faces.length / 2;
        for(var j=0;j<vertical;j++)
            for( var i = 0; i < horizontal; i ++ ) {
                var index=j*horizontal+i;

                var k = 2 * index;
                if(k>=2*l){
                    break;
                }
                geometry.faces[ k ].materialIndex = index ;
                if(j!=0 && j!=vertical-1){
                    geometry.faces[ k + 1 ].materialIndex = index ;
                }
            }
        return new THREE.Mesh(geometry,new THREE.MeshFaceMaterial(materials));
    }
}