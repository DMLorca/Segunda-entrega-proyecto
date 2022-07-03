const {Producto, Carritos} = require('./contenedor/dao/index.js');
const express = require('express');
const req = require('express/lib/request');
const app = express();

const prodRouter = express.Router();
const carroRouter = express.Router();

let moduloP = require('./clases/Contenedor.js');
let moduloC = require('./clases/Contenedor_carrito.js');
let contenedor = new moduloP.Contenedor('./filesystem/productos.txt');
let contenedor_carrito = new moduloC.Contenedor_carrito('./filesystem/carrito.txt');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/productos', prodRouter);
app.use('/api/carrito', carroRouter);
app.use((req,res,next) => {
    res.status(404).send({error: 'Error de ruta'});
})

const autenticacion = (req,res,next) => {
    req.user = {
        nombre: "Diego",
        isAdmin: true
    };
    next();
}
const autorizacion = (req,res,next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(401).send("Usuario no autorizado");
    }
}

//GET'/:id' = Lista todos los productos con id=0
//ACTUALIZADO
prodRouter.get('/:id',autenticacion, (req, res) => {
    const prodId = parseInt(req.params.id);

    if(prodId == 0){
        Producto.getAll().then((prod) => {
            res.send(prod);
        });
    } else {
        Producto.getByIdProd(prodId).then(result => {
        if(result){
            res.send(result);
        }else
            res.status(400).send({error: 'Producto no encontrado'});
    });
    }
});

//POST '/' = Incorpora productos
//ACTUALIZADO
prodRouter.post('/',autenticacion, autorizacion, (req, res) => {
    const {title, description, code, stock, price, thumbnail} = req.body;
    const date = new Date();
    const objFecha = {
        dia: date.getDate(),
        mes: date.getMonth() + 1,
        anio: date.getFullYear(),
        hs: date.getHours(),
        min: date.getMinutes()
    }
    const obj = {
        'title': title,
        "description": description,
        "code": code,
        "timestamp": `[${objFecha.dia}/${objFecha.mes}/${objFecha.anio} ${objFecha.hs}:${objFecha.min}]`,
        "stock": stock,
        'price': price,
        'thumbnail': thumbnail
    }

    async function ejecutarSave(argObj) {
        const prod = await Producto.addProd(argObj);
        res.send(prod);
    }
    ejecutarSave(obj); 
});

//PUT '/:id' = Actualiza producto
//ACTUALIZADO
prodRouter.put('/:id',autenticacion, autorizacion, (req, res) => {
    const prodId = parseInt(req.params.id);
    const {title, description, code, stock, price, thumbnail} = req.body;

    const date = new Date();
    const objFecha = {
        dia: date.getDate(),
        mes: date.getMonth() + 1,
        anio: date.getFullYear(),
        hs: date.getHours(),
        min: date.getMinutes()
    }

    const timestamp = `[${objFecha.dia}/${objFecha.mes}/${objFecha.anio} ${objFecha.hs}:${objFecha.min}]`;
    
    const ejecutarFuncion = async () => {

        const state = await Producto.updateByIdProd(prodId, title, description, code, timestamp, stock, price, thumbnail);
        console.log(state)
        if (state == null) {
            res.status(400).send({ error: 'Producto no encontrado' });
        } else {
            Producto.getAll().then(result => {
                res.send(result);
            });
        }
    };

    ejecutarFuncion();
})


//DELETE '/:id' = Borra un producto
//ACTUALIZADO
prodRouter.delete('/:id',autenticacion, autorizacion, (req, res) => {
    const prodId = parseInt(req.params.id);
    const ejecutarDelete = async (prodId) => {

        const resultado = await Producto.deleteByIdProd(prodId);

        if (resultado == null) {
            res.status(400).send({ error: 'Producto no encontrado' });
        } else{
            res.send(`Eliminado id: ${prodId}`);
        }
    };
    ejecutarDelete(prodId);
});

//POST '/' = Crea un carro y devuelve id
//ACTUALIZADO
carroRouter.post('/', (req, res) => {

    async function makeCarro(){
        const idc = await Carritos.addChart();
        res.send(`Carro creado idc=${idc}`);
    }
    makeCarro();
});

//DELETE '/:id' = Vacia un carrito y lo elimina
//ACTUALIZADO
carroRouter.delete('/:id', (req, res) => {

    const prodId = parseInt(req.params.id);

    const ejecutarDelete = async (prodId) => {

        const resultado = await Carritos.deleteChart(prodId);
        
        if (resultado == null) {
            res.status(400).send({ error: 'Carro no encontrado' });
        } else{
            res.send(`Eliminado carro id: ${prodId}`);
        }
    };
    ejecutarDelete(prodId);
})

//GET: '/id/productos' Permite listar todos los prod guardados si id=0

carroRouter.get('/:id/productos', (req, res) => {
    const prodId = parseInt(req.params.id);

    async function showProd(){
        const productos = await Carritos.getAll(prodId);
        res.send(productos);
    }
    showProd();
});

//POST '/:id/productos' = Incorpora productos al carro por su id
//ACTUALIZADO
carroRouter.post('/:id/productos', (req, res) => {
    const prodId = parseInt(req.params.id);
    const { carro } = req.body;

    Producto.getById(prodId).then((producto) => {
        console.log(producto)

        if (producto.id) {
            Carritos.addProdChart(producto, carro).then((result) => {

                if (result)
                    res.send(200);
                else
                    res.status(400).send({ error: 'Carrito no encontrado' });
            })
        } else {
            res.status(400).send({ error: 'Producto no encontrado' });
        }
    });

})

//DELETE ':id/productos/:id_prod' = Elimina un prod del carrito por su id de carro y producto
//ACTUALIZADO
carroRouter.delete('/:id/productos/:id_prod', (req, res) => {

    const carroId = parseInt(req.params.id);
    const prodId = parseInt(req.params.id_prod);

    const ejecutarDelete = async () => {

        const resultado = await Carritos.deleteByIdChart(carroId, prodId);
        if (resultado)
            res.send(200);
        else
            res.status(400).send({ error: 'Carrito o producto no encontrado' });
    };
    ejecutarDelete();
})

app.listen(8080, () => {
    console.log('Servidor levantado');
});