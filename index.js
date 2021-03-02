import {draw_square, initSquareBuffers} from "./square";
import {drawCube, initCubeBuffers} from "./cube";
//GLOBALS
let gl = null
let rotation = 0
const speed = 0.002
let programInfo = {
}

let buffers = {

}


//SHADERS
const VERTEX_SHADER = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

// Fragment shader program

const FRAGMENT_SHADER = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    // Send the source to the shader object
    gl.shaderSource(shader, source);
    // Compile the shader program
    gl.compileShader(shader);
    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initShaderProgram()
{
    const vertexShader = loadShader(gl,gl.VERTEX_SHADER,VERTEX_SHADER)
    const fragmentShader = loadShader(gl,gl.FRAGMENT_SHADER,FRAGMENT_SHADER)

    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram,vertexShader)
    gl.attachShader(shaderProgram,fragmentShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    programInfo = {
        "program":shaderProgram,
        attribLocations:
            {
                vertexPosition: gl.getAttribLocation(shaderProgram,'aVertexPosition'),
                vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor') // For Cube!
            },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        }
    }

    return shaderProgram;
}



function render()
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Perspective Matrix Creation

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar)

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix,modelViewMatrix,[0,0,-5])
    mat4.rotate(modelViewMatrix,  // destination matrix
        modelViewMatrix,  // matrix to rotate
        rotation,   // amount to rotate in radians
        [0, 1, 0]);
    //draw_square(gl,buffers,programInfo,projectionMatrix,modelViewMatrix)
    drawCube(gl,buffers,programInfo,projectionMatrix,modelViewMatrix)
    rotation+=speed;
    requestAnimationFrame(render)

}

function main()
{
    //Initializing context
    const canvas = document.getElementById('canvas')
    gl = canvas.getContext('webgl')
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    initShaderProgram()
    //buffers = initSquareBuffers(gl)
    buffers = initCubeBuffers(gl)
    //console.log(buffers)
    requestAnimationFrame(render)
}

main()
