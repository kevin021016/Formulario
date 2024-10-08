const express = require('express');
const conexion = require('../config/db');

const router = express.Router();


const regex = new RegExp('^[a-zA-Z\\sáéíóúÁÉÍÓÚñÑ]*$'); //Esta expresión regular solo acepta letras minúsculas o mayúsculas, además de la letra ñ y letras con tilde
const regex_correo = new RegExp(/^(?=.{1,255}$)(?=.*@.{1,64}$)[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/); //Esta expresión valida la longitud mínima y máxima del correo, 64 carácteres antes del @ y 255 después
//VALIDAR QUE LA EXPRESIÓN REGULAR ACEPTE TILDES
const bcrypt = require('bcryptjs');
const longitud_contrasena_encriptada = 10;

let nombres
let apellido_paterno
let apellido_materno
let telefono
let correo
let contrasena

//Este get funciona para darles un valor vacío a los campos a la hora de cargar la página
router.get("/", function (req, res) {
    res.render('registro', {
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        telefono: '',
        correo: '',
        contrasena: '',
        error_telefono: '',
        error_contrasena: ''
    });
});





router.post("/", function (req, res) {
    const datos = req.body;
    const errores = {};

    //Si los datos ingresados 
    nombres = datos.nombres || '';
    apellido_paterno = datos.apellido_paterno || '';
    apellido_materno = datos.apellido_materno || '';
    telefono = datos.telefono || '';
    correo = datos.correo || '';
    contrasena = datos.contrasena || '';


    // Validar si el correo ya está en uso antes de cualquier otra validación
    let buscar = "SELECT * FROM tabla_usuarios WHERE correo = ?";
    conexion.query(buscar, [correo], function (error, row) {
        if (error) {
            throw error;
        } else if (row.length > 0) {
            errores.error_correo = "Este correo ya está en uso.";
        }

        /*if(datos.nombres == '' || datos.apellido_paterno == '' || datos.apellido_materno === null || datos.telefono == '' || datos.correo == '' || datos.contrasena == ''){
            errores.error_formulario = "Hubo un problema al intentar registrarse";
        }*/

        /*TODO: 
        * SERIE DE IF QUE VALIDEN SI LOS CAMPOS ESTÁN VACÍOS. SE NECESITA UNA VARIABLE ERROR PARA CADA CAMPO
        * SERIE DE IF QUE VALIDEN CARACTERES NUMERICOS O ESPECIALES EN CAMPOS DE TEXTO*/
        if (nombres.length == 0) {
            errores.error_nombres = "Este campo es obligatorio.";
        }

        if (apellido_paterno.length == 0) {
            errores.error_apellido_paterno = "Este campo es obligatorio.";
        }

        if (correo.length == 0) {
            errores.error_correo = "Este campo es obligatorio.";
        }

        if (contrasena.length == 0) {
            errores.error_contrasena = "Este campo es obligatorio.";
        }

        //SERIE DE IF QUE VALIDAN SI LOS CAMPOS DE TEXTO CONTIENEN SOLO LETRAS
        if (regex.test(nombres) == false) {
            errores.error_nombres = "El nombre no puede contener números o carácteres especiales.";
        }

        if (regex.test(apellido_paterno) == false) {
            errores.error_apellido_paterno = "El apellido no puede contener números o carácteres especiales.";
        }

        if (regex.test(apellido_materno) == false) {
            errores.error_apellido_materno = "El apellido no puede contener números o carácteres especiales.";
        }

        // Validar número de teléfono
        if (telefono.length !== 10) {
            errores.error_telefono = "El número de teléfono debe tener 10 dígitos.";
            if (telefono.length == 0) {
                errores.error_telefono = "Este campo es obligatorio.";
            }

        }
        if (isNaN(telefono)) { //isNaN valida que el campo solo contega carácteres numéricos
            errores.error_telefono = "Se debe ingresar solo números.";
        }


        //Validar longitud mínima de la contraseña
        if (contrasena.length < 8 && contrasena.length > 0) {
            errores.error_contrasena = "La contraseña debe tener un mínimo de 8 caracteres.";
        }

        //Validar la longitud máxima de los campos
        if (nombres.length > 30) {
            errores.error_nombres = "El nombre no puede tener m[as de 30 carácteres.";
        }

        if (apellido_paterno.length > 30) {
            errores.error_apellido_paterno = "El apellido no puede tener más de 30 carácteres.";
        }

        if (apellido_materno.length > 30) {
            errores.error_apellido_materno = "El apellido no puede tener más de 30 carácteres.";
        }

        if (contrasena.length > 100) {
            errores.error_contrasena = "La contraseña no puede contener más de 100 carácteres.";
        }

        //Validar la estrucutura del correo
        if (regex_correo.test(correo) == false) {
            errores.error_correo = "La estructura del correo no es valida";
        }

        //Si el atributop "name" de los inputs no están presentes en la solicitud post, indicar error.
        if (!datos.nombres && typeof datos.nombres === 'undefined') {
            errores.error_nombres = "Campo Nombres no presente en la solicitud."
        }

        if (!datos.apellido_paterno && typeof datos.apellido_paterno === 'undefined') {
            errores.error_apellido_paterno = "Campo Apellido paterno no presente en la solicitud."
        }

        if (!datos.apellido_materno && typeof datos.apellido_materno === 'undefined') {
            errores.error_apellido_materno = "Campo Apellido materno no presente en la solicitud."
        }

        if (!datos.telefono && typeof datos.telefono === 'undefined') {
            errores.error_telefono = "Campo Teléfno no presente en la solicitud."
        }

        if (!datos.correo && typeof datos.correo === 'undefined') {
            errores.error_correo = "Campo Correo no presente en la solicitud."
        }

        if (!datos.contrasena && typeof datos.contrasena === 'undefined') {
            errores.error_contrasena = "Campo Contraseña no presente en la solicitud."
        }

        // Si hay errores, renderizar la página con los errores
        if (Object.keys(errores).length > 0) {
            return res.render('registro', {
                error_nombres: errores.error_nombres,
                error_apellido_paterno: errores.error_apellido_paterno,
                error_apellido_materno: errores.error_apellido_materno,
                error_telefono: errores.error_telefono,
                error_correo: errores.error_correo,
                error_contrasena: errores.error_contrasena,
                error_formulario: errores.error_formulario,
                nombres: nombres,
                apellido_paterno: apellido_paterno,
                apellido_materno: apellido_materno,
                telefono: telefono,
                correo: correo,
                contrasena: contrasena
            });
        }



        const contrasena_encriptada = bcrypt.hashSync(contrasena, longitud_contrasena_encriptada); //Encriptr contraseña para almacenarla posteriormente en la bd

        // Si no hay errores, proceder con la inserción en la base de datos
        let registrar = "INSERT INTO tabla_usuarios (nombres, apellido_paterno, apellido_materno, telefono, correo, contrasena) VALUES (?, ?, ?, ?, ?, ?)";
        conexion.query(registrar, [nombres, apellido_paterno, apellido_materno, telefono, correo, contrasena_encriptada], function (error) {
            if (error) {
                throw error;
            } else {
                console.log("Datos almacenados correctamente");
                res.redirect('/?registro=exitoso');
            }
        });



    });
});

module.exports = router;

