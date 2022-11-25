# PIIQUANTE

# Projet 6 : Construire une API sécurisée pour une application Web

## OC - Parcours Développeur Web - P6 - Piiquante

---

![](public/logo.png)

_**Objectif du projet**_ : construire une API REST sécurisée pour une application d'avis gastronomique

---

_**Installation et lancement de l'application**_

1. Cloner le repository
   [Frontend et backend](https://github.com/Julie-2022/P6-Piiquante.git)
2. Ouvrir un terminal (Linux/Mac) ou une invite de commande/PowerShell
   (Windows)
3. Lancer l'application depuis le frontend : Exécutez "npm install" à partir du répertoire frontend puis "npm run start"
4. Sur VsCode, lancer l'API depuis le backend : Exécutez "npm install" à partir du répertoire backend puis créer un dossier "images" dans le répertoire backend via la commande : "mkdir images" dans votre terminal. Enfin lancer le server avec "nodemon index.js" (après l'avoir installé sur votre ordinateur (npm install -g nodemon))
5. Dans le dossier backend, créer un fichier ".env" à la racine et y déclarer la valeur de vos variables d'environnement (sans espace et en majuscules)
6. Installer les modules listés dans le fichier package.json (dependencies)
7. Le back-end s'exécute sur http://localhost:3000
8. Le front-end s'exécute sur http://localhost:4200
9. Si tout a été correctement installé et le compte de MongoDb créé et relié à l'application : les mentions "Server listening on Port 3000 & Connected to MongoDB" devraient s'afficher dans votre terminal.

---

### **Technologies, logiciels,langages, frameworks et plugins utilisés**

- Visual Studio Code
- Git & GitHub
- Javascript
- NodeJs
- Express
- Mongoose
- bcrypt
- multer /JsonwebToken

---

### Cahier des charges :

**Contexte du projet**  
Piiquante se dédie à la création de sauces épicées dont les recettes sont gardées secrètes. Pour tirer parti de son succès et générer davantage de buzz, l'entreprise souhaite créer une application web dans laquelle les utilisateurs peuvent ajouter leurs sauces préférées et liker ou disliker les sauces ajoutées par les autres.

**API Routes**  
Toutes les routes pour les sauces doivent disposer d’une autorisation (le token est envoyé par le front-end avec l'en-tête d’autorisation : « Bearer + token »).

### Data Models

- userId : String — l'identifiant MongoDB unique de l'utilisateur qui a créé la
  sauce
- name : String — nom de la sauce
- manufacturer : String — fabricant de la sauce
- description : String — description de la sauce
- mainPepper : String — le principal ingrédient épicé de la sauce
- imageUrl : String — l'URL de l'image de la sauce téléchargée par l'utilisateur
- heat : Number — nombre entre 1 et 10 décrivant la force du piquant de la sauce
- likes : Number — nombre d'utilisateurs qui aiment (= like) la sauce
- dislikes : Number — nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
- usersLiked : [ "String + userId" ] — tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce
- usersDisliked : [ "String + userId" ] — tableau des identifiants des
  utilisateurs qui n'ont pas aimé (= disliked) la sauce

### Utilisateur

- email : String — adresse e-mail de l'utilisateur [unique]
- password : String — mot de passe de l'utilisateur haché

### Exigences de sécurité

- Le mot de passe de l'utilisateur doit être protégé (haché).
- L'authentification doit être renforcée sur toutes les routes requises.
- Les adresses électroniques dans la base de données sont uniques et un
  plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler
  les erreurs.
- La sécurité de la base de données MongoDB (à partir d'un service tel que
  MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la
  machine d'un utilisateur.
- Un plugin Mongoose doit assurer la remontée des erreurs issues de la base
  de données.
- Les versions les plus récentes des logiciels sont utilisées avec des correctifs
  de sécurité actualisés.
- Le contenu des dossiers images, node_modules et du fichier .env (qui contient les données sensibles du projet) ne doivent pas être téléchargés sur GitHub.
