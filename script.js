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

  const grupos = {};
  canciones.forEach(cancion => {
    const encabezado = cancion.querySelector('.encabezado');
    const titulo = cancion.dataset.titulo;
    const nombre = encabezado.querySelector('h3')?.textContent.trim() || titulo;

    const tonoText = Array.from(encabezado.querySelectorAll('p')).find(p => p.textContent.includes('Tono:'));
    const ritmoText = Array.from(encabezado.querySelectorAll('p')).find(p => p.textContent.includes('Ritmo:'));
    const bpmText = Array.from(encabezado.querySelectorAll('p')).find(p => p.textContent.includes('BPM:'));
    const compasText = Array.from(encabezado.querySelectorAll('p')).find(p => p.textContent.includes('Compas:'));

    const tono = tonoText ? tonoText.textContent.replace('Tono:', '').trim() : 'SinTono';
    const ritmo = ritmoText ? ritmoText.textContent.replace('Ritmo:', '').trim() : 'SinRitmo';
    let bpm = bpmText ? bpmText.textContent.replace('BPM:', '').trim() : '';
    const compas = compasText ? compasText.textContent.replace('Compas:', '').trim() : '';

    bpm = bpm.padStart(3, '0');
    const nombreFormateado = `[${bpm}BPM-${compas}-${tono}] ${nombre}`;

    if (!grupos[ritmo]) grupos[ritmo] = {};
    if (!grupos[ritmo][tono]) grupos[ritmo][tono] = [];
    grupos[ritmo][tono].push({ titulo, nombre: nombreFormateado });
  });

  const ritmosOrdenados = Object.keys(grupos).sort();
  ritmosOrdenados.forEach(ritmo => {
    const h3 = document.createElement('h3');
    h3.textContent = ritmo;
    indice.appendChild(h3);

    const tonosOrdenados = Object.keys(grupos[ritmo]).sort();
    tonosOrdenados.forEach(tono => {
      const ul = document.createElement('ul');
      grupos[ritmo][tono]
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .forEach(cancion => {
          const li = document.createElement('li');
          const enlace = document.createElement('a');
          enlace.href = `#${cancion.titulo}`;
          enlace.textContent = cancion.nombre.replace(/_/g, '\u00A0');
          enlace.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarCancion(cancion.titulo);
          });
          li.appendChild(enlace);
          ul.appendChild(li);
        });
      indice.appendChild(ul);
    });
  });

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
      const coincide = textoEnlace.includes(texto);
      li.style.display = coincide ? 'list-item' : 'none';
    });

    const tonos = indice.querySelectorAll('h4');
    tonos.forEach(h4 => {
      const ul = h4.nextElementSibling;
      if (ul && ul.tagName === 'UL') {
        const visibles = Array.from(ul.children).some(li => li.style.display !== 'none');
        h4.style.display = visibles ? 'block' : 'none';
        ul.style.display = visibles ? 'block' : 'none';
      }
    });

    const ritmos = indice.querySelectorAll('h3');
    ritmos.forEach(h3 => {
      let siguiente = h3.nextElementSibling;
      let visibles = false;
      while (siguiente && siguiente.tagName !== 'H3') {
        if ((siguiente.tagName === 'H4' || siguiente.tagName === 'UL') && siguiente.style.display !== 'none') {
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

    const entradasIndice = indice.querySelectorAll('li, h3, h4, ul');
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

    const entradasIndice = indice.querySelectorAll('li, h3, h4, ul');
    entradasIndice.forEach(el => {
      el.style.display = 'block';
    });
  });

  canciones.forEach(cancion => {
    cancion.style.display = 'none';
  });
});
