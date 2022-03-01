const dbc = require("../config/db");
const db = dbc.getDB();
const fs = require("fs");

/*********CREATION POST********/
exports.createPost = (req, res, next) => {
  var image;
  const userId = req.body.userId;
  const text = req.body.text;
  if (req.file == null) {
    image = null;
  } else {
    const url = req.protocol + "://" + req.get("host");
    image = url + "/images/" + req.file.filename;
  }

  const insertSql = "INSERT INTO post (id_user, texte, image) VALUES (?,?,?)";

  db.query(insertSql, [userId, text, image], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("post créer");
    }
  });
};

/*********RECUPERER TOUT LES POST********/
exports.getAllPost = (req, res, next) => {
  const getAllSql =
    "SELECT post.id, post.id_user, post.texte, post.image, post.nbLikes, post.nbComment, utilisateur.prenom, utilisateur.nom, utilisateur.photoProfil FROM post JOIN utilisateur ON post.id_user = utilisateur.id ORDER BY post.id DESC";

  db.query(getAllSql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
};

/*********RECUPERER TOUT LES POST D'UN UTILISATEUR********/
exports.userPost = (req, res, next) => {
  const userId = req.body.userId;

  const getAllPostByUserIdSql =
    "SELECT post.id, post.id_user, post.texte, post.image, post.nbLikes, post.nbComment, utilisateur.prenom, utilisateur.nom, utilisateur.photoProfil FROM post JOIN utilisateur ON post.id_user = utilisateur.id WHERE post.id_user = ? ORDER BY post.id DESC";

  db.query(getAllPostByUserIdSql, [userId], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

/*********RECUPERER TOUT LES POST QU'UN UTILISATEUR A LIKE********/
exports.postUserLike = (req, res, next) => {
  const userId = req.body.userId;

  const getPostLikedByUserSql =
    "SELECT post.id, post.id_user, post.texte, post.image, post.nbLikes, post.nbComment, utilisateur.prenom, utilisateur.nom, utilisateur.photoProfil FROM post JOIN utilisateur ON post.id_user = utilisateur.id JOIN likes ON post.id = likes.id_post WHERE likes.id_user = ? ORDER BY post.id DESC";

  db.query(getPostLikedByUserSql, [userId], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

/*********SUPPRIMER UN POST********/
exports.deletePost = (req, res, next) => {
  //delete l'image lier au post dans le dossier images du server
  if (req.body.imagePost != null) {
    const link = req.body.imagePost.replace(
      "http://localhost:3000/",
      "../backend/"
    );
    fs.unlink(link, (err) => {
      if (err) throw err;
    });
  }
  const postId = req.body.postId;
  const deleteOneSql = "DELETE FROM post WHERE id = ?";

  db.query(deleteOneSql, [postId], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("post supprimer");
    }
  });
};

/*****LIKE UNLIKE UN POST****/
exports.likeUnlikePost = (req, res, next) => {
  const userId = req.body.userId;
  const postId = req.body.postId;
  const selectLikeSql =
    "SELECT * FROM likes WHERE likes.id_user = ? AND likes.id_post = ?";
  db.query(selectLikeSql, [userId, postId], (err, result) => {
    if (err) {
      res.status(404).json({ err });
    }

    if (result.length === 0) {
      //LIKE
      const likeSql = "INSERT INTO likes (id_user, id_post) VALUES (?,?)";
      db.query(likeSql, [userId, postId], (err, result) => {
        if (err) {
          res.status(404).json({ err });
        }
        const addLike =
          "UPDATE post SET nbLikes = nbLikes + 1 WHERE post.id = ?";
        db.query(addLike, [postId], (err, result) => {
          if (err) {
            res.status(404).json({ err });
          }
        });
        res.send("like");
      });
    } else {
      //UNLIKE
      const unlikeSql =
        "DELETE FROM likes WHERE likes.id_user = ? AND likes.id_post = ?";
      db.query(unlikeSql, [userId, postId], (err, result) => {
        if (err) {
          res.status(404).json(err);
        }
        const sousLike =
          "UPDATE post SET nbLikes = nbLikes - 1 WHERE post.id = ?";
        db.query(sousLike, [postId], (err, result) => {
          if (err) {
            res.status(404).json({ err });
          }
        });
        res.send("unlike");
      });
    }
  });
};

/**RECUPERATION DE TOUT LES LIKE POUR L4UTILISATEUR***/
exports.getLike = (req, res, next) => {
  const userId = req.body.userId;
  const selectLikeSql = "SELECT * FROM likes WHERE likes.id_user = ?";
  db.query(selectLikeSql, [userId], (err, result) => {
    if (err) {
      res.status(404).json({ err });
    } else {
      res.send(result);
    }
  });
};
