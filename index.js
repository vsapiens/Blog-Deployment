let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();
let uuid = require("uuid");
let mongoose = require("mongoose");
let { commentController } = require("./model");
let { PORT, DATABASE_URL } = require("./config");

let app = express();
app.use(express.static("public"));
app.use(morgan("dev"));

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

  commentController
    .create(newComment)
    .then(comment => {
      res.statusMessage = "Comentario Añadido";
      return res.status(201).json(comment);
    })
    .catch(err => {
      console.log(err);
      res.statusMessage = "Error al añadir nuevo comentario";
      return res.status(500).send(newComment);
    });
});
//Checked
app.delete("/blog-api/remover-comentario/:id", (req, res) => {
  let id = req.params.id;
  console.log(id);

  commentController
    .delete(id)
    .then(comment => {
      res.statusMessage = "Comentario borrado";
      return res.status(200).json(comment);
    })
    .catch(err => {
      console.log(err);
      res.statusMessage = "No se encontró el comentario";
      return res.status(404).send();
    });
});

app.put("/blog-api/actualizar-comentario/:id", jsonParser, (req, res) => {
  let comment = req.body;
  let id = req.params.id;
  console.log(comment);
  if (comment._id === undefined) {
    res.statusMessage = "No existe el id en el cuerpo del documentos";
    return res.status(406).send();
  }
  if (comment._id !== id) {
    res.statusMessage = "No son los mismos ids";
    return res.status(409).send();
  }

  commentController
    .findById(id)
    .then(cm => {
      let newComment = {
        titulo: req.body.titulo || cm.titulo,
        contenido: req.body.contenido || cm.contenido,
        autor: req.body.autor || cm.autor
      };
      commentController
        .update(id, newComment)
        .then(resCM => {
          res.statusMessage = "Updated";
          return res.status(200).json(resCM);
        })
        .catch(err => {
          console.log(err);
          res.statusMessage = "Problemas con el serivod";
          return res.status(500).send();
        });
    })
    .catch(err => {
      console.log(err);
      res.statusMessage = "No se encontro un comentario con este id";
      res.status(406).send();
    });
});

//Checked
app.get("/blog-api/comentarios", jsonParser, (req, res) => {
  commentController
    .getAll()
    .then(comentarios => {
      return res.status(200).json(comentarios);
    })
    .catch(error => {
      console.log(error);
      res.statusMessage = "Error";
      return res.status(500).send();
    });
});
//Checked
app.get("/blog-api/comentarios-por-autor", (req, res) => {
  let comment = req.query;
  if (comment.autor == undefined) {
    res.statusMessage = "Añadir un valor en el query string";
    return res.status(406).send();
  }

  commentController
    .findByAuthor(comment.autor)
    .then(author => {
      res.statusMessage = "El autor tiene comentarios";
      return res.status(200).json(author);
    })
    .catch(err => {
      res.statusMessage = "No coincide ningun autor con ese nombre";
      return res.status(404).send();
    });
});

let server;
function runServer(port, databaseUrl) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, response => {
      if (response) {
        return reject(response);
      } else {
        server = app
          .listen(port, () => {
            console.log("App is running on port " + port);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            return reject(err);
          });
      }
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing the server");
      server.close(err => {
        if (err) {
          return reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

runServer(PORT, DATABASE_URL);

module.exports = { app, runServer, closeServer };
