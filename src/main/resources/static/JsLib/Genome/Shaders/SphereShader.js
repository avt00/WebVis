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
    ].join("\n"),





    vertexShaderNew: [
        "precision highp float;",

        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",
        "uniform vec3 u_lightWorldPosition;",

        "uniform bool u_UseExpressionGlobal;",
        "uniform float u_minExpressionGlobal;",
        "uniform float u_maxExpressionGlobal;",

        "uniform bool u_hasClipping;",
        "uniform vec3 u_normalClipping;",
        "uniform vec3 u_positionPoint;",

        "attribute vec3 normal;",
        "attribute vec3 position;",
        "attribute vec2 uv;",

        "attribute vec3 offset;",
        "attribute vec3 scale;",
        "attribute float expression;",
        "attribute vec4 color;",

        "varying vec2 vUv;",
        "varying vec3 positionEye;",
        "varying vec3 v_normal;",
        "varying vec3 v_surfaceToLight;",

        "varying vec4 vColor;",

        "void main() {",
        "positionEye = ( modelViewMatrix * vec4( vec3( offset.x + (position.x)*scale.x, offset.y + (position.y)*scale.y, offset.z + (position.z)*scale.z ), 1.0 ) ).xyz;",
        "gl_Position = projectionMatrix * vec4( positionEye, 1.0 );",
        "v_normal = mat3(modelViewMatrix) * normal;",
        "// compute the world position of the surfoace",
        "vec3 surfaceWorldPosition = (modelViewMatrix * vec4( position, 1.0 )).xyz;",
        "// compute the vector of the surface to the light",
        "// and pass it to the fragment shader",
        "v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;",
        "vColor = color;",
        "if(u_UseExpressionGlobal){",
        "vColor.x = (expression - u_minExpressionGlobal)/(u_maxExpressionGlobal - u_minExpressionGlobal);",
        "vColor.y = 0.0;",
        "vColor.z = 1.0;",
        "vColor.w = (expression - u_minExpressionGlobal)/(u_maxExpressionGlobal - u_minExpressionGlobal);",
        "}",
        "if(u_hasClipping){",
        "vec3 vectorDirection = u_positionPoint - offset;",
        "float scalarMultiValue = dot(u_normalClipping, vectorDirection);",
        "if(scalarMultiValue < 0.0){",
        "vColor.w = 0.0;",
        "}",
        "}",
        "}",
    ].join("\n"),



    fragmentShaderNew: [
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
            "if(gl_FragColor.a < 0.2)",
                "discard;",
        // "gl_FragColor.a = v_expression;",
        "}"
    ].join("\n"),

    vertexShaderSphereGenome: [
        "precision highp float;",

        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",
        "uniform vec3 u_lightWorldPosition;",

        "uniform vec4 u_color;",


        "uniform bool u_hasClipping;",
        "uniform vec3 u_normalClipping;",
        "uniform vec3 u_positionPoint;",

        "attribute vec3 normal;",
        "attribute vec3 position;",
        "attribute vec2 uv;",

        "varying vec3 v_normal;",
        "varying vec3 v_surfaceToLight;",

        "varying vec4 vColor;",
        "varying vec3 v_vectorDirection;",
        "varying vec3 v_normalClipping;",



        "void main() {",
            "vec3 positionEye =  (modelViewMatrix * vec4(position, 1.0) ).xyz;",
            "gl_Position = projectionMatrix * vec4( positionEye, 1.0 );",
            "v_normal = mat3(modelViewMatrix) * normal;",
            "// compute the world position of the surfoace",
            "vec3 surfaceWorldPosition = (modelViewMatrix * vec4( position, 1.0 )).xyz;",
            "// compute the vector of the surface to the light",
            "// and pass it to the fragment shader",
            "v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;",
            "vColor = u_color;",
            "if(u_hasClipping){",
                "v_normalClipping = u_normalClipping;",
                "v_vectorDirection = u_positionPoint - position;",
            "}",
        "}",
    ].join("\n"),



    fragmentShaderSphereGenome: [
        "precision highp float;",
        "varying vec4 vColor;",
        "varying vec3 v_normal;",
        "varying vec3 v_surfaceToLight;",
        "varying vec3 v_vectorDirection;",
        "varying vec3 v_normalClipping;",

        "void main() {",
            // "vec3 normal = normalize(v_normal);",
            // "vec3 surfaceToLightDirection = normalize(v_surfaceToLight);",
            // "float light = dot(v_normal, surfaceToLightDirection);",
            "gl_FragColor = vColor;",
            "float scalarMultiValue = dot(v_normalClipping, v_vectorDirection);",
            "if(scalarMultiValue < 0.0){",
                "gl_FragColor.a = 0.0;",
            "}",

            // "gl_FragColor.rgb *= light;",
            "if(gl_FragColor.a < 0.2)",
                "discard;",
        "}"
    ].join("\n")


};
