document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // Obtener el selector de color y los botones para lápiz, línea, DDA y Bresenham
    var colorPicker = document.getElementById('colorPicker');
    var pencilBtn = document.getElementById('pencilBtn');
    var lineBtn = document.getElementById('lineBtn');
    var ddaBtn = document.getElementById('ddaButton');
    var bresenhamBtn = document.getElementById('bresenhamButton');

    // Arreglo para almacenar las líneas dibujadas
    var lines = [];

    // Bandera para saber si se está dibujando actualmente
    var isDrawing = false;

    // Modo actual de dibujo 
    var mode = 'pencil';

    // Eventos de ratón para el canvas
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    // Eventos de clic para los botones
    pencilBtn.addEventListener('click', function() {
        // Cambiar al modo lápiz y reiniciar las líneas
        mode = 'pencil';
        isDrawing = false;
        lines = [];
    });

    lineBtn.addEventListener('click', function() {
        // Cambiar al modo línea y detener el dibujo actual
        mode = 'line';
        isDrawing = false;
    });

    ddaBtn.addEventListener('click', function() {
        // Cambiar al modo DDA
        mode = 'dda';
        isDrawing = false;
    });

    bresenhamBtn.addEventListener('click', function() {
        // Cambiar al modo Bresenham
        mode = 'bresenham';
        isDrawing = false;
    });

    // Manejador de eventos para el clic del mouse
    function handleMouseDown(event) {
        if (mode === 'pencil') {
            // Comenzar el dibujo con el lápiz
            startPencilDrawing(event);
        } else if (mode === 'line') {
            // Comenzar el dibujo de una línea recta
            startLineDrawing(event);
        } else if (mode === 'dda') {
            // Comenzar el dibujo con el algoritmo DDA
            startDDADrawing(event);
        } else if (mode === 'bresenham') {
            // Comenzar el dibujo con el algoritmo Bresenham
            startBresenhamDrawing(event);
        }
    }

    // Manejador de eventos para el movimiento del mouse
    function handleMouseMove(event) {
        if (mode === 'pencil' && isDrawing) {
            // Continuar el dibujo con el lápiz
            continuePencilDrawing(event);
        } else if (mode === 'line' && isDrawing) {
            // Continuar el dibujo de la línea recta
            continueLineDrawing(event);
        } else if (mode === 'dda' && isDrawing) {
            // Continuar el dibujo con el algoritmo DDA
            continueDDADrawing(event);
        } else if (mode === 'bresenham' && isDrawing) {
            // Continuar el dibujo con el algoritmo Bresenham
            continueBresenhamDrawing(event);
        }
    }

    // Manejador de eventos para soltar el clic del mouse
    function handleMouseUp(event) {
        if (mode === 'pencil' && isDrawing) {
            // Detener el dibujo con el lápiz
            stopDrawing();
        } else if (mode === 'line' && isDrawing) {
            // Detener el dibujo de la línea recta
            stopLineDrawing(event);
        } else if (mode === 'dda' && isDrawing) {
            // Detener el dibujo con el algoritmo DDA
            stopDDADrawing(event);
        } else if (mode === 'bresenham' && isDrawing) {
            // Detener el dibujo con el algoritmo Bresenham
            stopBresenhamDrawing(event);
        }
    }

    // Comienza el dibujo con el lápiz
    function startPencilDrawing(event) {
        isDrawing = true;
        // Obtener la posición inicial del mouse
        var startPoint = getMousePos(canvas, event);
        // Agregar una nueva línea al arreglo de líneas
        lines.push({ type: 'pencil', points: [startPoint] });
    }

    // Continúa el dibujo con el lápiz
    function continuePencilDrawing(event) {
        // Obtener la posición actual del mouse
        var currentPoint = getMousePos(canvas, event);
        // Agregar el punto actual a la última línea en el arreglo
        lines[lines.length - 1].points.push(currentPoint);
        // Dibujar todas las líneas actuales
        drawPencil(lines);
    }

    // Comienza el dibujo de una línea recta
    function startLineDrawing(event) {
        isDrawing = true;
        // Obtener la posición inicial del mouse
        var startPoint = getMousePos(canvas, event);
        // Agregar una nueva línea al arreglo de líneas
        lines.push({ type: 'line', points: [startPoint] });
    }

    // Continúa el dibujo de la línea recta
    function continueLineDrawing(event) {
        // Obtener la posición actual del mouse
        lines[lines.length - 1].points[1] = getMousePos(canvas, event);
        // Dibujar todas las líneas actuales
        drawLine(lines);
    }

    // Comienza el dibujo con el algoritmo DDA
    function startDDADrawing(event) {
        isDrawing = true;
        // Obtener la posición inicial del mouse
        var startPoint = getMousePos(canvas, event);
        // Agregar una nueva línea al arreglo de líneas
        lines.push({ type: 'dda', points: [startPoint] });
    }

    // Continúa el dibujo con el algoritmo DDA
    function continueDDADrawing(event) {
        // Obtener la posición actual del mouse
        lines[lines.length - 1].points[1] = getMousePos(canvas, event);
        // Dibujar todas las líneas actuales
        drawDDALine(lines);
    }

    // Comienza el dibujo con el algoritmo Bresenham
    function startBresenhamDrawing(event) {
        isDrawing = true;
        // Obtener la posición inicial del mouse
        var startPoint = getMousePos(canvas, event);
        // Agregar una nueva línea al arreglo de líneas
        lines.push({ type: 'bresenham', points: [startPoint] });
    }

    // Continúa el dibujo con el algoritmo Bresenham
    function continueBresenhamDrawing(event) {
        // Obtener la posición actual del mouse
        lines[lines.length - 1].points[1] = getMousePos(canvas, event);
        // Dibujar todas las líneas actuales
        drawBresenhamLine(lines);
    }

    // Detiene el dibujo actual
    function stopDrawing() {
        isDrawing = false;
    }

    // Detiene el dibujo de la línea recta
    function stopLineDrawing(event) {
        // Detener el dibujo y guardar la línea actual
        isDrawing = false;
        lines[lines.length - 1].points[1] = getMousePos(canvas, event);
        // Dibujar todas las líneas actuales
        drawLine(lines);
        // Agregar una nueva línea vacía al arreglo para la próxima línea recta
        lines.push({ type: 'line', points: [] });
    }

    // Detiene el dibujo con el algoritmo DDA
    function stopDDADrawing(event) {
        // Detener el dibujo y guardar la línea actual
        isDrawing = false;
        lines[lines.length - 1].points[1] = getMousePos(canvas, event);
        // Dibujar todas las líneas actuales
        drawDDALine(lines);
        // Agregar una nueva línea vacía al arreglo para el próximo algoritmo DDA
        lines.push({ type: 'dda', points: [] });
    }

    // Detiene el dibujo con el algoritmo Bresenham
    function stopBresenhamDrawing(event) {
        // Detener el dibujo y guardar la línea actual
        isDrawing = false;
        lines[lines.length - 1].points[1] = getMousePos(canvas, event);
        // Dibujar todas las líneas actuales
        drawBresenhamLine(lines);
        // Agregar una nueva línea vacía al arreglo para el próximo algoritmo Bresenham
        lines.push({ type: 'bresenham', points: [] });
    }

    // Dibuja todas las líneas dibujadas con el lápiz
    function drawPencil(lines) {
        // Limpiar el lienzo antes de dibujar nuevamente
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Iterar sobre todas las líneas
        for (var i = 0; i < lines.length; i++) {
            var color = colorPicker.value;
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            var points = lines[i].points;

            // Iniciar el trazado del lápiz
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            // Conectar todos los puntos con líneas
            for (var j = 1; j < points.length; j++) {
                ctx.lineTo(points[j].x, points[j].y);
            }

            // Dibujar el trazado
            ctx.stroke();
        }
    }

    // Dibuja todas las líneas rectas dibujadas
    function drawLine(lines) {
        // Limpiar el lienzo antes de dibujar nuevamente
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Iterar sobre todas las líneas
        for (var i = 0; i < lines.length; i++) {
            var color = colorPicker.value;
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = 5;
            var points = lines[i].points;

            // Si hay dos puntos, dibujar la línea recta entre ellos
            if (points.length === 2) {
                var x1 = points[0].x;
                var y1 = points[0].y;
                var x2 = points[1].x;
                var y2 = points[1].y;

                var deltaX = x2 - x1;
                var deltaY = y2 - y1;
                var steps = Math.max(Math.abs(deltaX), Math.abs(deltaY));

                for (var t = 0; t <= steps; t++) {
                    var x = x1 + t * (deltaX / steps);
                    var y = y1 + t * (deltaY / steps);
                    // Dibujar un píxel en cada punto de la línea
                    ctx.fillRect(x, y, 2, 2);
                }
            }
        }
    }

    // Dibuja la línea utilizando el algoritmo DDA
    function drawDDALine(lines) {
        // Limpiar el lienzo antes de dibujar nuevamente
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Iterar sobre todas las líneas
        for (var i = 0; i < lines.length; i++) {
            var color = colorPicker.value;
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            var points = lines[i].points;

            // Si hay dos puntos, dibujar la línea recta entre ellos usando DDA
            if (points.length === 2) {
                var x1 = points[0].x;
                var y1 = points[0].y;
                var x2 = points[1].x;
                var y2 = points[1].y;

                var dx = x2 - x1;
                var dy = y2 - y1;
                var steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

                var xIncrement = dx / steps;
                var yIncrement = dy / steps;

                var x = x1;
                var y = y1;

                // Dibujar un píxel en cada punto de la línea usando el algoritmo DDA
                for (var k = 0; k < steps; k++) {
                    ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
                    x += xIncrement;
                    y += yIncrement;
                }
            }
        }
    }

    // Dibuja la línea utilizando el algoritmo de Bresenham
    function drawBresenhamLine(lines) {
        // Limpiar el lienzo antes de dibujar nuevamente
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Iterar sobre todas las líneas
        for (var i = 0; i < lines.length; i++) {
            var color = colorPicker.value;
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            var points = lines[i].points;

            // Si hay dos puntos, dibujar la línea recta entre ellos usando Bresenham
            if (points.length === 2) {
                var x0 = points[0].x;
                var y0 = points[0].y;
                var x1 = points[1].x;
                var y1 = points[1].y;

                var dx = Math.abs(x1 - x0);
                var dy = Math.abs(y1 - y0);
                var sx = (x0 < x1) ? 1 : -1;
                var sy = (y0 < y1) ? 1 : -1;
                var err = dx - dy;

                while (true) {
                    ctx.fillRect(x0, y0, 2, 2);

                    if (x0 === x1 && y0 === y1) break;
                    var e2 = 2 * err;
                    if (e2 > -dy) {
                        err -= dy;
                        x0 += sx;
                    }
                    if (e2 < dx) {
                        err += dx;
                        y0 += sy;
                    }
                }
            }
        }
    }

    // Función para obtener la posición del mouse relativa al canvas
    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    // Manejador de eventos para el cambio de color
    colorPicker.addEventListener('change', function() {
        var color = colorPicker.value;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
    });
});