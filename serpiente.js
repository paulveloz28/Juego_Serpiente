
    // 1. Capturamos el canvas y su contexto de dibujo
    const canvas = document.getElementById("canvasJuego");
    const ctx = canvas.getContext("2d");

    const TAMANIO_CELDA = 25;

    const serpiente = [
      {x:14,y:13},
      {x:14,y:14},
      {x:14,y:15},
      {x:14,y:16}
    ]

    dibujarTablero = function(){
      ctx.strokeStyle = "#FCFCFC";
      ctx.beginPath();//Empieza a dibujar en el canva
      ctx.moveTo(0,0);//Posicion inicial desde Donde vamos a dibujar
      ctx.lineTo(100,100);//Hasta donde dibuja
      ctx.stroke();//Pinta contorno
    }

    dibujarTablero2 = function(){
      for(let i=0; i<canvas.width; i+=TAMANIO_CELDA){
        ctx.strokeStyle = "#FCFCFC";
        ctx.beginPath();//Empieza a dibujar en el canva
        ctx.moveTo(i,0);//Posicion inicial desde Donde vamos a dibujar
        ctx.lineTo(i,canvas.height);//Hasta donde dibuja
        ctx.stroke();//Pinta contorno
      }
      for(let i=0; i<canvas.height; i+=TAMANIO_CELDA){
        ctx.strokeStyle = "#FCFCFC";
        ctx.beginPath();//Empieza a dibujar en el canva
        ctx.moveTo(0,i);//Posicion inicial desde Donde vamos a dibujar
        ctx.lineTo(canvas.width, i);//Hasta donde dibuja
        ctx.stroke();//Pinta contorno
      }
      dibujarNumerosEnY();
      dibujarNumerosEnX();
    }

    // Primera pintura del juego al cargar la página
    dibujarTodo();

    // =========================
    // FUNCIONES DE DIBUJO
    // =========================

    function limpiarCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function dibujarTodo() {
      limpiarCanvas();
      dibujarTablero2();
      //pintarCoordenada(10,2);
      dibujarSerpiente()
      //pintarCoordenada(5,5);
      //pintarCoordenada(15,25);
      //pintarCoordenada(25,15);
      //pintarCoordenada(0,21);
      //pintarCoordenada(25,25);
    }

    function dibujarNumerosEnY(){
      ctx.fillStyle="white"
      ctx.font="12px Arial"
      let contador = 0;
      for(let y = 0; y <= canvas.height; y += TAMANIO_CELDA){
        ctx.fillText(contador,5,y+12)
        contador++
      }
    } 

    function dibujarNumerosEnX(){
      ctx.fillStyle="white"
      ctx.font="12px Arial"
      let contador = 0;
      for(let x = 0; x <= canvas.width; x += TAMANIO_CELDA){
        ctx.fillText(contador,x+2,12)
        contador++
      }
    }

    //Parte 1
    function pintarCoordenada(x,y,color){
      let posicionX = x * TAMANIO_CELDA
      let posicionY = y * TAMANIO_CELDA
      if(posicionX < canvas.width && posicionY < canvas.height){
      ctx.fillStyle = color
      //ctx.strokeStyle = "yellow"
      ctx.fillRect(posicionX, posicionY, TAMANIO_CELDA, TAMANIO_CELDA);
      ctx.strokeStyle = "red"
      ctx.strokeRect(posicionX, posicionY, TAMANIO_CELDA, TAMANIO_CELDA);
      }
    }

    function dibujarSerpiente(){
      let colorCabeza = "red"
      for(let i = 0; i < serpiente.length; i++){
        let serp = serpiente[i];
        if(i == 0){
         pintarCoordenada(serp.x, serp.y, colorCabeza) 
        }else{
         pintarCoordenada(serp.x, serp.y, "yellow")
        }
        
      }
    }