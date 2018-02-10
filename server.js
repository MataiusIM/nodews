const express = require('express'); //Agrego Express
const hbs = require('hbs'); //Agrego Handlebars
const fs = require('fs');

//Para que funcione en Heroku lo hago para que ellos asignen el puerto automaticamente
var port = process.env.PORT || 3000; 

//Creo una aplicacion Express
var app = express();

//Le digo a hbs que voy a usar Partials e indico la ruta.
hbs.registerPartials(__dirname + '/views/partials');

//Express permite agregar mas cosas.. le digo que voy a usar a handlebars como view engine. KEY VALUE format
app.set('view engine', 'hbs');

//Agrego otro middleware (con next le digo que este middleware termino)
app.use((req, res, next)=>{
    var log = `Server time: ${new Date().toString()} ${req.method} url: ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
       if(err){
        console.log(err);
       }
    });
    next();
});

//Creo un middleware de mantenimiento
// app.use((req, res, next)=>{
//     res.render('maintenance');
//     next();
// });

//Agregamos Middleware. Siempre al final asi que no bypasea al mantenimiento
app.use(express.static(__dirname + '/public')); //Estoy diciendo que aca hay contenido estatico. http://localhost:3000/help.html


//Con Handlebars puedo registrar funciones que se ejecutan cuando se renderiza el template.
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

//Registro otro helper que acepta argumentos:
hbs.registerHelper('capitalizeIt', (text) => {
    return text.toUpperCase();
});

//Empiezo a setear las rutas
//1) ruta al root y la funcion que devuelve el contenido.
app.get('/', (req, res) => {
    //res.send('<h1>Hello Express</h1>'); //Mando HTML Content-Type:text/html;
    
    //res.send({  title: 'Activities',  Types: ['bike', 'swim', 'run']   }); //Mando JSON y Express solo cambia el header Type Content-Type:application/json;

    res.render('welcome.hbs', {
        pageTitle: 'Welcome Page',
        //currentYear: new Date().getFullYear(), La comento porque registre un Helper con la funcion.
        name: 'Matias'
    }); 
});


//2) Creo otra ruta.
app.get('/about', (req, res) => {
    //res.send('Sobre Nosotros');
    res.render('about.hbs', {
        pageTitle: 'About Page',
              //currentYear: new Date().getFullYear(), La comento porque registre un Helper con la funcion.
    });
});


//3) Ruta a errores
app.get('/error', (req, res) => {
    res.send({
        errorCode: 500,
        errorMessage: 'There was a problem with your request'
    });
});


//4) Creo otra ruta a proyectos
app.get('/projects', (req, res) => {
    //res.send('Sobre Nosotros');
    res.render('projects.hbs', {
        pageTitle: 'Projects Page',
              //currentYear: new Date().getFullYear(), La comento porque registre un Helper con la funcion.
    });
});


//Indico el puerto en donde escucha la app.
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`)
});