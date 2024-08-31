const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const main = express();

//--------------------------------
const {dogModel} = require("./models/index");
// const info = require("search.json");

const cargarDB = () =>{
    dogModel.create(info)
    .then(res => console.log("cargado"))
}

main.use(morgan("dev"));

main.use(cors()); //error de origen cruzado
main.use(express.json()); //Manejar data .json

//main.name = "API";

main.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
// main.use(bodyParser.json({ limit: '50mb' }));
main.use(cookieParser());
// main.use(morgan('dev'));
main.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // or `http://localhost:${FRONT}`// update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//list of midlewares
main.use("/api/admin/dogs", require("./hook/dogHook"));
// main.use("/api/admin/users", require("./hook/userHook"));
// main.use("/api/admin/volunteers", require("./hook/volunteersHook"));
// main.use("/api/admin/adoptions", require("./hook/adopHook"));
// main.use("/api/admin/press", require("./hook/pressHook"));
// main.use("/api/admin/contributions", require("./hook/contribHook"));
// main.use("/api/admin/interfaces", require("./hook/interfaceHook"));
// main.use("/api/admin/escolar", require("./hook/escolarHook"));
main.use("/api/inicio", require("./hook/inicio"));


main.use("/api", require("./routers"));

// Error catching endware.
// main.use((err, req, res, next) => {
//   // eslint-disable-line no-unused-vars
//   const status = err.status || 500;
//   const message = err.message || err;
//   console.error(err);
//   res.status(status).send(message);
// });

//-----------------------mercado pago-----------------------//
dotenv.config();

const mercadopago = require("mercadopago");

//mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN);
// mercadopago.configure({
//   access_token: process.env.ACCESS_TOKEN,
// });

// // importa el módulo de rutas de Mercado Pago
// const mercadopagoRoutes = require("./routers/mercadopago");

// // asigna un manejador de rutas a la ruta '/mercadopago'
// main.use("/mercadopago", mercadopagoRoutes);

// -----------------------fin mercado pago-----------------------//

module.exports = main;
