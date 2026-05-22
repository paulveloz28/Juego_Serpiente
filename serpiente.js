
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

    let intervaloSerpiente;
    let direccionActual="derecha";

    let comida = {x:5, y:5};

    let puntaje = 0;

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
      dibujarComida();
      dibujarSerpiente();
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

    function moverDerecha(){
      let nuevoElemento = {x:0, y:0}
      if((serpiente[0].x+2)*TAMANIO_CELDA > canvas.width)
        return;
      nuevoElemento.x = serpiente[0].x+1
      nuevoElemento.y = serpiente[0].y

      serpiente.unshift(nuevoElemento)
      serpiente.pop()
      
    }

    function moverIzquierda(){
      let nuevoElemento = {x:0, y:0}
      if((serpiente[0].x-1)*TAMANIO_CELDA < 0)
        return;
      nuevoElemento.x = serpiente[0].x-1
      nuevoElemento.y = serpiente[0].y

      serpiente.unshift(nuevoElemento)
      serpiente.pop()
      
    }

    function moverAbajo(){
      let nuevoElemento = {x:0, y:0}
      if((serpiente[0].y+2)*TAMANIO_CELDA > canvas.height)
        return;
      nuevoElemento.x = serpiente[0].x
      nuevoElemento.y = serpiente[0].y+1

      serpiente.unshift(nuevoElemento)
      serpiente.pop()
      
    }

    function moverArriba(){
      let nuevoElemento = {x:0, y:0}
      if((serpiente[0].y-1)*TAMANIO_CELDA < 0)
        return;
      nuevoElemento.x = serpiente[0].x
      nuevoElemento.y = serpiente[0].y-1

      serpiente.unshift(nuevoElemento)
      serpiente.pop()
      
    }

    function iniciarJuego(){
      intervaloSerpiente=setInterval(moverSerpiente,300)
    }

    function pausarJuego(){
      clearInterval(intervaloSerpiente)
    }

    function moverSerpiente(){
      let atrapada = comidaAtrapada()
      let nuevoElemento = {x: serpiente[0].x, y: serpiente[0].y}
      //console.log("moviendo")
      switch(direccionActual){
        case"derecha": 
          moverDerecha()
          nuevoElemento.x++
           break;
        case"izquierda": 
          moverIzquierda()
          nuevoElemento.x--
           break;
        case"abajo": 
          moverAbajo() 
          nuevoElemento.y++ 
           break;
        case"arriba": 
          moverArriba() 
          nuevoElemento.y--
           break;
      }
      if(atrapada){ 
        serpiente.unshift(nuevoElemento) 
        aumentarPuntaje()
        generarNuevaPosicionComida()
      }
      dibujarTodo()
      console.log(comidaAtrapada())
    }
    
    function cambiarDireccion(direccion){
      direccionActual = direccion
      
    }

    function dibujarComida(){
      pintarCoordenada(comida.x, comida.y, "green");
    }

    function generarNuevaPosicionComida(){
      comida.x = Math.floor(Math.random()*(canvas.width/TAMANIO_CELDA));
      comida.y = Math.floor(Math.random()*(canvas.height/TAMANIO_CELDA));
    }

    function comidaAtrapada(){
      if(comida.x == serpiente[0].x && serpiente[0].y == comida.y)
        return true;
      else 
        return false; 
    }

    function aumentarPuntaje(){
      puntaje++
      document.getElementById("puntaje").innerText = puntaje
    }