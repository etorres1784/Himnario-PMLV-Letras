document.addEventListener('DOMContentLoaded', () => {
    const canciones = document.querySelectorAll('.cancion');
    const indice = document.getElementById('indice');
    const buscador = document.getElementById('buscador');
    const borrar = document.getElementById('borrar');

    // Crear botón y contenedor para volver al índice
    const volverBtn = document.createElement('button');
    volverBtn.textContent = '⬅️ Volver al índice';
    volverBtn.id = 'volver-indice';
    volverBtn.style.display = 'none';

    const contenedorVolver = document.createElement('div');
    contenedorVolver.style.textAlign = 'center';
    contenedorVolver.appendChild(volverBtn);
    document.querySelector('main').insertBefore(contenedorVolver, document.getElementById('contenido-canciones'));

    // Generar índice de canciones ordenado alfabéticamente
    const cancionesOrdenadas = Array.from(canciones).sort((a, b) => {
        const tituloA = a.dataset.titulo.toLowerCase();
        const tituloB = b.dataset.titulo.toLowerCase();
        return tituloA.localeCompare(tituloB);
    });

    cancionesOrdenadas.forEach(cancion => {
        const titulo = cancion.dataset.titulo;
        const nombreLimpio = titulo.replace(/_/g, '\u00A0'); // Espacios no separables
        const item = document.createElement('li');
        const enlace = document.createElement('a');
        enlace.href = `#${titulo}`;
        enlace.textContent = nombreLimpio;
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarCancion(titulo);
        });
        item.appendChild(enlace);
        indice.appendChild(item);
    });

    // Filtrar canciones según el texto del buscador
// Filtrar canciones según el texto del buscador (título o letra)
buscador.addEventListener('input', () => {
    const texto = buscador.value.toLowerCase();

    canciones.forEach(cancion => {
        const titulo = cancion.dataset.titulo.toLowerCase();
        const letra = cancion.innerText.toLowerCase();

        if (titulo.includes(texto) || letra.includes(texto)) {
            cancion.style.display = 'block';
        } else {
            cancion.style.display = 'none';
        }
    });
});

    // Mostrar solo la canción seleccionada
    function mostrarCancion(titulo) {
        canciones.forEach(cancion => {
            cancion.style.display = (cancion.dataset.titulo === titulo) ? 'block' : 'none';
        });
        indice.style.display = 'none';
        buscador.style.display = 'none';
        borrar.style.display = 'none';
        volverBtn.style.display = 'inline-block';
    }

    // Borrar búsqueda
    borrar.addEventListener('click', () => {
        buscador.value = '';
        canciones.forEach(cancion => {
            cancion.style.display = 'none';
        });
    });

    // Volver al índice
    volverBtn.addEventListener('click', () => {
        buscador.value = '';
        canciones.forEach(cancion => {
            cancion.style.display = 'none';
        });
        indice.style.display = 'block';
        buscador.style.display = 'inline-block';
        borrar.style.display = 'inline-block';
        volverBtn.style.display = 'none';
    });

    // Ocultar todas las canciones al inicio
    canciones.forEach(cancion => {
        cancion.style.display = 'none';
    });
});
