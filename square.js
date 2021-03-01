export function draw_square(gl,buffers)
{
    const numComponents = 2;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next
                              // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    //console.log(programInfo)
    //console.log(buffers)
    gl.bindBuffer(gl.ARRAY_BUFFER,buffers.position)
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
        projectionMatrix)

    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix)

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}