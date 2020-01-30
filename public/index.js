//const localhost = new URL("https://localhost:8080");
//Checked
function loadComments() {
  let url = "/blog-api/comentarios";
  $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    success: function(responseJSON) {
      displayResults(responseJSON);
    },
    error: function(err) {
      console.log(err);
    }
  });
}
//Checked
function displayResults(responseJSON) {
  console.log(responseJSON);
  $("#comments").empty();
  for (let i = 0; i < responseJSON.length; ++i) {
    $("#comments").append(`
          <h2> ${responseJSON[i].titulo} </h2>
          <p> ${responseJSON[i].contenido} </p>
          <p> By ${responseJSON[i].autor} @ ${responseJSON[i].fecha}</p>
          `);
  }
}
//Checked
function addComment() {
  $("#buttonAdd").on("click", function(e) {
    let url = "/blog-api/nuevo-comentario";

    let tit = $("#titleAdd").val();
    let cont = $("#contentAdd").val();
    let aut = $("#autorAdd").val();

    if (tit === undefined || cont === undefined || aut === undefined) {
      alert("Verificar que los campos esten completos.");
      return false;
    }
    let comment = {
      titulo: tit,
      contenido: cont,
      autor: aut
    };

    $.ajax({
      url: url,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(comment),
      success: function(responseJSON) {
        loadComments();
      },
      error: function(err) {
        let mes;
        switch (err.status) {
          case 406:
            mes = "No tiene las propiedades suficientes";
            break;
          default:
            console.log(err);
            return;
        }
        alert(mes);
      }
    });
  });
}
//Checked
function deleteComment() {
  $("#buttonDelete").on("click", function(e) {
    e.preventDefault();

    let id = $("#idDelete").val();
    if (id === undefined) {
      alert("Añadir un Id para remover comentario");
      return false;
    }

    let url = `/blog-api/remover-comentario/${id}`;

    $.ajax({
      url: url,
      method: "DELETE",
      contentType: "application/json",
      success: function(responseJSON) {
        loadComments();
      },
      error: function(err) {
        let mes;
        switch (err.status) {
          case 404:
            mes = "No se encontró el comentario";
            break;
          default:
            console.log(err);
            return;
        }
        alert(mes);
      }
    });
  });
}
//Checked
function updateComment() {
  $("#buttonUpdate").on("click", function(e) {
    e.preventDefault();
    let id = $("#updateid").val();
    console.log(id);

    if (id === "") {
      alert("Añadir un id para updatear el comentario.");
      return false;
    }

    let tit = $("#titleUpdate").val();
    let cont = $("#contentUpdate").val();
    let aut = $("#autorUpdate").val();

    if (tit === "" && cont === "" && aut === "") {
      alert("Añadir propiedades para actualizar");
      return false;
    }

    let url = `/blog-api/actualizar-comentario/${id}`;

    let objID = {
      _id: id,
      titulo: tit,
      contenido: cont,
      autor: aut
    };

    $.ajax({
      url: url,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(objID),
      success: function(responseJSON) {
        console.log(responseJSON);
        loadComments();
      },
      error: function(err) {
        let mes;
        switch (err.status) {
          case 406:
            mes =
              "No existe el id en el cuerpo del documentos o no hay algun comentario para este id";
            break;
          case 409:
            mes = "No son los mismos ids";
            break;
          default:
            console.log(err);
            return;
        }
        alert(mes);
      }
    });
  });
}

function queryComment() {
  $("#buttonQuery").on("click", function(e) {
    e.preventDefault();
    let aut = $("#autorQuery").val();
    if (aut.length === 0) {
      alert("Añade un valor de autor");
      return false;
    }

    let url = `/blog-api/comentarios-por-autor?autor=${aut}`;
    console.log(url);

    $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      success: function(responseJSON) {
        displayResults(responseJSON);
      },
      error: function(err) {
        let mes;
        switch (err.status) {
          case 406:
            mes = "Añadir un valor en el query string";
            break;
          case 404:
            mes = "No coincide ninguna autor con ese nombre";
            break;
          default:
            console.log(err);
            return;
        }
        alert(mes);
      }
    });
  });
}

function init() {
  loadComments();
  addComment();
  deleteComment();
  updateComment();
  queryComment();
}

init();
