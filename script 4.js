function prioridadCompas(compas) {
  if (compas === '6/8') return 0;
  if (compas === '3/4') return 1;
  return 2;
}

function ordenarClavesEspecial(claves) {
  return claves.sort((a, b) => {
    const pa = prioridadCompas(a);
    const pb = prioridadCompas(b);
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const canciones = document.querySelectorAll('.cancion');
  const indice = document.getElementById('indice');
  const buscador = document.getElementById('buscador');
  const borrar = document.getElementById('borrar');

  const volverBtn = document.createElement('button');
  volverBtn.textContent = '⬅️ Volver al índice';
  volverBtn.id = 'volver-indice';
  volverBtn.style.display = 'none';

  const contenedorVolver = document.createElement('div');
  contenedorVolver.style.textAlign = 'center';
  contenedorVolver.appendChild(volverBtn);
  document.querySelector('main').insertBefore(contenedorVolver, document.getElementById('contenido-canciones'));

  const opcionesOrden = document.createElement('div');
  opcionesOrden.id = 'opciones-orden';
  opcionesOrden.style.textAlign = 'center';
  opcionesOrden.style.marginBottom = '20px';
  opcionesOrden.innerHTML = `
    <button onclick="generarIndice('compas')">🕒 Agrupar por Compás</button>
    <button onclick="generarIndice('ritmo')">🎵 Agrupar por Ritmo</button>
    <button onclick="generarIndice('tono')">🎼 Agrupar por Tono</button>
    <button onclick="generarIndice('nombre')">🔤 Ordenar por Nombre</button>
  `;
  indice.parentNode.insertBefore(opcionesOrden, indice);

  window.generarIndice = function (criterio = 'nombre') {
    indice.innerHTML = '';
    const grupos = {};
    canciones.forEach(cancion => {
      const encabezado = cancion.querySelector('.encabezado');
      const titulo = cancion.dataset.titulo;
      const nombre = encabezado.querySelector('h3')?.textContent.trim() || titulo;
      const tonoText = Array.from(encabezado.querySelectorAll('p')).find(p => p.textContent.includes('Tono:'));
      const ritmoText = Array.from(encabezado.querySelectorAll('p')).find(p => p.textContent.includes('Ritmo:'));
      const bpmText = Array.from(encabezado.querySelectorAll('p')).find(p => p.textContent.includes('BPM:'));
      const compasText = Array.from(encabezado.querySelectorAll('p')).find(p => p.textContent.includes('Compas:'));

      const tonoRaw = tonoText ? tonoText.textContent.replace('Tono:', '').trim() : 'SinTono';
      const tono = tonoRaw.length === 1 ? tonoRaw + ' ' : tonoRaw;
      const ritmo = ritmoText ? ritmoText.textContent.replace('Ritmo:', '').trim() : 'SinRitmo';
      const ritmoAlineado = ritmo.padEnd(10, ' ');
      const bpm = bpmText ? bpmText.textContent.replace('BPM:', '').trim().padStart(3, '0') : '';
      const compas = compasText ? compasText.textContent.replace('Compas:', '').trim() : '';

      const nombreFormateado = `[ ${compas} ${ritmoAlineado} ${tono} ${bpm}bpm] ${nombre.replace(/_/g, ' ')}`;
      const clave = criterio === 'ritmo' ? ritmo : criterio === 'tono' ? tono : criterio === 'compas' ? compas : 'Todas';

      if (!grupos[clave]) grupos[clave] = [];
      grupos[clave].push({ titulo, nombre: nombre.replace(/_/g, ' '), tono, bpm, compas, ritmo, nombreFormateado });
    });

    const clavesOrdenadas = ordenarClavesEspecial(Object.keys(grupos));
    clavesOrdenadas.forEach(clave => {
      const h3 = document.createElement('h3');
      h3.textContent = clave;
      indice.appendChild(h3);

      const ul = document.createElement('ul');
      let cancionesOrdenadas = grupos[clave].sort((a, b) => a.nombre.localeCompare(b.nombre));

      cancionesOrdenadas.forEach(cancion => {
        const li = document.createElement('li');
        const enlace = document.createElement('a');
        enlace.href = `#${cancion.titulo}`;
        enlace.textContent = cancion.nombreFormateado;
        enlace.addEventListener('click', e => {
          e.preventDefault();
          mostrarCancion(cancion.titulo);
        });
        li.appendChild(enlace);
        ul.appendChild(li);
      });

      indice.appendChild(ul);
    });
  };

  buscador.addEventListener('input', () => {
    const texto = buscador.value.toLowerCase();
    canciones.forEach(cancion => {
      const titulo = cancion.dataset.titulo.toLowerCase();
      const letra = cancion.innerText.toLowerCase();
      const coincide = titulo.includes(texto) || letra.includes(texto);
      cancion.style.display = coincide ? 'block' : 'none';
    });

    const entradasIndice = indice.querySelectorAll('li');
    entradasIndice.forEach(li => {
      const textoEnlace = li.textContent.toLowerCase();
      li.style.display = textoEnlace.includes(texto) ? 'list-item' : 'none';
    });

    const ritmos = indice.querySelectorAll('h3');
    ritmos.forEach(h3 => {
      let siguiente = h3.nextElementSibling;
      let visibles = false;
      while (siguiente && siguiente.tagName !== 'H3') {
        if (siguiente.tagName === 'UL' && siguiente.style.display !== 'none') {
          visibles = true;
          break;
        }
        siguiente = siguiente.nextElementSibling;
      }
      h3.style.display = visibles ? 'block' : 'none';
    });
  });

  function mostrarCancion(titulo) {
    canciones.forEach(cancion => {
      cancion.style.display = (cancion.dataset.titulo === titulo) ? 'block' : 'none';
    });
    indice.style.display = 'none';
    buscador.style.display = 'none';
    borrar.style.display = 'none';
    volverBtn.style.display = 'inline-block';
    document.getElementById('opciones-orden').style.display = 'none';
  }

  borrar.addEventListener('click', () => {
    buscador.value = '';
    canciones.forEach(cancion => {
      cancion.style.display = 'none';
    });
    indice.style.display = 'block';
    buscador.style.display = 'inline-block';
    borrar.style.display = 'inline-block';
    volverBtn.style.display = 'none';
    document.getElementById('opciones-orden').style.display = 'block';
    const entradasIndice = indice.querySelectorAll('li, h3, ul');
    entradasIndice.forEach(el => {
      el.style.display = 'block';
    });
  });

  volverBtn.addEventListener('click', () => {
    buscador.value = '';
    canciones.forEach(cancion => {
      cancion.style.display = 'none';
    });
    indice.style.display = 'block';
    buscador.style.display = 'inline-block';
    borrar.style.display = 'inline-block';
    volverBtn.style.display = 'none';
    document.getElementById('opciones-orden').style.display = 'block';
    const entradasIndice = indice.querySelectorAll('li, h3, ul');
    entradasIndice.forEach(el => {
      el.style.display = 'block';
    });
  });

  canciones.forEach(cancion => {
    cancion.style.display = 'none';
  });

  generarIndice('nombre'); // 👈 Carga inicial ordenada por nombre
});
