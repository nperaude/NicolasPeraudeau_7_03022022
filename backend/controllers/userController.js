const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbc = require("../config/db");
const db = dbc.getDB();
const fs = require("fs");

/***CREATION DE COMPTE***/
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const mdp = hash;
    const newUserSql =
      "INSERT INTO utilisateur (nom, prenom, email, mdp) VALUE(?,?,?,?)";

    db.query(newUserSql, [lastname, firstname, email, mdp], (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.send("user créer");
      }
    });
  });
};

/***CONNEXION A UN COMPTE EXISTANT***/
exports.login = (req, res, next) => {
  const email = req.body.email;

  const findUser = "SELECT mdp , id FROM utilisateur WHERE email = ?";

  db.query(findUser, [email], (err, result) => {
    if (err) {
      res.status(401).json({ error: "Utilisateur non trouvé !" });
    }
    if (result[0]) {
      const { mdp: hashMdp } = result[0];
      const { id: userId } = result[0];
      bcrypt
        .compare(req.body.password, hashMdp)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect!" });
          }
          res.status(200).json({
            userId: userId,
            token: jwt.sign({ userId }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    } else {
      res.status(400).json({
        error: true,
        message: "Mauvaise combinaison email / mot de passe",
      });
    }
  });
};

/***RECUPERATION INFOS DU COMPTE***/
exports.getInfo = (req, res, next) => {
  const userId = req.body.userId;

  const getInfoSql =
    "SELECT nom , prenom , email, photoProfil, admin FROM utilisateur WHERE id = ?";

  db.query(getInfoSql, [userId], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

/***MISE A JOURS D'UN COMPTE***/
exports.updateUser = (req, res, next) => {
  const userId = req.body.userId;
  const firstname = req.body.prenom;
  const lastname = req.body.nom;
  const email = req.body.email;

  const updateUserSql =
    "UPDATE utilisateur SET nom = ?, prenom = ?, email = ? WHERE id = ?";
  db.query(
    updateUserSql,
    [lastname, firstname, email, userId],
    (err, result) => {
      if (err) {
        res.status(401).json({ err });
      } else {
        res.send("user modifier");
      }
    }
  );
};

/***MISE A JOUR DE LA PHOTO DE PROFIL***/
exports.updatePhotoProfil = (req, res, next) => {
  if (
    req.body.oldPhotoProfil != "http://localhost:3000/images/profil/default.png"
  ) {
    if (req.body.oldPhotoProfil != null) {
      const link = req.body.oldPhotoProfil.replace(
        "http://localhost:3000/",
        "../backend/"
      );
      fs.unlink(link, (err) => {
        if (err) throw err;
      });
    }
  }
  const userId = req.body.userId;
  const url = req.protocol + "://" + req.get("host");
  const photoProfil = url + "/images/profil/" + req.file.filename;

  const updatePhotoProfilSql =
    "UPDATE utilisateur SET photoProfil = ? WHERE id = ?";
  db.query(updatePhotoProfilSql, [photoProfil, userId], (err, result) => {
    if (err) {
      res.status(401).json({ err });
    } else {
      res.send("photo modifier");
    }
  });
};

/***SUPPRIMMER COMPTE***/
exports.deleteUser = (req, res, next) => {
  const userId = req.body.userId;

  const deleteUseSql = "DELETE FROM utilisateur WHERE id = ?";

  db.query(deleteUseSql, [userId], (err, result) => {
    if (err) {
      res.status(401).json({ err });
    } else {
      res.send("user supprimer");
    }
  });
};
