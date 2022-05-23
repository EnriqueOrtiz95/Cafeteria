(function(){
    let DB;
    const formulario = document.querySelector('#formulario');
    const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        // console.log('todo bien');

        
        formulario.addEventListener('submit', validarCliente);
    })

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('cafeteria', 1);
    
        abrirConexion.onerror = function(){
            console.log('Hubo un error');
        };
    
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        }
    
    }
    function validarCliente(e){
        e.preventDefault();

        //?LEER TODOS LOS INPUT
        const nombre = document.querySelector('#nombre').value;
        const personas = document.querySelector('#personas').value;
        const hora = document.querySelector('#hora').value;
        const fecha = document.querySelector('#fecha').value;
        const email = document.querySelector('#email').value;

        // const current = moment().startOf('min').fromNow();
        // const range = moment().add(1, 'months').calendar();
    
        // if(!(fecha >= current || fecha <= range)){
        //     imprimirAlerta('Su reserva debe estar en un rango de 30 dias', 'error');
        //     return;
        // }

        if(!er.test(email)){
            imprimirAlerta('Correo no valido', 'error');
            return;
        }
        if(nombre === '' || email === '' || personas === '' || hora === '' || fecha === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        //? CREAR UN OBJECT CON LA INFORMACIÓN
        const cliente = {
            //* recordando: nombre = nombre : nombre, debido al object literal.
            nombre, email, personas, hora, fecha, id: Date.now()
        }
        // console.log(cliente);
        setTimeout(() => {
            crearNuevoCliente(cliente);
        }, 1000);
    }

    function crearNuevoCliente(cliente){
        const transaction = DB.transaction(['cafeteria'], 'readwrite');
        const objectStore = transaction.objectStore('cafeteria'); //?ESTE HACE LAS ACCIONES, RECORDAR BRO

        objectStore.add(cliente);

        transaction.onerror = function(){
            // console.log('hubo un error');
            imprimirAlerta('Hubo un error', 'error');
        }

        transaction.oncomplete = function(){
            // console.log('cliente agregado');

            imprimirAlerta('El cliente se ha agregado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html' //?REDIR A index.html
            }, 3000);
        }
    }

    function imprimirAlerta(mensaje, tipo){
        
        const alerta = document.querySelector('.alerta');
    
        if(!alerta){ //* SI NO HAY ALERTA PREVIA, ENTONCES MOSTRAR LA ALERTA RECIENTE
            //?CREAR LA ALERTA
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto',
            'mt-5', 'text-center', 'border', 'alerta');
    
            if(tipo === 'error'){
                divMensaje.classList.add('alerta-roja');
            }else{
                divMensaje.classList.add('alerta-verde');
            }
    
            divMensaje.textContent = mensaje;
    
            formulario.appendChild(divMensaje);
    
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    
    }
})();