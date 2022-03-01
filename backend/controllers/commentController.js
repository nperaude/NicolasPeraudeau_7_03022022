const dbc = require("../config/db");
const db = dbc.getDB();

/******CREATION NOUVEAU COMMENTAIRE****/
exports.createComment = (req, res, next) => {
  const userId = req.body.userId;
  const postId = req.body.postId;
  const text = req.body.text;

  const createCommentSql =
    "INSERT INTO commentaire (id_user, id_post, texte) VALUE (?,?,?)";
  db.query(createCommentSql, [userId, postId, text], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const addComment =
        "UPDATE post SET nbComment = nbComment + 1 WHERE post.id = ?";
      db.query(addComment, [postId], (err, result) => {
        if (err) {
          res.status(404).json({ err });
        }
      });
      res.send("commentaire créer");
    }
  });
};

/*****RECUPERATION DE TOUT LES COMMENTAIRE*****/
exports.getComment = (req, res, next) => {
  const postId = req.body.postId;

  const getCommentByPostSql =
    "SELECT utilisateur.nom , utilisateur.prenom , utilisateur.photoProfil, commentaire.texte, commentaire.id, commentaire.id_post, commentaire.id_user FROM utilisateur JOIN commentaire ON utilisateur.id = commentaire.id_user ORDER BY commentaire.id DESC";
  db.query(getCommentByPostSql, [postId], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
};

/**SUPPRIMMER UN COMMENTAIRE EN FONCTION DE SON ID**/
exports.deleteComment = (req, res, next) => {
  const commentId = req.body.commentId;
  const postId = req.body.postId;

  const deleteComment = "DELETE FROM commentaire WHERE id = ?";
  db.query(deleteComment, [commentId], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const suppComment =
        "UPDATE post SET nbComment = nbComment - 1 WHERE post.id = ?";
      db.query(suppComment, [postId], (err, result) => {
        if (err) {
          res.status(404).json({ err });
        }
      });
      res.send("commentaire supprimer");
    }
  });
};
