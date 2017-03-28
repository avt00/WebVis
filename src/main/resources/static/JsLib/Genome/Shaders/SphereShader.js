/**
 * Created by user on 14.02.2017.
 */


var SphereShader ={

    vertexShader: [
        "precision highp float;",

        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",
        "uniform vec3 color;",

        "attribute vec3 position;",
        "attribute vec2 uv;",

        "attribute vec3 offset;",
        "attribute vec3 scale;",

        "varying vec2 vUv;",
        "varying vec3 positionEye;",


        "varying vec3 vColor;",

        "void main() {",
            "positionEye = ( modelViewMatrix * vec4( vec3( offset.x + position.x*scale.x, offset.y + position.y*scale.y, offset.z + position.z*scale.z), 1.0 ) ).xyz;",
            "vColor = color;",
            "vUv = uv;",
            "gl_Position = projectionMatrix * vec4( positionEye, 1.0 );",
        "}",
    ].join("\n"),

    fragmentShader: [
        "#extension GL_OES_standard_derivatives : enable",
        "precision highp float;",


        "uniform sampler2D map;",
        "varying vec2 vUv;",

        "varying vec3 vColor;",
        "varying vec3 positionEye;",

        "void main() {",
            "vec3 fdx = dFdx( positionEye );",
            "vec3 fdy = dFdy( positionEye );",
            "vec3 normal = normalize( cross( fdx, fdy ) );",
            "float diffuse = dot( normal, vec3( 0.0, 0.0, 1.0 ) );",
            "gl_FragColor = vec4( diffuse * vColor.xyz, 1.0 );",
        "}",
    ].join("\n")


    // fragmentShader: [
    //         "precision highp float;",
    //         "varying vec3 vColor;",
    //         "void main() {",
    //             "gl_FragColor = vec4( vColor, 1.0 );",
    //         "}"
    // ].join("\n")


};
