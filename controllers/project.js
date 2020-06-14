'use strict'

var Project = require('../models/project');
var fs = require('fs');
var path = require('path');

var controller = {
	
	home: function(req, res){
		return res.status(200).send({
			message: 'Soy la home'
		});
	},

	test: function(req, res){
		return res.status(200).send({
			message: "Soy el metodo o accion test del controlador de project"
		});
	},

	saveProject: function(req, res){
		var project = new Project();

		var params = req.body;
		project.name = params.name;
		project.description = params.description;
		project.category = params.category;
		project.year = params.year;
		project.langs = params.langs;
		project.image = null;

		project.save((err, projectStored) => {
			if(err) return res.status(500).send({message: 'Error al guardar el documento.'});

			if(!projectStored) return res.status(404).send({message: 'No se ha podido guardar el proyecto.'});

			return res.status(200).send({project: projectStored});
		});
	},

	getProject: function(req, res){
		var projectId = req.params.id;

		if(projectId == null) return res.status(404).send({message: 'El proyecto no existe.'});

		Project.findById(projectId, (err, project) => {

			if(err) return res.status(500).send({message: 'Error al devolver los datos.'});

			if(!project) return res.status(404).send({message: 'El proyecto no existe.'});

			return res.status(200).send({
				project
			});

		});
	},

	getProjects: function(req, res){

		Project.find({}).sort('-year').exec((err, projects) => {

			if(err) return res.status(500).send({message: 'Error al devolver los datos.'});

			if(!projects) return res.status(404).send({message: 'No hay projectos que mostrar.'});

			return res.status(200).send({projects});
		});

	},

	updateProject: function(req, res){
		var projectId = req.params.id;
		var update = req.body;

		Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdated) => {
			if(err) return res.status(500).send({message: 'Error al actualizar'});

			if(!projectUpdated) return res.status(404).send({message: 'No existe el proyecto para actualizar'});

			return res.status(200).send({
				project: projectUpdated
			});
		});

	},

	deleteProject: function(req, res){
		var projectId = req.params.id;

		Project.findByIdAndRemove(projectId, (err, projectRemoved) => {
			if(err) return res.status(500).send({message: 'No se ha podido borrar el proyecto'});

			if(!projectRemoved) return res.status(404).send({message: "No se puede eliminar ese proyecto."});

			return res.status(200).send({
				project: projectRemoved
			});
		});
	},

	uploadImage: function(req, res){
		var projectId = req.params.id;
		var fileName = 'Imagen no subida...';

		if(req.file){

			console.log(req.file);
		
			var file_path = req.file.path;
		
			var file_split = file_path.split('\\');
		
			var fileName = file_split[1];
		
			var ext_split = req.file.originalname.split('\.');
		
			var file_ext = ext_split[1]
		
			if(file_ext== 'png' || file_ext== 'gif' || file_ext== 'jpg'){
		
			  Project.findByIdAndUpdate(projectId, {image:fileName}, (err, projectUpdated) => {
		
				if(!projectUpdated){
		
				  res.status(404).send({message: 'No se ha podido actualizar el album'});
		
				}else{
		
				  res.status(200).send({files: req.file});
		
				}
		
			  })
		
			}else{
		
			  res.status(200).send({message: 'Extension del archivo no valida'});
		
			}
		
			console.log(file_path);
		
		  }else{
		
			res.status(200).send({message: 'No has subido ninguna imagen..'});
		
		  }
		},

	getImageFile: function(req, res){
		var file = req.params.image;
		var path_file = './uploads/'+file;

		fs.exists(path_file, (exists) => {
			if(exists){
				return res.sendFile(path.resolve(path_file));
			}else{
				return res.status(200).send({
					message: "No existe la imagen..."
				});
			}
		});
	}

	

};

module.exports = controller;