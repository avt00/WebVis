/**
 * Created by user on 10.03.2017.
 */
function HeatMapEarth(timeArray, latArray, lonArray, values, radius) {
    this.timeArray = timeArray;
    this.radius = radius;
    this.latitudeArray = latArray;
    this.longitudeArray = lonArray;
    this.values = values;
    this.min = 0;
    this.max = 0;

    this.mesh = null;
    this.colors = null;

    this.getLayer = function () {
        var lengthLat = this.latitudeArray.length;
        var lengthLon = this.longitudeArray.length;
        var countPoint = lengthLat * lengthLon;
        var positionBuffer = new Float32Array( countPoint * 3);
        this.colors = new Float32Array( countPoint * 3 );
        var indexBuffer = new Uint32Array( 6*(lengthLat-1)*(lengthLon));
        var normalBuffer = new Float32Array( countPoint * 3);
        var color = new THREE.Color();
        for(var i = 0; i < lengthLat; i++){
            for(var j = 0; j < lengthLon; j++){
                var lat = this.latitudeArray[i];
                var lon = 180-this.longitudeArray[j];
                var value = this.values[0][i][j];
                var indexForInsert = (i*lengthLon + j)*3;
                var normal = getXYZ(lat, lon);
                if(i==0 && j==0){
                    this.min = value;
                    this.max = value;
                }
                else{
                    this.updateMinMax(value);
                }
                var vertex =  normal.multiplyScalar(this.radius);
                normal.toArray(normalBuffer, indexForInsert);
                vertex.toArray(positionBuffer, indexForInsert);
                color.setHSL((1-(value-this.min)/(this.max-this.min))*240/360, 1, 0.5);
                color.toArray(this.colors, indexForInsert);
            }
        }
        var count = 0;
        for ( var i = 0; i < lengthLat-1; i++ ) {
            for (var j = 0; j < lengthLon; j++) {
                var first = i * lengthLon + j;
                var second = first + lengthLon;
                if (j == lengthLon - 1) {
                    indexBuffer[count++] = first;
                    indexBuffer[count++] = second;
                    indexBuffer[count++] = first - lengthLon + 1;
                    indexBuffer[count++] = second;
                    indexBuffer[count++] = first + 1;
                    indexBuffer[count++] = first - lengthLon + 1;
                }
                else {
                    indexBuffer[count++] = first;
                    indexBuffer[count++] = second;
                    indexBuffer[count++] = first + 1;
                    indexBuffer[count++] = second;
                    indexBuffer[count++] = second + 1;
                    indexBuffer[count++] = first + 1;
                }
            }
        }
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positionBuffer, 3 ) );
        geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 3 ).setDynamic( true ) );
        geometry.setIndex(new THREE.BufferAttribute(indexBuffer, 1 ) );
        var material = new THREE.MeshBasicMaterial( {transparent: true, opacity: 0.5, side: THREE.FrontSide, vertexColors: THREE.FaceColors} );
        this.mesh = new THREE.Mesh( geometry, material );
        return this.mesh;
    };

    this.updateMinMax = function(value) {
        if(this.min > value)
            this.min=value;
        if(this.max < value)
            this.max =value;
    };


    // insert new values one moment
    this.updateColor = function (timeIndex) {
        var color = new THREE.Color();
        console.log(timeIndex +" min: "+ this.min + " max:" + this.max);
        for(var i = 0; i < this.latitudeArray.length; i++){
            for(var j = 0; j < this.longitudeArray.length; j++){
                var value = this.values[timeIndex][i][j];
                var indexForInsert = (i*this.longitudeArray.length + j)*3;
                this.updateMinMax(value);
                color.setHSL((1-(value-this.min)/(this.max-this.min))*240/360, 1, 0.5);
                color.toArray(this.colors, indexForInsert);
            }
        }
        this.mesh.geometry.attributes.color.needsUpdate = true;
    };
}