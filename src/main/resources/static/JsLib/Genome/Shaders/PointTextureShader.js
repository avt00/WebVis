/**
 * Created by user on 14.02.2017.
 */

var PointTextureShader ={

    vertexShader: [
        "attribute float size;",
        "attribute float alpha;",
        "varying float vAlpha;",

        "attribute vec3 customColor;",
        "varying vec3 vColor;",
        "void main() {",
            "vAlpha = alpha;",
            "vColor = customColor;",
            "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
            "gl_PointSize = size * ( 300.0 / -mvPosition.z );",
            "gl_Position = projectionMatrix * mvPosition;",
        "}",
    ].join("\n"),

    fragmentShader: [
        "varying float vAlpha;",
        "uniform vec3 color;",
        "uniform sampler2D texture;",
        "varying vec3 vColor;",
        "void main() {",
            "vec4 outColor = texture2D( texture, gl_PointCoord );",

            "if ( outColor.a < 0.5) discard;",

            "gl_FragColor = outColor * vec4( color * vColor, 1 );",
            "gl_FragColor.a = vAlpha;",
        "}",
    ].join("\n")

};
