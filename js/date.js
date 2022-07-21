let today = new Date().toISOString().slice(0,10);
let date = new Date(new Date().setMonth(new Date().getMonth()+1)).toISOString().slice(0,10);
document.querySelector('#fecha').min = today
document.querySelector('#fecha').max = date;