(function(){
    let DB;
    let idCliente; //* LO SACAMOS DEL SCOPE PARA PODERLO ASIGNAR TANTO PARA VERIFICAR EL ID
    //* TANTO PARA ACTUALIZAR EL CLIENTE.

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const personasInput = document.querySelector('#personas');
    const fechaInput = document.querySelector('#fecha');
    const horaInput = document.querySelector('#hora');

    const formulario = document.querySelector('#formulario');
    const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // const given = moment("2022-06-23", "YYYY-MM-DD");
    // const current = moment().startOf('day');

    //Difference in number of days
    // const difference = moment.duration(given.diff(current)).asDays();

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();


        //?ACTUALIZA EL REGISTRO
        formulario.addEventListener('submit', actualizarCliente);

        //?VERIFICAR EL ID DE LA URL
        const parametrosURL = new URLSearchParams(window.location.search)
    
        idCliente = parametrosURL.get('id');
        if(idCliente){
            
            //TODO< ESTE SETTIMEOUT ES NECESARIO PORQUE LA CONEXION DE LA DB TARDA
            //* EN SER CREADA Y POR ENDE NO EXISTIRIA EL ID CON LA BUSQUEDA DEL URL,
            //* POR LO TANTO HACEMOS QUE SE RETRASE PARA ASI NO HAYA PROBLEMAS.

            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 1000);
            
        }
        // console.log(idCliente);
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
    function obtenerCliente(id){
        // const transaction = DB.transaction(['cafeteria'], 'readwrite');
        const transaction = DB.transaction(['cafeteria'], 'readwrite');
        const objectStore = transaction.objectStore('cafeteria');

        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(e){
            const cursor = e.target.result;

            if(cursor){
                // console.log(cursor.value);
                //?TRAER EL REGISTRO ACTUAL
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
        // console.log(objectStore);
    }
    
    function llenarFormulario(datosCliente){
        const { nombre, email, personas, fecha, hora } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        personasInput.value = personas;
        fechaInput.value = fecha;
        horaInput.value = hora;
    }

    function actualizarCliente(e){
        e.preventDefault();
        
        if(!er.test(emailInput.value)){
            imprimirAlerta('Correo no valido','error');
            return;
        }
        if(nombreInput.value === '' || emailInput === '' || !fechaInput.value || !personasInput.value || !horaInput.value){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        //?ACTUALIZAR CLIENTE
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            personas: personasInput.value,
            fecha: fechaInput.value,
            hora: horaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['cafeteria'], 'readwrite');
        const objectStore = transaction.objectStore('cafeteria');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function(){
            imprimirAlerta('Editado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html' //? REGRESAR AL Index
            }, 3000);
        }

        transaction.onerror = function(){
            imprimirAlerta('Hubo un error', 'error');
        }

        // console.log(clienteActualizado);
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