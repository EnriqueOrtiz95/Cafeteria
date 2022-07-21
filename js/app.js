(function(){

    let sorted = false;
    let DB;
    const btnOrdenar = document.querySelector('.btn-ordenar');
    const listadoClientes = document.querySelector('#listado-clientes');
    //?TAMBIEN PUEDES UTILIZAR window.onload
    document.addEventListener('DOMContentLoaded', () => {

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
                        <td class="d-flex gap-2 flex-wrap d-lg-table-cell">
                            <a href="editar-cliente.html?id=${id}" class="txtEditar mr-3">Editar</a>
                            <a href="#" data-cliente="${id}" class="txtEliminar eliminar">Eliminar</a>
                        </td>
                    </tr>
                    `;

                    // fechas.push(new Date(fecha));
                    cursor.continue();
                }else{
                    console.log('No hay mas registros');
                    // fechas.sort((a,b) => a - b)
                    // console.log(fechas);
                    
                }
            }
        }
    }
    btnOrdenar.addEventListener('click', function(e){
        e.preventDefault();
        if(!(this.classList.contains('active'))){
            const abrirConexion = window.indexedDB.open('cafeteria', 1);
            abrirConexion.onerror = function (){
                console.log('hubo un error');
            };
            
            abrirConexion.onsuccess = function(){
                DB = abrirConexion.result;

                const objectStore = DB.transaction('cafeteria').objectStore('cafeteria');
                
                let idx = objectStore.index('fecha')
                let getReq = idx.getAll();
                getReq.onsuccess = function(e){
                    let cursor = e.target.result;
                    if(cursor){
                        // console.log(cursor.value.fecha)
                        // console.log(cursor.value);
                        listadoClientes.innerHTML = cursor.map(curs => {
                            const { nombre, email, personas, hora, fecha, id} = curs;
                            return `                    
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
                                <td class="d-flex gap-2 flex-wrap d-lg-table-cell">
                                    <a href="editar-cliente.html?id=${id}" class="txtEditar mr-3">Editar</a>
                                    <a href="#" data-cliente="${id}" class="txtEliminar eliminar">Eliminar</a>
                                </td>
                            </tr>
                            ` 
                        })  
                    }else{
                        console.log('No hay mas registros');
                    }
                }
            }
            this.classList.toggle('active');
            this.textContent = 'Desordenar ↔';
        }
        else{
            listadoClientes.innerHTML = '';
            obtenerClientes();
            this.classList.toggle('active');
            this.textContent = 'Ordenar por fecha';
        }
    })    

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