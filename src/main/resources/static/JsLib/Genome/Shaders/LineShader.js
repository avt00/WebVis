/**
 * Created by user on 14.02.2017.
 */

var LineShader ={

    vertexShader: [
        "attribute vec3 customColor;",
        "varying vec3 vColor;",
        "void main() {",
        "vColor = customColor;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}",
    ].join("\n"),

    fragmentShader: [
        "uniform vec3 color;",
        "uniform float opacity;",
        "varying vec3 vColor;",
        "void main() {",
            "gl_FragColor = vec4( vColor * color, opacity );",
        "}",
    ].join("\n")

};
