/**
 * Created by user on 14.02.2017.
 */


var SphereShader ={

    vertexShader: [
        "precision highp float;",

        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",
        "uniform vec4 color;",
        "uniform vec3 u_lightWorldPosition;",
        "uniform bool u_UseExpression;",
        "uniform float u_minExpression;",
        "uniform float u_maxExpression;",

        "uniform bool u_UseExpressionGlobal;",
        "uniform float u_minExpressionGlobal;",
        "uniform float u_maxExpressionGlobal;",

        "uniform vec3 u_center;",



        "attribute vec3 normal;",
        "attribute vec3 position;",
        "attribute vec2 uv;",

        "attribute vec3 offset;",
        "attribute vec3 scale;",
        "attribute float expression;",

        "varying vec2 vUv;",
        "varying vec3 positionEye;",
        "varying vec3 v_normal;",
        "varying vec3 v_surfaceToLight;",

        "varying vec4 vColor;",
        // "varying float v_expression;",

        "void main() {",
            "positionEye = ( modelViewMatrix * vec4( vec3( offset.x + (position.x)*scale.x - u_center.x , offset.y + (position.y)*scale.y - u_center.y, offset.z + (position.z)*scale.z  - u_center.z ), 1.0 ) ).xyz;",
            "gl_Position = projectionMatrix * vec4( positionEye, 1.0 );",
            "v_normal = mat3(modelViewMatrix) * normal;",
            "// compute the world position of the surfoace",
            "vec3 surfaceWorldPosition = (modelViewMatrix * vec4( position, 1.0 )).xyz;",
            "// compute the vector of the surface to the light",
            "// and pass it to the fragment shader",
            "v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;",
            "vColor = color;",
            "if(u_UseExpression){",
                // "vColor.x = (expression - u_minExpression)/(u_maxExpression - u_minExpression);",
                // "vColor.y = (expression - u_minExpression)/(u_maxExpression - u_minExpression);",
                // "vColor.z = (expression - u_minExpression)/(u_maxExpression - u_minExpression);",
                "vColor.w = (expression - u_minExpression)/(u_maxExpression - u_minExpression);",
            "}",
            "else {",
                "if(u_UseExpressionGlobal){",
                    "vColor.x = (expression - u_minExpressionGlobal)/(u_maxExpressionGlobal - u_minExpressionGlobal);",
                    "vColor.y = (expression - u_minExpressionGlobal)/(u_maxExpressionGlobal - u_minExpressionGlobal);",
                    "vColor.z = (expression - u_minExpressionGlobal)/(u_maxExpressionGlobal - u_minExpressionGlobal);",
                    // "vColor.w = (expression - u_minExpressionGlobal)/(u_maxExpressionGlobal - u_minExpressionGlobal);",
                "}",
            "}",
            // "else {",
            //     "v_expression = 1.0;",
            // "}",
        "}",
    ].join("\n"),

    // fragmentShader: [
    //     "#extension GL_OES_standard_derivatives : enable",
    //     "precision highp float;",
    //
    //
    //     "uniform sampler2D map;",
    //     "varying vec2 vUv;",
    //
    //     "varying vec3 vColor;",
    //     "varying vec3 positionEye;",
    //
    //     "void main() {",
    //         "vec3 fdx = dFdx( positionEye );",
    //         "vec3 fdy = dFdy( positionEye );",
    //         "vec3 normal = normalize( cross( fdx, fdy ) );",
    //         "float diffuse = dot( normal, vec3( 0.0, 0.0, 1.0 ) );",
    //         "gl_FragColor = vec4( diffuse * vColor.xyz, 1.0 );",
    //     "}",
    // ].join("\n")


    fragmentShader: [
            "precision highp float;",
            "varying vec4 vColor;",
            "varying vec3 v_normal;",
            "varying vec3 v_surfaceToLight;",
            // "varying float v_expression;",
            "void main() {",
                "vec3 normal = normalize(v_normal);",
                "vec3 surfaceToLightDirection = normalize(v_surfaceToLight);",
                "float light = dot(v_normal, surfaceToLightDirection);",
                "gl_FragColor = vColor;",
                "gl_FragColor.rgb *= light;",
                // "gl_FragColor.a = v_expression;",
            "}"
    ].join("\n")


};
