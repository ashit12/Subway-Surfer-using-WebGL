/// <reference path="webgl.d.ts" />

let coins = class {
    constructor(gl, pos, path) {
        this.positionBuffer = gl.createBuffer();
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        var r = 0.1;        
        this.positions = [];
        create_circle(this.positions,r,0,0,0);
        // console.log(this.positions.length);
        this.rotation = 0;
        this.pos = pos;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        //   0.0,  0.0,
        //   1.0,  0.0,
        //   1.0,  1.0,
        //   0.0,  1.0,
        let texcord = [];
        for(i=0;i<60;i++)
        {
            texcord.push(0.0);
            texcord.push(0.0);
            texcord.push(1.0);
            texcord.push(0.0);
            texcord.push(1.0);
            texcord.push(1.0);
            texcord.push(0.0);
            texcord.push(1.0);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcord),
                      gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        let indices = [];
        for(i=0;i<60;i++)
            indices.push(i);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        }
        this.texture = loadTexture(gl,path);
        this.y_speed=0;
        this.x_speed=0;
        this.z_speed=0;
    }

    draw(gl, projectionMatrix, programInfo, deltaTime) {
        let a = pl.pos[0]-this.pos[0];
        let b = pl.pos[1]-this.pos[1];
        let c = pl.pos[2]-this.pos[2];
        let mag = Math.sqrt(sq(a)+sq(b)+sq(c));
        a /= mag, b /= mag, c /= mag;
        this.pos[0] += this.x_speed*-a;
        this.pos[1] += this.y_speed*-b;
        this.pos[2] += this.z_speed*-c;
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        mat4.rotate(modelViewMatrix,modelViewMatrix,Math.PI/2,[1,0,0]);
        mat4.rotate(modelViewMatrix,modelViewMatrix,this.rotation,[0,1,0]);

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const num = 2; // every coordinate composed of 2 values
            const type = gl.FLOAT; // the data in the buffer is 32 bit float
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set to the next
            const offset = 0; // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
            gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

            this.rotation += 5*deltaTime;
        
          // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, this.texture);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
  
  {
    const vertexCount = 60;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
    }
};