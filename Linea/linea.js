document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    // Obtener el selector de color y los botones para lápiz y línea
    var colorPicker = document.getElementById('colorPicker');
    var pencilBtn = document.getElementById('pencilBtn');
    var lineBtn = document.getElementById('lineBtn');

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

    // Manejador de eventos para el clic del mouse
    function handleMouseDown(event) {
        if (mode === 'pencil') {
            // Comenzar el dibujo con el lápiz
            startPencilDrawing(event);
        } else if (mode === 'line') {
            // Comenzar el dibujo de una línea recta
            startLineDrawing(event);
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

    // Obtener la posición del mouse en el lienzo
    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
});

