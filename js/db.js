(function(){
    
    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
    })
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
})()
