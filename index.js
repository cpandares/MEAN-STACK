'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3700;

mongoose.Promise = global.Promise;
//Conexion en local
//mongoose.connect('mongodb://localhost:27017/portafolio')

//conexion en la nube
mongoose.connect('mongodb+srv://user:8*QDYs63qDtL=a6@portafolio-i5phl.mongodb.net/portafolio?retryWrites=true&w=majority')
        .then(() => {
        	console.log("Conexión a la base de datos establecida satisfactoriamente...");

        	// Creacion del servidor
        	app.listen(port, () => {
        		console.log("Servidor corriendo correctamente en la url: localhost:3700");
        	});

        })
        .catch(err => console.log(err));