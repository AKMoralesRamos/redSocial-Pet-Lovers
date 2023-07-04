/* import { async } from 'regenerator-runtime'; */

import {
  newPost, /*  getData, */ logoutSesion, deletePost, subscribeToDataChanges,
} from './feed.controller';

const feed = {
  loadHTML: () => `<main id="pageAllContent">
  <header id="feedHeader">
      <div id="feedLogoContent">
          <img id="feedLogo" src="imgfeed/logo-eslogan.png" alt="Logotype">
      </div>
     
      <span class="material-symbols-outlined" id="logoutfeed">move_item</span>
  </header>
  <section id="feedAllContent">
      <aside id="feedAside">
          <div id="feedMenu"><span class="material-symbols-menu">
                  menu
              </span>
              
          </div>
          <section id="feedProfile">
              <div id="feedProfileImageContent"><img id="feedProfileImage" src="imgfeed/perfilFoto.jpg"
                      alt="Foto de perfil"></div>
              <h2 id="feedNameProfile">Liliana Vega</h2>
            
              <h3 id="feedWelcome">¡Bienvenid@!</h3>
              <p id="feedIntroduction">En <span class="feedNameLogo">Pet Lovers...</span>
                  encuentra a tu
                  mascota
                  perdida, ríete de los reyes del hogar u ofrece servicios relacionados.
              </p>
             
          </section>
      </aside>
      <section id="feedScroll">
          <div id="randomImages">
              <p id="adoptionLetter">Y si adoptas un nuevo mejor amigo? Por fis...</p>
              <div class="randomAbeja"><img id="randomAbeja" src="imgfeed/abejita.png" alt="Abejita"></div>
              <div class="randomDog"><img id="randomDog" src="imgfeed/perritove.png" alt="Perrito"></div>
          </div>
         

          <section id="newPost">
              <h4 class="newPost">Crear nueva publicación</h4>
              <input type="text" id="feedNewPost" placeholder="Cuéntanos,  ¿Qué quieres compartir?...">
              <div class="botones">
                  <button id="publish" type="submit">Publicar</button>
                  <button id="cancel" type="submit">Cancelar</button>
              </div>
          </section>
          <div id="feedScrollContent"></div>
      </section>
</main>`,

  loadEvents: async () => {
    const clearInput = () => {
      document.getElementById('feedNewPost').value = '';
    };

    const logout = document.getElementById('logoutfeed');
    logout.addEventListener('click', () => {
      try {
        logoutSesion(); // Caducar token
        // Eliminar token
        localStorage.removeItem('accessToken');
        //* / Redireccionamiento del usuario al login
        window.history.pushState({}, '', `${window.location.origin}/`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      } catch (error) {
        console.error('Error during logout:', error);
      }
    });

    const renderNewElement = (data) => {
      console.log(data);
      const feedContainer = document.getElementById('feedScrollContent');
      const newDiv = document.createElement('div');
      const parrafo = document.createElement('p');
      parrafo.textContent = data.publicacion;

      const likeEditDeleteDiv = document.createElement('div');
      likeEditDeleteDiv.id = 'likeEditDelete';
      const spanLike = document.createElement('span');
      spanLike.className = 'material-symbols-like';
      spanLike.textContent = 'favorite';
      const spanEdit = document.createElement('span');
      spanEdit.className = 'material-symbols-edit';
      spanEdit.textContent = 'edit_square';
      const spanDelete = document.createElement('span');
      spanDelete.className = 'material-symbols-delete';
      spanDelete.setAttribute('data-id', data.id);
      console.log(data.id);
      spanDelete.textContent = 'delete';

      likeEditDeleteDiv.appendChild(spanLike);
      likeEditDeleteDiv.appendChild(spanEdit);
      likeEditDeleteDiv.appendChild(spanDelete);

      parrafo.appendChild(likeEditDeleteDiv);

      newDiv.appendChild(parrafo);

      feedContainer.insertBefore(newDiv, feedContainer.firstChild);

      spanEdit.addEventListener('click', () => {

      });

      spanDelete.addEventListener('click', () => {
        // Crear el modal
        const modal = document.createElement('div');
        modal.id = 'modalEliminar';
        modal.innerHTML = `
          <h3>¿En serio quieres eliminar tu publicación?</h3>
          <button id="cancelarEliminar" type="button">Cancelar</button>
          <button id="aceptarEliminar" type="button">Aceptar</button>
        `;
        // Crear el HTML donde el botón de aceptar tenga el id del doc
        // Agregar el modal al documento
        document.body.appendChild(modal);

        // Mostrar el modal
        modal.style.display = 'block';

        // Cerrar el modal al hacer clic en el botón de cancelar
        const cancelarEliminarBtn = document.getElementById('cancelarEliminar');
        cancelarEliminarBtn.addEventListener('click', () => {
          const traerModal = document.getElementById('modalEliminar');
          traerModal.parentNode.removeChild(traerModal);
          console.log(traerModal);
        });

        const aceptarEliminarBtn = document.getElementById('aceptarEliminar');
        aceptarEliminarBtn.setAttribute('data-id', data.id);
        aceptarEliminarBtn.addEventListener('click', (event) => {
          const traerModal = document.getElementById('modalEliminar');
          traerModal.parentNode.removeChild(traerModal);
          const docId = event.currentTarget.getAttribute('data-id');
          console.log(docId);
          deletePost(docId);
        });
      });
    };
    // Debo de imprimir en consola el id del doc que debo corrar al hacer click
    /*   deletePost(); */
    document.getElementById('publish').addEventListener('click', async () => {
      const obtenerRelleno = document.getElementById('feedNewPost').value;
      if (obtenerRelleno.length !== 0) {
        await newPost({ publicacion: obtenerRelleno });
        /*  console.log(obtenerRelleno);
        renderNewElement({ publicacion: obtenerRelleno });  */
        // Agrega el nuevo elemento al principio
        clearInput(); // Limpia el contenido del campo de entrada
      }
    });

    const actualizarFeed = (data) => {
      const feedContainer = document.getElementById('feedScrollContent');
      feedContainer.innerHTML = '';
      data.forEach((item) => {
        renderNewElement({ publicacion: item.publicacion, id: item.id });
      });
    };

    subscribeToDataChanges(actualizarFeed);
  },
};

export default feed;
