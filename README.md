![projet-6](./src/imgForReadMe/ocp6.svg "OpenClassrooms")

# Construisez une API sécurisée pour une application d'avis gastronomiques

>1. Clonez le repository
>
>2. Ouvrez un terminal
>
>3. Exécutez npm install à partir du répertoire du projet
>
>4. Créez un fichier `.env`  à la racine et configurez la connexion à votre base de données ( MongoDb ).
>[Créer une base de données dans MongoDB](https://www.mongodb.com/fr-fr/basics/create-database)
>
>5. Exécutez nodemon pour lancer le serveur

## Application Frontend disponible pour tester
> Clonez le repo https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6
> ( Ou dans le dossier `sourcesFrontend` )

![makejs](./src/imgForReadMe/makejs.svg "makejs")

![makejs](./src/imgForReadMe/use-nodejs.svg "makejs")

![makejs](./src/imgForReadMe/use-express.js.svg "makejs")

![makejs](./src/imgForReadMe/use-mongoose.svg "makejs")

![makejs](./src/imgForReadMe/use-mongoose-unique-validator.svg "makejs")

![makejs](./src/imgForReadMe/use-multer.svg "makejs")

![makejs](./src/imgForReadMe/use-bcrypt.svg "makejs")

![makejs](./src/imgForReadMe/use-jsonwebtoken.svg "makejs")

## Sommaire

-[Data models](#Data-models)

-[post](#post)

-[get](#get)

-[delete](#delete)

-[put](#put)

## Data models

`Sauce`

>userId          =>  String      => l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
>
>name            =>  String      => nom de la sauce
>
>manufacturer    =>  String      => fabricant de la sauce
>
>description     =>  String      => description de la sauce
>
>mainPepper      =>  String      => le principal ingrédient épicé de la sauce
>
>imageUrl        =>  String      => l'URL de l'image de la sauce téléchargée par l'utilisateur
>
>heat            =>  Number      => nombre entre 1 et 10 décrivant la sauce
>
>likes           =>  Number      => nombre d'utilisateurs qui aiment (= likent) la sauce
>
>dislikes        =>  Number      => nombre d'utilisateurs qui n'aiment pas (= dislike) lasauce
>
>usersLiked      =>  ["String"]  => tableau des identifiants des utilisateursqui ont aimé (= liked) la sauce
>
>usersDisliked   =>  ["String"]  => tableau des identifiants desutilisateurs qui n'ont pas aimé (= disliked) la sauce

`User`

>email           =>  String      => adresse e-mail de l'utilisateur [unique]
>
>password        =>  String      => mot de passe de l'utilisateur haché
>
## Les routes
## post
### `post` : signup

>Point d'accès => `/api/auth/signup`
>
>Request body (le cas échéant) => `{ email: string,password:string }`
>
>Réponse attendue => `{ message: string }`
>
>Fonction =>
>Hachage du mot de passe de l'utilisateur, ajout de l'utilisateur à la base de données.
### `post` : Login
>Point d'accès => `/api/auth/login`
>
>Request body (le cas échéant) => `{ email: string,password:string }`
>
>Réponse attendue => `{ userId: string,token: string }`
>
>Fonction =>
>Vérification des informations d'identification de l'utilisateur, renvoie l _id de l'utilisateur depuis la base de données et un token web JSON signé (contenant également l'_id de l'utilisateur).
### `post` : Add 
>Point d'accès => `/api/sauces`
>
>Request body (le cas échéant) => `{ sauce: String,image: File }`
>
>Réponse attendue => `{ message: string } VERB`
>
>Fonction =>
>Capture et enregistre l'image, analyse la sauce transformée en chaîne de caractères et l'enregistre dans la base de données en définissant correctement son imageUrl. Initialise les likes et dislikes de la sauce à 0 et les usersLiked et usersDisliked avec des tableaux vides. Remarquez que le corps de la demande initiale est vide ; lorsque multer est ajouté, il renvoie une chaîne pour le corps de la demande en fonction des données soumises avec le fichier.
### `post` : like & dislike 
>Point d'accès => `/api/sauces/:id/like`
>
>Request body (le cas échéant) => `{ userId: String,like: Number }`
>
>Réponse attendue => `{ message: string }`
>
>Fonction =>
>Définit le statut « Like » pour l' userId fourni. Si like = 1, l'utilisateur aime (= like) la sauce. Si like = 0, l'utilisateur annule son like ou son dislike. Si like = -1, l'utilisateur n'aime pas (= dislike) la sauce. L'ID de l'utilisateur doit être ajouté ou retiré du tableau approprié. Cela permet de garder une trace de leurs préférences et les empêche de liker ou de ne pas disliker la même sauce plusieurs fois : un utilisateur ne peut avoir qu'une seule valeur pour chaque sauce. Le nombre total de « Like » et de « Dislike » est mis à jour à chaque nouvelle notation. 
## get
### `get` : Retieve All
>Point d'accès => `/api/sauces`
>
>Request body (le cas échéant) => ``
>
>Réponse attendue => `Array of sauces`
>
>Fonction =>
>Renvoie un tableau de toutes les sauces de la base de données. 
### `get` : Retrieve one
>Point d'accès => `/api/sauces/:id`
>
>Request body (le cas échéant) => ``
>
>Réponse attendue => `Single sauce`
>
>Fonction =>
>Renvoie la sauce avec l’_id fourni.
## delete
### `delete` : remove one
>Point d'accès => `/api/sauces/:id`
>
>Request body (le cas échéant) => ``
>
>Réponse attendue => `{ message: string }`
>
>Fonction =>
>Supprime la sauce avec l'_id fourni. 
## put
### `put` : update
>Point d'accès => `/api/sauces/:id`
>
>Request body (le cas échéant) => `EITHER Sauce as JSON OR { sauce: String, image: File }`
>
>Réponse attendue => `{ message: string }`
>
>Fonction =>
>Met à jour la sauce avec l'_id fourni. Si une image est téléchargée, elle est capturée et l’imageUrl de la sauce est mise à jour. Si aucun fichier n'est fourni, les informations sur la sauce se trouvent directement dans le corps de la requête (req.body.name, req.body.heat, etc.). Si un fichier est fourni, la sauce transformée en chaîne de caractères se trouve dans req.body.sauce. Notez que le corps de la demande initiale est vide ; lorsque multer est ajouté, il renvoie une chaîne du corps de la demande basée sur les données soumises avec le fichier. 