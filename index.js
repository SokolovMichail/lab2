//GLOBALS
let gl = null
let speed = 0.0002;
let programInfo = {
}

let buffers = {

}


//SHADERS
const FRAGMENT_SHADER = `
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`

const VERTEX_SHADER = `

attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;


void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}

`

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
                vertexPosition: gl.getAttribLocation(shaderProgram,'aVertexPosition')
            },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        }
    }

    return shaderProgram;
}

function initBuffers()
{
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer)

    const positions = [
        -1.0,  1.0,
        1.0,  1.0,
        -1.0, -1.0,
        1.0, -1.0,
    ];
    buffers =
        {
            position: positionBuffer
        }


    gl.bufferData(positionBuffer,new Float32Array(positions))
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

    const numComponents = 2;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next
                              // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    console.log(programInfo)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
    gl.useProgram(programInfo.program)

    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix,
        false,
        programInfo.uniformLocations.projectionMatrix)

    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,
        false,
        programInfo.uniformLocations.modelViewMatrix)

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }

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
    requestAnimationFrame(render)
}

main()
