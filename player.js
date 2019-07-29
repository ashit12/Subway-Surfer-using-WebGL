/// <reference path="webgl.d.ts" />

let player = class {
    constructor(gl, pos, path) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        var l = 0.25;
        var w = 0.25;
        var h = 0.25;
        this.l = 0.5;
        this.w = 0.5;
        this.h = 0.5;
        this.positions = [
             // Front face
             -l, -w, h,
             l, -w, h,
             l, w, h,
             -l, w, h,
             //Back Face
             -l, -w, -h,
             l, -w, -h,
             l, w, -h,
             -l, w, -h,
             //Top Face
             -l, w, -h,
             l, w, -h,
             l, w, h,
             -l, w, h,
             //Bottom Face
             -l, -w, -h,
             l, -w, -h,
             l, -w, h,
             -l, -w, h,
             //Left Face
             -l, -w, -h,
             -l, w, -h,
             -l, w, h,
             -l, -w, h,
             //Right Face
             l, -w, -h,
             l, w, -h,
             l, w, h,
             l, -w, h,
        ];

        this.rotation = 0;
        this.inair = 0;
        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
      
        const textureCoordinates = [
          // Front
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Back
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Top
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Bottom
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Right
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Left
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
        ];
      
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                      gl.STATIC_DRAW);
      
        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        const indices = [
            0, 1, 2,    0, 2, 3, // front
            4, 5, 6,    4, 6, 7,
            8, 9, 10,   8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23, 
        ];

        // Now send the element array to GL

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        }
        this.texture = loadTexture(gl,path);
        this.x_speed = 0;
        this.y_max = 0.10;
        this.y_speed = 0.10;
        this.y_accn = 0.10/240;
        this.z_speed = 0;
        this.x_dest = 0;
        this.start = 0;
        this.flag=0;
        this.boot=0;
        this.boot_time = 0;
        this.magnet = 0;
        this.magnet_time = 0;
        this.cd = 0;
        this.sc = 0;
        this.sc_time = 0;
        this.jet = 0;
        this.jet_time = 0;
        this.z_max = 3.5;
        this.score = 0;
        this.accn = 0.01;
        this.clcount = 0;
        this.f = 0;
        this.wallcd = 0;
        this.traincd = 0;
    }
    tick(){
        this.jet_time--;
        this.wallcd--;
        this.traincd--;
        this.boot_time--;
        this.sc_time--;
        this.magnet_time--;
        this.pos[1] += this.y_speed;
        this.pos[0] += this.x_speed;
        this.pos[2] = Math.max(this.pos[2]+this.z_speed,1.20);
        this.z_speed -= this.accn;
        if(this.sc_time<=0 && this.sc==1)
            this.sc = 0, this.l *=2, this.w *= 2, this.h *= 2, this.f=0;
        else if(this.f==0 && this.sc_time>0)
            this.l /= 2, this.w /= 2, this.h /= 2, this.f =1;
        if(this.boot_time<=0)
            this.boot = 0;
        if(this.y_speed==this.y_max)
            this.clcount = 0;
        if(this.y_speed<this.y_max)
        {
            this.y_speed = Math.min(this.y_speed+this.y_accn,this.y_max);
        }
        if(this.flag<0)
        {
            if(this.pos[0]<=this.x_dest)
                this.pos[0] = this.x_dest,this.flag=0,this.x_speed=0,this.start = this.x_dest;
        }
        if(this.flag>0)
        {
            if(this.pos[0]>=this.x_dest)
                this.pos[0] = this.x_dest,this.flag=0,this.x_speed=0, this.start= this.x_dest;
        }
        if(this.jet)
        {
            if(this.jet_time>0)
            {
                this.accn = 0;
                if(this.pos[2]>=this.z_max)
                    this.pos[2] = this.z_max,this.z_speed=0;
                this.pos[2] = Math.min(this.z_max,this.pos[2]);
            }
            else
            {
                temp_coins_list.splice(0,temp_coins_list.length);
                this.y_speed = 0.05;
                this.z_speed=0;
                this.accn = 0.01;
                this.jet = 0;
            }
        }
        else
            this.cd--;

    }
    draw(gl, projectionMatrix, programInfo, deltaTime) {
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        if(this.sc)
            mat4.scale(modelViewMatrix,modelViewMatrix,[0.5,0.5,0.5]);
        else
            mat4.scale(modelViewMatrix,modelViewMatrix,[1.0,1.0,1.0]);
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

        
          // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, this.texture);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
}
    }
};
