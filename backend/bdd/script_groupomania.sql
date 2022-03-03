CREATE SCHEMA `groupomania`;
USE groupomania;



CREATE TABLE utilisateur(
	id integer NOT NULL AUTO_INCREMENT PRIMARY KEY,
	nom varchar(255) NOT NULL,
	prenom varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	mdp varchar(255) NOT NULL,
     photoProfil varchar(255) DEFAULT 'http://localhost:3000/images/profil/default.png',
      admin integer DEFAULT '0',
    Constraint email_UNIQUE Unique (email)
);


CREATE TABLE post(
	id integer NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_user integer NOT NULL,
	texte text,
	image varchar(255),
    nbLikes integer DEFAULT '0',
    nbComment integer DEFAULT '0',
	FOREIGN KEY(id_user) REFERENCES utilisateur(id)
);



CREATE TABLE commentaire(
	id integer NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_user integer NOT NULL,
	id_post integer NOT NULL,
	texte text NOT NULL,
	FOREIGN KEY(id_user) REFERENCES utilisateur(id),
	FOREIGN KEY(id_post) REFERENCES post(id)
	
);

CREATE TABLE likes(
	id integer NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id_user integer NOT NULL,
	id_post integer NOT NULL,
	FOREIGN KEY(id_user) REFERENCES utilisateur(id),
	FOREIGN KEY(id_post) REFERENCES post(id)
	
);

