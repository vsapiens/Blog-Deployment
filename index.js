let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();
let uuid = require("uuid");

let app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE");

  if (req.method === "OPTIONS") {
    return res.send(204);
  }
  next();
});

app.use(express.static("public"));

app.use(morgan("dev"));

let comments = [
  {
    id: uuid.v4(),
    titulo: "First Post",
    contenido: "This is my first post in this blog.",
    autor: "Hola",
    fecha: new Date("29 January 2020")
  },
  {
    id: uuid.v4(),
    titulo: "Second Post",
    contenido: "This is my second post in this blog.",
    autor: "Erick Gzz",
    fecha: new Date("30 January 2020")
  },
  {
    id: uuid.v4(),
    titulo: "Third Post",
    contenido: "This is my third post in this blog.",
    autor: "Erick González",
    fecha: new Date("31 January 2020")
  }
];

//Checked
app.post("/blog-api/nuevo-comentario", jsonParser, (req, res) => {
  let comment = req.body;

  console.log(comment);
  if (Object.keys(comment).length !== 3) {
    res.statusMessage = "No tiene las propiedades suficientes";
    return res.status(406).send();
  }
  let newComment = {
    id: uuid.v4(),
    titulo: comment.titulo,
    contenido: comment.contenido,
    autor: comment.autor,
    fecha: new Date()
  };
  comments.push(newComment);
  res.statusMessage = "Comentario Añadido";
  return res.status(201).send(newComment);
});
//Checked
app.delete("/blog-api/remover-comentario/:id", (req, res) => {
  let id = req.params.id;
  console.log(id);

  let result = comments.find(element => {
    if (element.id.toString() === String(id)) {
      return element;
    }
  });
  let index = comments.findIndex(element => element.id === id);
  console.log(index);

  if (index === -1) {
    res.statusMessage = "No se encontró el comentario";
    return res.status(404).send();
  } else {
    comments.splice(index, 1);
    res.statusMessage = "Comentario borrado";
    return res.status(200).send(result);
  }
});
//Checked
app.put("/blog-api/actualizar-comentario/:id", jsonParser, (req, res) => {
  let comment = req.body;
  let id = req.params.id;

  if (comment.id === undefined) {
    res.statusMessage = "No existe el id en el cuerpo del documentos";
    return res.status(406).send();
  }
  if (comment.id !== id) {
    res.statusMessage = "No son los mismos ids";
    return res.status(409).send();
  }

  let result = comments.find(element => {
    if (element.id.toString() === String(id)) {
      return element;
    }
  });

  if (result === undefined) {
    res.statusMessage = "No se encontro un comentario con este id";
    res.status(406).send();
  } else {
    let index = comments.findIndex(element => element.id === id);
    let newComment = {
      ...comments[index],
      titulo: req.body.titulo || comments[index].titulo,
      contenido: req.body.contenido || comments[index].contenido,
      autor: req.body.autor || comments[index].autor
    };
    comments[index] = newComment;
    return res.status(202).send(newComment);
  }
});
//Checked
app.get("/blog-api/comentarios", (req, res) => {
  console.log(comments);
  return res.status(200).json(comments);
});
//Checked
app.get("/blog-api/comentarios-por-autor", (req, res) => {
  let comment = req.query;
  if (comment.autor === undefined) {
    res.statusMessage = "Añadir un valor en el query string";
    return res.status(406).send();
  }
  let result = comments.filter(element => {
    if (element.autor === comment.autor) {
      return element;
    }
  });

  if (result.length === 0) {
    res.statusMessage = "No coincide ningun autor con ese nombre";
    return res.status(404).send();
  } else {
    res.statusMessage = "El autor tiene comentarios";
    return res.status(200).json(result);
  }
});

app.listen(8080, () => {
  console.log("Servidor corriendo en el puerto 8080");
});
