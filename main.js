var cubeRotation = 0.0;
var t1 = [];
var t2 = [];
var t3 = [];
var w1 = [],w2 = [];
var trains_list = [];
var coins_list = [];
var notcross_list = [];
var blade_list = [], stand_list = [];
var jet_list = [];
var boot_list = [], b1 = [], b2 = [], b3 = [], b4 = [];
var magnet_list = [],m1 = [], m2 = [],m3 = [];
var obs_list = [];
var pl;
var polh,polb,pol1,pol2;
var num_tracks = 100, num_trains=10, num_coins=500, num_not=5, num_jet=5, num_blade=20, num_boots=5, num_mag=5, num_obs = 5;
var px = 0, py = 0, pz = 0;
var back_move_limit = 0.05;
var pos_list = [-2.0,0,2.0];
var goa;
var temp_coins_list = [];
var flag = 1;
var cd = 90;
var max_cd = 90;
var changecd = 0;
var jetpos_list = [1.35,2.35];
var accn = 0.01;
var end = 0;
var s1;
main();

/* Remaining
- Police and dog
*/
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  dist = 0.0;
  s1 = new Audio();

  px = 0, py = 4, pz = 1.20;

  pl = new player(gl, [px,py,pz], "temp.jpeg");

  polb = new police(gl,[px, py-2.0,pz+0.27],0.15,0.1,0.15,"police.jpeg");
  for(i = 0; i < num_tracks; i++, dist += 2.0)
  {
    t1.push(new track(gl,[0,dist,0],"track.jpg"));
    t2.push(new track(gl,[2.0,dist,0],"track.jpg"));
    t3.push(new track(gl,[-2.0,dist,0],"track.jpg"));
    w1.push(new wall(gl, [4,dist,2], "wall.jpg"));
    w2.push(new wall(gl, [-4,dist,2], "wall.jpg"));
  }
  goa= new goal(gl, [0,dist,0], 5.0,5.0,5.0,"temp.jpeg");
  dis = 16.0
  for(i=0;i<num_trains;i++,dis+=20.0)
  {
    p = Math.floor(Math.random()*10);
    p = p%3;
    trains_list.push(new trains(gl,[pos_list[p],dis,1.75],"train.jpg"));
  }
  dis = 4.0;
  for(j=0;j<num_coins;j++,dis+=0.75)
  {
    p = Math.floor(Math.random()*10);
    p = p%3;
    coins_list.push(new coins(gl,[pos_list[p],dis,1.35],"coin.gif"));
  }
  dis = 20.0;
  for(k=0;k<num_not;k++,dis+=20.0)
  {
    p = Math.floor(Math.random()*10);
    p = p%3;
    notcross_list.push(new notcross(gl,[pos_list[p],dis,1.75],"notcross.jpg"));
  }
  dist = 15.0
  for(l=0;l<num_jet;l++,dis+=10.0)
  {
    p = Math.floor(Math.random()*10);
    p = p%2;
    jet_list.push(new jet(gl,[pos_list[p],dis,jetpos_list[p]],"jet.png"));  
  }
  dis = 15.0
  for(m = 0;m<num_blade;m++,dis+=30.0)
  {
    p = Math.floor(Math.random()*10);
    p = p%3;
    blade_list.push(new blades(gl,[pos_list[p],dis,1.35],"blade.jpg"));   
    stand_list.push(new stand(gl,[pos_list[p],dis,0.90],"blade.jpg"));   
  }
  dis = 10.0
  for(n = 0; n<num_boots;n++,dis+=15.0)
  {
    p = Math.floor(Math.random()*10);
    p = p%2;
    val = 0.25
    boot_list.push(new boot(gl,[pos_list[p],dis,jetpos_list[p]],0.15,0.15,0.15,"temp.jpeg"));  
    b1.push(new boot(gl,[pos_list[p]-0.120,dis-val,jetpos_list[p]+0.025],0.035,0.025,0.15,"temp.jpeg"));
    b2.push(new boot(gl,[pos_list[p],dis,jetpos_list[p]],0.035,0.025,0.15,"temp.jpeg"));
    b3.push(new boot(gl,[pos_list[p],dis-val,jetpos_list[p]-0.1],0.15,0.025,0.025,"temp.jpeg"));
    b4.push(new boot(gl,[pos_list[p]+0.120,dis,jetpos_list[p]-0.1],0.15,0.025,0.025,"temp.jpeg"));
  }
  dis = 8.0;
  for(o = 0; o<num_mag;o++,dis+=13.0)
  {
    p = Math.floor(Math.random()*10);
    p = p%2;
    val = 0.25
    magnet_list.push(new magnet(gl,[pos_list[p],dis,jetpos_list[p]],0.15,0.15,0.15,"jet.png"));  
    m1.push(new magnet(gl,[pos_list[p],dis-val,jetpos_list[p]-0.1],0.15,0.025,0.025,"blue.jpeg"));
    m2.push(new magnet(gl,[pos_list[p]-0.120,dis-val,jetpos_list[p]+0.025],0.035,0.025,0.15,"red.jpeg"));
    m3.push(new magnet(gl,[pos_list[p]+0.120,dis-val,jetpos_list[p]+0.025],0.035,0.025,0.15,"red.jpeg"));
  }
  dis = 10.0
  for(a = 0; a<num_obs;a++,dis+=10.0)
  {
    p = Math.floor(Math.random()*10);
    p = p%2;
    obs_list.push(new obs(gl,[pos_list[p],dis,2.05],0.5,0.001,0.65,"notcross.jpg"));
  }
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program
  const v = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;

  uniform mat4 uNormalMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;

    // Apply lighting effect

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);

  }
`;
const f = `
varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}
`;
  const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
  }
`;

  // Fragment shader program

  const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;
  const fs = `
  varying highp vec2 vTextureCoord;

  uniform sampler2D uSampler;

  void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    precision highp float;
      vec4 color = texture2D(uSampler, vTextureCoord);
      float gray = dot(color.rgb,vec3(0.299,0.587,0.114));
      gl_FragColor = vec4(vec3(gray),1.0);
  }
`;
  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const sp = initShaderProgram(gl,vsSource,fs);
  const s = initShaderProgram(gl,v,f);
 // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };
  const pr = {
    program: sp,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(sp, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(sp, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(sp, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(sp, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(sp, 'uSampler'),
    },
  };
  const pk = {
    program: s,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(s, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(s, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(s, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(s, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(s, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(s, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(s, 'uSampler'),
    },
  };
  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    changecd--;
    if(flag)
      drawScene(gl, programInfo,pk, deltaTime);
    else
      drawScene(gl,pr,pk,deltaTime);
    movement();
    collision(gl);
    if(end==0)
      pl.tick();
    else
      alert("Game over.");
    if(pl.pos)
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, p,deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  if(pl.pos[1] >= 195 || pl.clcount >=2)
    end = 1;
  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
    var cameraMatrix = mat4.create();
    var cameraPosition = [
      pl.pos[0], pl.pos[1]-5.0, pl.pos[2]+1
    ];
    var up = [0, 0, 1];

    mat4.lookAt(cameraMatrix, cameraPosition, [0, 500, 2  ], up);

    var viewMatrix = cameraMatrix;//mat4.create();

    //mat4.invert(viewMatrix, cameraMatrix);
    cd--;
    var viewProjectionMatrix = mat4.create();
    if(pl.posy >= 185)
    {
      end = 1;
    }
    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
    for(i = 0; i < num_tracks; i++)
    {
      t1[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
      t2[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
      t3[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
      if(cd>max_cd/2 || flag==0)
      {
        w1[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
        w2[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);    
      }
      else
      {
        w1[i].draw(gl, viewProjectionMatrix, p, deltaTime);
        w2[i].draw(gl, viewProjectionMatrix, p, deltaTime);    
      }
      if(cd<=0)
        cd = max_cd;
    }
    for(i = 0; i < num_trains; i++)
    {
      trains_list[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(i = 0; i < coins_list.length; i++)
    {
      coins_list[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(i = 0; i < temp_coins_list.length; i++)
    {
      temp_coins_list[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(i = 0; i < num_not; i++)
    {
      notcross_list[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(i = 0; i < jet_list.length; i++)
    {
      jet_list[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(i = 0; i < num_blade; i++)
    {
      blade_list[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(i = 0; i < num_blade; i++)
    {
      stand_list[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(i = 0; i < num_obs; i++)
    {
      obs_list[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(i = 0;i<boot_list.length;i++)
    {
      b1[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
      b2[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
      b3[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
      b4[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(i = 0;i<magnet_list.length;i++)
    {
      m1[i].draw(gl,viewProjectionMatrix,programInfo,deltaTime);
      m2[i].draw(gl,viewProjectionMatrix,programInfo,deltaTime);
      m3[i].draw(gl,viewProjectionMatrix,programInfo,deltaTime);
    }
    pl.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    polb.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    goa.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    var x = document.getElementById("score");
    x.innerText = "Score = " + pl.score;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
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

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
function movement(){
  document.onkeydown = function(myEvent) { // doesn't have to be "e"
  val = 2.0/10;
  if(myEvent.which==37)
  {
    pl.x_speed -= val;
    pl.start = pl.pos[0];
    pl.x_dest = pl.pos[0] - 2.0;
    pl.flag=-1;
  }
  else if(myEvent.which==39)
  {
    pl.x_speed += val;
    pl.start = pl.pos[0];
    pl.x_dest = pl.pos[0] + 2.0;
    pl.flag=1;
  }
  if(pl.x_speed<0)
    pl.x_speed = Math.max(pl.x_speed,-val);
  if(pl.x_speed>0)
    pl.x_speed = Math.min(pl.x_speed,val);
};
  document.onkeypress = function(myEvent){
    if(myEvent.which==101 && pl.cd<=0 && pl.boot)
      pl.z_speed = 2.0/8,pl.cd = 50;
    if(myEvent.which==101 && pl.cd<=0 && !pl.boot)
      pl.z_speed = 2.0/10,pl.cd=45;
    if(myEvent.which==102 && changecd<=0)
      changecd=60,flag^=1;
    if(myEvent.which ==100)
      pl.sc = 1, pl.sc_time = 60;
}
}
function create_circle(arr,radius,x,y,z)
{
    angle = (2*Math.PI);
    n = 20;
    for(let j=0,i=0;i<9*n;i+=9,j++)
    {
    	  arr[i]=x,arr[i+1]=y,arr[i+2]=z;
        arr[i+3]=x+radius*Math.cos(angle*j/n),arr[i+4]=y+radius*Math.sin(angle*j/n),arr[i+5]=z;
        arr[i+6]=x+radius*Math.cos(angle*(j+1)/n),arr[i+7]=y+radius*Math.sin(angle*(j+1)/n),arr[i+8]=z;
    }
}
function detect(a,b){
  return (Math.abs(a.x - b.x) * 2 < (a.length + b.length)) &&
  (Math.abs(a.y - b.y) * 2 < (a.width + b.width)) &&
  (Math.abs(a.z - b.z) * 2 < (a.height + b.height));
}
function sq(a)
{
  return a*a;
}
function dist(a,b,c,d,e,f)
{
  return Math.sqrt(sq(a-b)+sq(c-d)+sq(e-f));
}
function playsound(url){
  s1.src = url;
  s1.play();
}
function collision(gl){
  //Wall and player
  for(i = 0;i<w1.length;i++)
  {
    a = {x: pl.pos[0], y: pl.pos[1], z: pl.pos[2], height: pl.h, width: pl.w, length: pl.l};
    b = {x: w1[i].pos[0],y: w1[i].pos[1],z: w1[i].pos[2], height: w1[i].h, width: w1[i].w, length: w1[i].l };
    c = {x: w2[i].pos[0],y: w2[i].pos[1],z: w2[i].pos[2], height: w2[i].h, width: w2[i].w, length: w2[i].l };
    if(detect(a,b)||detect(a,c) && pl.wallcd <=0)
    {
      pl.y_speed /= 2;
      pl.x_speed = -pl.x_speed/2;
      pl.x_dest = pl.start;
      pl.flag *= -1;
      pl.wallcd = 30;
      pl.clcount++;
    }
  }

  //Player and coin
  for(i = 0;i<coins_list.length;i++)
  {
    a = {x: pl.pos[0], y: pl.pos[1], z: pl.pos[2], height: pl.h, width: pl.w, length: pl.l};
    b = {x: coins_list[i].pos[0],y: coins_list[i].pos[1],z: coins_list[i].pos[2], height: 0.1, width: 0.0, length: 0.1 };
    if(detect(a,b))
    {
      var ak = new Audio('./a.wav');
      ak.play();
      pl.score++;
      coins_list.splice(i,1);

    }
  }
  for(i = 0;i<temp_coins_list.length;i++)
  {
    a = {x: pl.pos[0], y: pl.pos[1], z: pl.pos[2], height: pl.h, width: pl.w, length: pl.l};
    b = {x: temp_coins_list[i].pos[0],y: temp_coins_list[i].pos[1],z: temp_coins_list[i].pos[2], height: 0.1, width: 0.0, length: 0.1 };
    if(detect(a,b))
    {
      var ak = new Audio('./a.wav');
      ak.play();
      pl.score++;
      temp_coins_list.splice(i,1);
    }
  }

  //Player and not cross wall
  for(i = 0;i<notcross_list.length;i++)
  {
    a = {x: pl.pos[0], y: pl.pos[1], z: pl.pos[2], height: pl.h, width: pl.w, length: pl.l};
    b = {x: notcross_list[i].pos[0], y: notcross_list[i].pos[1], z: notcross_list[i].pos[2], height: notcross_list[i].h, width: notcross_list[i].w, length: notcross_list[i].l};
    if(detect(a,b))
    {
      end = 1;
    }
  }
  //Player and blade
  for(i = 0;i<blade_list.length;i++)
  {
    a = {x: pl.pos[0], y: pl.pos[1], z: pl.pos[2], height: pl.h, width: pl.w, length: pl.l};
    b = {x: blade_list[i].pos[0], y: blade_list[i].pos[1], z: blade_list[i].pos[2], height: blade_list[i].h, width: blade_list[i].w, length: blade_list[i].l};
    if(detect(a,b))
    {
      end = 1;
    }
  }

  //Player and Train
  for(i = 0;i<trains_list.length;i++)
  {
    a = {x: pl.pos[0], y: pl.pos[1], z: pl.pos[2], height: pl.h, width: pl.w, length: pl.l};
    b = {x: trains_list[i].pos[0], y: trains_list[i].pos[1], z: trains_list[i].pos[2], height: trains_list[i].h, width: trains_list[i].w, length: trains_list[i].l};
    if(detect(a,b) && pl.traincd <= 0)
    {
      back = trains_list[i].pos[1] - trains_list[i].w/2;
      p = pl.pos[1]+pl.w/2;
      p *= 10;
      p = Math.round(p);
      p /= 10;
      if(back>=p-0.1&&back<=p+0.1)
        end = 1;
      else if(pl.pos[2]-pl.h/2<=trains_list[i].pos[2]+trains_list[i].h/2 && pl.pos[2]+pl.h/2 > trains_list[i].pos[2]+trains_list[i].h/2)
      {
        pl.pos[2] = trains_list[i].pos[2]+trains_list[i].h/2+pl.h/2;
        pl.z_speed = 0;
      }
      else
      {
        pl.y_speed /= 2;
        pl.x_speed = -pl.x_speed/5;
        pl.clcount++;
        pl.traincd = 30;
        pl.x_dest = pl.start;
        pl.flag *= -1;
      }
    }
  }

  //Player and jet
  for(i = 0;i<jet_list.length;i++)
  {
    a = {x: pl.pos[0], y: pl.pos[1], z: pl.pos[2], height: pl.h, width: pl.w, length: pl.l};
    b = {x: jet_list[i].pos[0], y: jet_list[i].pos[1], z: jet_list[i].pos[2], height: jet_list[i].h, width: jet_list[i].w, length: jet_list[i].l};
    if(detect(a,b))
    {
      jet_list.splice(i,1);
      pl.jet=1;
      pl.z_speed=1.0;
      pl.jet_time = 120;
      pl.y_speed *= 3;
      pl.cd=30;
      dis = pl.pos[1]+4.0;
      for(j=0;j<40;j++,dis+=0.75)
      {
        p = Math.floor(Math.random()*10);
        p = p%3;
        temp_coins_list.push(new coins(gl,[pos_list[p],dis,pl.z_max],"coin.gif"));
      }
    }
  }

  //Player and boot
  for(i = 0;i<boot_list.length;i++)
  {
    a = {x: pl.pos[0], y: pl.pos[1], z: pl.pos[2], height: pl.h, width: pl.w, length: pl.l};
    b = {x: boot_list[i].pos[0], y: boot_list[i].pos[1], z: boot_list[i].pos[2], height: boot_list[i].h, width: boot_list[i].w, length: boot_list[i].l};
    if(detect(a,b))
    {
      boot_list.splice(i,1);
      b1.splice(i,1);
      b2.splice(i,1);
      b3.splice(i,1);
      b4.splice(i,1);
      pl.boot=1;
      pl.boot_time = 300;
    }
  }
  for(i = 0;i<magnet_list.length;i++)
  {
    a = {x: pl.pos[0], y: pl.pos[1], z: pl.pos[2], height: pl.h, width: pl.w, length: pl.l};
    b = {x: magnet_list[i].pos[0], y: magnet_list[i].pos[1], z: magnet_list[i].pos[2], height: magnet_list[i].h, width: magnet_list[i].w, length: magnet_list[i].l};
    if(detect(a,b))
    {
      magnet_list.splice(i,1);
      m1.splice(i,1);
      m2.splice(i,1);
      m3.splice(i,1);
      pl.magnet=1;
      pl.magnet_time = 300;
    }
    if(pl.magnet_time>0)
    {
      for(j=0;j<coins_list.length;j++)
      {
        a = sq(pl.pos[0]-coins_list[j].pos[0]);
        b = sq(pl.pos[1]-coins_list[j].pos[1]);
        c = sq(pl.pos[2]-coins_list[j].pos[2]);
        d = Math.sqrt(a+b+c);
        if(d<=4.0)
        {
          val = 0.2;
          if(pl.pos[0]<coins_list[j].pos[0])
            coins_list[j].x_speed =-val;
          else if(pl.pos[0]>coins_list[j].pos[0])
            coins_list[j].x_speed = -val;
          
          if(pl.pos[1]<coins_list[j].pos[1])
            coins_list[j].y_speed =-val;

          if(pl.pos[2]<coins_list[j].pos[2])
            coins_list[j].z_speed = -val;
          else if(pl.pos[2]>coins_list[j].pos[2])
            coins_list[j].z_speed = -val;
        }
      }
    }
  }
  for(i=0;i<obs_list.length;i++)
  {
    a = {x: pl.pos[0], y: pl.pos[1], z: pl.pos[2], height: pl.h, width: pl.w, length: pl.l};
    b = { x: obs_list[i].pos[0], y: obs_list[i].pos[1], z: obs_list[i].pos[2], height: obs_list[i].h, width: obs_list[i].w, length: obs_list[i].l };
    if(detect(a,b))
    {
      end = 1;
    }
  }
}