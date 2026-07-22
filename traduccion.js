document.addEventListener('DOMContentLoaded', function () {

  /* =============================================
     CARGAR ARCHIVO DE TRADUCCIONES
     ============================================= */
  async function cargarTraduccion(lang) {

    // Más adelante puedes hacer:
    // fetch(`traducciones/${lang}.json`)
    // Por ahora sigue cargando el mismo archivo.
    const response = await fetch('traduccion.json');
    return await response.json();

  }


  /* =============================================
     OBTENER VALOR DESDE UNA RUTA
     Ej:
     "inicio.title"
     "contacto.section-title"
     ============================================= */
  function obtenerValor(obj, ruta) {

    return ruta.split('.').reduce((acc, key) => {

      if (!acc) return undefined;

      return acc[key];

    }, obj);

  }


  /* =============================================
     APLICAR TODAS LAS TRADUCCIONES
     Funciona tanto para:
     - Objetos normales
     - Arrays
     ============================================= */
/* =============================================
   APLICAR TODAS LAS TRADUCCIONES
   Funciona para:
   - Objetos normales
   - Arrays (timeline, proyectos, etc.)
   - Panels de habilidades
   ============================================= */
function aplicarTraducciones(traducciones) {

  document.querySelectorAll("[data-i18n]").forEach(elemento => {

    const ruta = elemento.dataset.i18n;

    // ¿El elemento pertenece a un array?
    const contenedor = elemento.closest("[data-i18n-index]");

    /* =============================================
       ARRAYS
       ============================================= */
    if (contenedor) {

      const indice = Number(contenedor.dataset.i18nIndex);

      const partes = ruta.split(".");
      const propiedad = partes.pop();

      /* =============================================
         CASO ESPECIAL:
         habilidades.panels.items.*
         ============================================= */
      if (
        partes.length === 3 &&
        partes[0] === "habilidades" &&
        partes[1] === "panels" &&
        partes[2] === "items"
      ) {

        // Obtiene el panel donde está el elemento
        // (panel-web, panel-cms, panel-creativas...)
        const panel = elemento.closest(".skills-panel");

        if (!panel) return;

        const panelId = panel.id;

        const item =
          traducciones.habilidades.panels[panelId]
          ?.items[indice];

        if (item && item[propiedad] !== undefined) {
          elemento.textContent = item[propiedad];
        }

        return;
      }

      /* =============================================
         RESTO DE ARRAYS
         timeline
         proyectos
         inspiración
         card-segments
         buttons
         etc.
         ============================================= */

      const rutaArray = partes.join(".");
      const array = obtenerValor(traducciones, rutaArray);

      if (Array.isArray(array)) {

        const item = array[indice];

        if (item && item[propiedad] !== undefined) {
          elemento.textContent = item[propiedad];
        }

      }

      return;
    }
/* =============================================
   PANELS (counter)
   ============================================= */

if (ruta === "habilidades.panels.counter") {

    const panel = elemento.closest(".skills-panel");

    if (!panel) return;

    const panelId = panel.id;

    const valor =
        traducciones.habilidades.panels[panelId]?.counter;

    if (valor !== undefined) {
        elemento.textContent = valor;
    }

    return;
}
    /* =============================================
       OBJETOS NORMALES
       ============================================= */

    const valor = obtenerValor(traducciones, ruta);

    if (valor !== undefined) {
      elemento.textContent = valor;
    }

  });

}



  /* =============================================
     CAMBIAR IDIOMA
     ============================================= */

  const btnIdioma = document.getElementById('btn-idioma');

  if (btnIdioma) {

    btnIdioma.addEventListener('click', () => {

      const actual = localStorage.getItem('idioma') || 'es';

      localStorage.setItem(
        'idioma',
        actual === 'es' ? 'en' : 'es'
      );

      location.reload();

    });

  }



  /* =============================================
     CARGAR TRADUCCIÓN SI EL IDIOMA ES INGLÉS
     ============================================= */

  const idiomaGuardado = localStorage.getItem('idioma') || 'es';

  if (idiomaGuardado === 'en') {

    cargarTraduccion('en').then(traducciones => {

      console.log('JSON cargado:', traducciones);

      aplicarTraducciones(traducciones);

      document.title = traducciones.title;

    });

  }

});