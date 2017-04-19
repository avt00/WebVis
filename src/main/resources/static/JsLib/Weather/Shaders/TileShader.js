/**
 * Created by user on 14.02.2017.
 */


var TileShader ={

    vertexShader: [
        "precision highp float;",

        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",

        "attribute vec3 position;",
        "attribute vec2 uv;",

        "varying vec2 vUv;",

        "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}",
    ].join("\n"),

    fragmentShader: [
            "precision highp float;",
            "uniform sampler2D map;",
            "varying vec2 vUv;",

            "void main() {",
                "gl_FragColor = texture2D(map, vUv);",
            "}"
    ].join("\n")


};
