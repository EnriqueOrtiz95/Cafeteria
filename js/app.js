(function(){
    
    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');
    //?TAMBIEN PUEDES UTILIZAR window.onload
    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
        console.log('hay va..')

        if(window.indexedDB.open('cafeteria', 1)){
            obtenerClientes();
        }
        listadoClientes.addEventListener('click', eliminarRegistro);
    })

    //?ELIMINAR
    function eliminarRegistro(e){
        if(e.target.classList.contains('eliminar')){
            // console.log('Diste click en eliminar');
            const idEliminar = Number(e.target.dataset.cliente); //*data-cliente

            
            const confirmar = confirm('Deseas eliminar este cliente?');
            // const confirmar = Swal.fire('Deseas eliminar este cliente?');

            if(confirmar){
                const transaction = DB.transaction(['cafeteria'], 'readwrite');

                const objectStore = transaction.objectStore('cafeteria');

                objectStore.delete(idEliminar);

                transaction.oncomplete = function(){
                    //?ESTE SE VA AL ELEMENTO PADRE Y DESDE ALLI ELIMINAMOS EL ELEMENTO
                    e.target.parentElement.parentElement.remove();
                    
                    alert('Cliente eliminado');
                }
                transaction.onerror = function(){
                    console.log('Hubo un error en la eliminacion');
                }
            }
            // console.log(idEliminar);
        }
    }

    //?TODO< CREAR LA DB DE INDEXEDB
    function crearDB(){
        const crearDB = window.indexedDB.open('cafeteria', 1);

        crearDB.onerror = function(){
            console.log('Hubo un error');
        };

        crearDB.onsuccess = function(){
            DB = crearDB.result;
        };

        crearDB.onupgradeneeded = function(e){
            const db = e.target.result; //?ES EL RESULTADO QUE EJECUTA LA FUNCION

            const objectStore = db.createObjectStore('cafeteria', {
                keyPath: 'id',
                autoIncrement: true
            });

                                //*  name,      keypath
            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('personas', 'personas', {unique: false});
            objectStore.createIndex('hora', 'hora', {unique: false});
            objectStore.createIndex('fecha', 'fecha', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('DB lista y creada');
        }

    }

    //*ESTE ES EL R DE "READ";
    function obtenerClientes(){
        const abrirConexion = window.indexedDB.open('cafeteria', 1);

        abrirConexion.onerror = function (){
            console.log('hubo un error');
        };
        
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;

            const objectStore = DB.transaction('cafeteria').objectStore('cafeteria');
        
            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                    // console.log(cursor.value);
                    const { nombre, email, personas, hora, fecha, id} = cursor.value;

                    listadoClientes.innerHTML +=  
                    `                    
                    <tr>
                        <td class="">
                            <p class="texto-innerHTML"> ${nombre} </p>
                        </td>
                        <td class="">
                            <p class="texto-innerHTML"> ${email} </p>
                        </td>
                        <td class="">
                            <p class="texto-innerHTML">${personas}</p>
                        </td>
                        <td class="">    
                            <p class="texto-innerHTML">${hora}</p>
                        </td>
                        <td class="">    
                            <p class="texto-innerHTML">${fecha}</p>
                        </td>
                        <td class="d-flex gap-2 d-lg-table-cell">
                            <a href="editar-cliente.html?id=${id}" class="txtEditar mr-3">Editar</a>
                            <a href="#" data-cliente="${id}" class="txtEliminar eliminar">Eliminar</a>
                        </td>
                    </tr>
                    `;

                    cursor.continue();
                }else{
                    console.log('No hay mas registros');
                }
            }

        }
    }
})();







































// const modalImagen = document.querySelector('#modal-imagen');

// if(modalImagen){
//     modalImagen.addEventListener('show.bs.modal', function(event){
//         const enlace = event.relatedTarget;
//         const rutaImagen = enlace.getAttribute('data-bs-imagen');
        
//         //construir la imagen
//         const imagen = document.createElement('IMG');
//         imagen.src = `img/${rutaImagen}.jpg`;
//         imagen.classList.add('img-fluid');
//         imagen.alt = 'Imagen Galeria';
    
//         const contenidoModal = document.querySelector('.modal-body');
//         contenidoModal.appendChild(imagen);
    
//         console.log(imagen);
//     });
    
//     modalImagen.addEventListener('hidden.bs.modal', function(){
//         const contenidoModal = document.querySelector('.modal-body');
//         contenidoModal.textContent = '';
//     });
// }

// (function () {
//     'use strict'
  
//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     var forms = document.querySelectorAll('.needs-validation')
  
//     // Loop over them and prevent submission
//     Array.prototype.slice.call(forms)
//       .forEach(function (form) {
//         form.addEventListener('submit', function (event) {
//           if (!form.checkValidity()) {
//             event.preventDefault()
//             event.stopPropagation()
//           }
  
//           form.classList.add('was-validated')
//         }, false)
//       })
//   })()