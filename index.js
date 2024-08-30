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





const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    insertarEmpleadosIniciales();

});