const express = require('express');
const app = express();


app.use(express.static('public'));



app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:false}));



const validarRouter = require('./Operaciones/registro');
app.use('/', validarRouter);

//RUTA PRINCIPAL
app.get("/", function(req,res){
    res.render("registro");
})





app.listen(3000, function(){
    console.log("Servidor creado");
})