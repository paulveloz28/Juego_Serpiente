
    // 1. Capturamos el canvas y su contexto de dibujo
    const canvas = document.getElementById("canvasJuego");
    const ctx = canvas.getContext("2d");

    const TAMANIO_CELDA = 25;

    let serpiente = [
      {x:14,y:13},
      {x:14,y:14},
      {x:14,y:15},
      {x:14,y:16}
    ]

    let intervaloSerpiente;
    let direccionActual="derecha";

    let comida = {x:5, y:5};
    let puntaje = 0;
    let juegoTerminado = false;
    let velocidadSerpiente = 300;
    let velocidad = 700;
    
    let tiempo = 0;
    let temporizador;
    let pausado = false;

    let record = localStorage.getItem("record") || 0;
    document.getElementById("record").innerText = record;
    localStorage.removeItem("record");

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
      if((serpiente[0].x+2)*TAMANIO_CELDA > canvas.width){
        gameOver()
        return;
      }
      nuevoElemento.x = serpiente[0].x+1
      nuevoElemento.y = serpiente[0].y

      serpiente.unshift(nuevoElemento)
      serpiente.pop()
      
    }

    function moverIzquierda(){
      let nuevoElemento = {x:0, y:0}
      if((serpiente[0].x-1)*TAMANIO_CELDA < 0){
        gameOver()
        return;
      }
      nuevoElemento.x = serpiente[0].x-1
      nuevoElemento.y = serpiente[0].y

      serpiente.unshift(nuevoElemento)
      serpiente.pop()
      
    }

    function moverAbajo(){
      let nuevoElemento = {x:0, y:0}
      if((serpiente[0].y+2)*TAMANIO_CELDA > canvas.height){
        gameOver()
        return;
      }
      nuevoElemento.x = serpiente[0].x
      nuevoElemento.y = serpiente[0].y+1

      serpiente.unshift(nuevoElemento)
      serpiente.pop()
      
    }

    function moverArriba(){
      let nuevoElemento = {x:0, y:0}
      if((serpiente[0].y-1)*TAMANIO_CELDA < 0){
        gameOver()
        return;
      }
      nuevoElemento.x = serpiente[0].x
      nuevoElemento.y = serpiente[0].y-1

      serpiente.unshift(nuevoElemento)
      serpiente.pop()
      
    }

    function iniciarJuego(){
       iniciarTemporizador();
      intervaloSerpiente=setInterval(moverSerpiente, velocidad - velocidadSerpiente)
      cambiarEstado("Jugando")
     
    }

    function pausarJuego(){
      pausado = !pausado;
      //clearInterval(intervaloSerpiente)
      //cambiarEstado("Descanzando")

      if(pausado){

        clearInterval(intervaloSerpiente);
        clearInterval(temporizador);

        cambiarEstado("Pausado");

      }else{

        clearInterval(intervaloSerpiente);

        intervaloSerpiente = setInterval(
            moverSerpiente,
            velocidad - velocidadSerpiente
        );

        iniciarTemporizador();

        cambiarEstado("Jugando");

      }
    }

    function moverSerpiente(){
      let atrapada = comidaAtrapada()
      
      if(juegoTerminado){
        return
      }
      
      switch(direccionActual){
        case"derecha": 
          moverDerecha()
          
           break;
        case"izquierda": 
          moverIzquierda()
          
           break;
        case"abajo": 
          moverAbajo() 
           
           break;
        case"arriba": 
          moverArriba() 
         
           break;
      }
      if(atrapada){ 
        //serpiente.unshift(nuevoElemento) 
        serpiente.push(comida)
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
      if(puntaje % 2 == 0 && velocidadSerpiente <= 600){
        velocidadSerpiente += 50;
        clearInterval(intervaloSerpiente)
        intervaloSerpiente = setInterval(moverSerpiente, velocidad -  velocidadSerpiente);
      }
      document.getElementById("puntaje").innerText = puntaje

      if(puntaje > record){
        record = puntaje;

        localStorage.setItem("record",record);

        document.getElementById("record").innerText = record;
        let mensaje=document.getElementById("mensaje");

        mensaje.innerText="🎉 ¡Nuevo récord!";

        clearTimeout(window.temporizadorMensaje);

        window.temporizadorMensaje=setTimeout(function(){

          if(!juegoTerminado){

            mensaje.innerText="Sigue jugando y supera tu marca";

          }

        },2000);
      }
    }

    function cambiarEstado(estado){
      document.getElementById("estado").innerText = estado
    }

    function gameOver(){
      juegoTerminado = true
      cambiarEstado("Game Over")
    }

    function reiniciarJuego(){
      limpiarCanvas()
      dibujarTablero2()
      serpiente = [
        {x:14,y:13},
        {x:14,y:14},
        {x:14,y:15},
        {x:14,y:16}
      ]
      dibujarSerpiente()
      //puntaje = 0;
      direccionActual = "derecha"
      cambiarEstado("Listo");
      juegoTerminado = false;
      comida={x:5, y:5}
      dibujarComida()
      velocidadSerpiente = 300;
      document.getElementById("puntaje").innerText = 0
      puntaje = 0;

      clearInterval(temporizador);
      tiempo=0;
      document.getElementById("tiempo").innerText="0 s";

      clearInterval(intervaloSerpiente) 
    }
    
    function iniciarTemporizador(){
    clearInterval(temporizador);
    temporizador = setInterval(function(){
        tiempo++;
        document.getElementById("tiempo").innerText =
        tiempo + " s";
    },1000);
}