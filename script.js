
 window. addEventListener ('load', function(){
    const canvas = document.getElementById ('canvas');
    const ctx = canvas.getContext ('2d');
    canvas.width=800; 
    canvas.height=800;

    //canvas settings
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.shadowColor='rgba(0,0,0,0,7)';
    ctx.shadowOffSetX=10;
    ctx.shadowOffSetY=5;
    ctx.shadowBlur=10;

    // effect settings
    let maxlevel=5;
    const branches=2;
    let sides=5;    
    let scale=0.5;
    let spread=0.5;
    let fractalColor='hsl('+ Math.random()* 360 +',100%,50%)';
     
    //controls
    const randomizeButton = document.getElementById('randomizeButton');
    const slider_spread=document.getElementById('spread');
    const sidesInput = document.getElementById('sides');
    const depthInput = document.getElementById('depth');    
    const slider_scale=document.getElementById('scale');
    const slider_width=document.getElementById('lineWidth');
    const saveAsGifButton = document.getElementById('saveAsGifButton');
    
   

    slider_spread.addEventListener('change', function(e){
        spread=e.target.value;
        updateSliderSpread();
        drawFractal();
    });

    sidesInput.addEventListener('input', function (e) {
        sides=e.target.value;
        updateSides();
        drawFractal(); 
    });
    
    depthInput.addEventListener('input', function (e) {
        maxlevel=e.target.value;
        updateDepth();
        drawFractal(); 
    });
    
    slider_scale.addEventListener('change', function(e){
        scale=e.target.value;
        updateSliderScale();
        drawFractal();
    });

    slider_width.addEventListener('change', function(e){
        ctx.lineWidth=e.target.value;
        updateSliderWidth();
        drawFractal();
    });

    randomizeButton.addEventListener('click', function(){
        randomizeFractal();
        updateSliderSpread();
        updateSides();
        updateDepth();
        updateSliderScale();
        updateSliderWidth();
        drawFractal();
    });
  
   /* function callFractal(){
        if (window.Worker) {
            const fractalWorker = new Worker('fractalWorker.js');
          
            fractalWorker.postMessage({
              canvasWidth: canvas.width,
              canvasHeight: canvas.height,
              maxLevel: maxlevel,
              branches: branches,
              sides: sides,
              scale: scale,
              spread: spread
            });
          
            fractalWorker.onmessage = function(e) {
                const points = e.data;
                
                // Use the points to draw on the canvas
                 ctx.clearRect(0, 0, canvas.width, canvas.height);
                    points.forEach(point => {
                    ctx.beginPath();
                    ctx.moveTo(point.x1, point.y1);
                    ctx.lineTo(point.x2, point.y2);
                    ctx.stroke();
                });
            };
        };
    };*/

saveAsGifButton.addEventListener('click', function () {

    let numberOfFrames=60;
    var encoder = new GIFEncoder();
    encoder.setRepeat(0); 
    encoder.setFrameRate(60); 
    encoder.setQuality(5);
    encoder.start();
    
    for (let i = 1; i <= numberOfFrames; i++) {
        spread=i*0.01;
        drawFractal(); 
        encoder.addFrame(ctx);
    }

    encoder.finish();
    encoder.download("download.gif");
});
  

function drawBranchRecursively(level, x = 0, y = 0, angle = 0, size = canvas.width < canvas.height ? canvas.width * 0.25 : canvas.height * 0.25) {
    if (level > maxlevel) {
      return;
    }
  
    ctx.beginPath();
    ctx.moveTo(x, y);
    const endX = x + Math.cos(angle) * size;
    const endY = y + Math.sin(angle) * size;
    ctx.lineTo(endX, endY);
    ctx.stroke();
  
    for (let i = 0; i < branches; i++) {
      const newAngle = angle + (i / (branches - 1)) * Math.PI * 2 * spread;
      drawBranch(
        level + 1,
        endX,
        endY,
        newAngle,
        size * scale
      );
    }
  }
  
function drawFractal(){
    console.time('FractalDrawing');
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx. save();
    ctx.strokeStyle = fractalColor;
    ctx. translate (canvas.width/2, canvas.height/2) ;
    for(let i=0; i<sides;i++){
       
        ctx.rotate((Math.PI*2)/sides); 
        drawBranchRecursively(0); 
    }
    ctx.restore();
    console.timeEnd('FractalDrawing');
}

    function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineWidth = lineWidth.value;
    ctx.lineCap = 'round';
    ctx.shadowColor='rgba(0,0,0,0,7)';
    ctx.shadowOffSetX=10;
    ctx.shadowOffSetY=5;
    ctx.shadowBlur=10;
    window.requestAnimationFrame(drawFractal);
}

    function randomizeFractal(){
     sides=Math.floor(Math.random()*18+2);    
     scale=Math.random()*0.2+0.4;
     spread=Math.random()*3+0.1;
     const red = Math.floor(Math.random() * 256);
     const green = Math.floor(Math.random() * 256);
     const blue = Math.floor(Math.random() * 256);
     const alpha= "0." + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 10).toString();
     fractalColor = `rgba(${red}, ${green}, ${blue},${alpha})`;  
     pickr.setColor(fractalColor);
     drawFractal();
    }
    

    function updateSliderSpread(){
        slider_spread.value=spread;
    }
    updateSliderSpread();

    function updateSides(){
        sidesInput.value=sides;
    }
    updateSides();

    function updateDepth(){
        depthInput.value=maxlevel;
    }
    updateDepth();

    function updateSliderScale(){
        slider_scale.value=scale;
    } 
    updateSliderScale();

    function updateSliderWidth(){
        slider_width.value=ctx.lineWidth;
    } 
    updateSliderWidth();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('load', resizeCanvas);


    //COLOR PICKER

    const colorPicker = document.getElementById('colorPicker');

    const pickr = Pickr.create({
        el: colorPicker,
        theme: 'nano',
        showAlways:true,
        autoReposition: false,
        useAsButton: true,
        
    
        components: {
    
            // Main components
            preview: true,
            opacity: true,
            hue: true,
    
            // Input / output Options
            interaction: {
                hex: false,
                rgba: false,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: false,
                clear: false,
                save: false
            }
        },
    });

    pickr.on('change', (color) => {
        const selectedColor = color.toHEXA().toString();
        colorPicker.value = selectedColor;
        fractalColor=selectedColor;
        drawFractal();
    });

});