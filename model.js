let mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let commentCollection = mongoose.Schema({
  titulo: { type: String },
  contenido: { type: String },
  autor: { type: String },
  fecha: { type: Date }
});

let Comment = mongoose.model("comments", commentCollection);

let commentController = {
  getAll: function() {
    return Comment.find()
      .then(comments => {
        return comments;
      })
      .catch(error => {
        throw new Error(error);
      });
  },
  create: function(newComment) {
    return Comment.create(newComment)
      .then(comment => {
        return comment;
      })
      .catch(error => {
        throw new Error(error);
      });
  },
  update: function(id, newComment) {
    return Comment.findOneAndUpdate({ _id: id }, newComment)
      .then(comment => {
        return comment;
      })
      .catch(error => {
        throw new Error(error);
      });
  },
  delete: function(id) {
    return Comment.findOneAndRemove({ _id: id })
      .then(comment => {
        return comment;
      })
      .catch(error => {
        throw new Error(error);
      });
  },
  findByAuthor: function(name) {
    return Comment.find({ autor: name })
      .then(comments => {
        return comments;
      })
      .catch(error => {
        throw new Error(error);
      });
  },
  findById: function(id) {
    return Comment.findOne({ _id: id })
      .then(comments => {
        return comments;
      })
      .catch(error => {
        throw new Error(error);
      });
  }
};

module.exports = {
  commentController
};
