# 📘 Projet 6 : Mon Vieux Grimoire (Backend)

## 📌 Description du projet

Ce dépôt contient le backend du projet _Mon Vieux Grimoire_, développé dans le cadre de la formation OpenClassrooms.  
L’objectif est de fournir une API sécurisée permettant :

- la création de compte et la connexion utilisateur
- l’ajout, la modification et la suppression de livres
- l’upload et l’optimisation d’images (Multer + Sharp)
- la notation des livres par les utilisateurs
- le calcul automatique de la note moyenne
- la récupération des 3 livres les mieux notés

Le frontend est fourni par OpenClassrooms et communique avec cette API.

---

## 🚀 Installation

### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/taodev974/Projet-6.git
cd Projet-6
2️⃣ Installer les dépendances
bash
npm install
🔐 Configuration du fichier .env
Un fichier .env.example est fourni pour indiquer les variables nécessaires.

Pour exécuter le backend, créez un fichier .env à la racine du projet en utilisant les valeurs suivantes (compte dédié à la soutenance) :

Code
MONGO_URI=mongodb+srv://oc-evaluateur:<password>@cluster0.jzxsref.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=mettez_n_importe_quoi
PORT=4000
🗄️ Configuration MongoDB Atlas
✔ Accès réseau
Dans MongoDB Atlas → Network Access :
Autoriser l’IP 0.0.0.0/0 (accès global pour la soutenance).

✔ Utilisateur MongoDB
Un utilisateur dédié à la soutenance est déjà configuré :

username : oc-evaluateur

password : Le mot de passe de l’utilisateur sera fourni dans le fichier d’instructions pour l’évaluateur.


rôle : readWriteAnyDatabase

Aucune autre action n’est nécessaire.

▶️ Lancer le serveur
bash
npm start
L’API sera disponible sur :

Code
http://localhost:4000
📁 Structure du projet
Code
controllers/      → logique métier (CRUD, notation, moyenne)
middleware/       → auth JWT, optimisation d’images (Sharp)
models/           → modèles Mongoose (User, Book)
routes/           → routes de l’API
images/           → dossier des images optimisées (.gitkeep)
app.js            → configuration Express
server.js         → connexion MongoDB + lancement serveur
🔧 Fonctionnalités principales
📚 Livres
POST /api/books → créer un livre

GET /api/books → récupérer tous les livres

GET /api/books/:id → récupérer un livre (404 si non trouvé)

PUT /api/books/:id → modifier un livre

suppression automatique :

de l’ancienne image optimisée

du fichier brut uploadé

DELETE /api/books/:id → supprimer un livre

suppression automatique de l’image optimisée

GET /api/books/bestrating → top 3 des livres les mieux notés

⭐ Notation
POST /api/books/:id/rating

un utilisateur ne peut noter qu’une seule fois

note entre 0 et 5

recalcul automatique de averageRating

🖼️ Images
Upload via Multer

Conversion en WebP via Sharp

Redimensionnement

Suppression automatique des fichiers inutiles

🔒 Sécurité
Hash du mot de passe (bcrypt)

Authentification via JWT

Vérification du propriétaire du livre pour PUT/DELETE

Protection des champs sensibles (userId, ratings, averageRating)

Validation des données envoyées

🧪 Tests
Les routes ont été testées avec Postman :

création de compte

login

CRUD livres

upload image

notation

moyenne

suppression d’image

🧹 Notes importantes
Le dossier node_modules/ n’est pas versionné (voir .gitignore)

Le dossier images/ contient uniquement un fichier .gitkeep

Aucun mot de passe ou clé secrète n’est présent dans le dépôt

Le projet est prêt à être lancé par l’évaluateur

👤 Auteur
Tony — Formation Développeur Web OpenClassrooms
Backend réalisé en Node.js, Express, MongoDB
```
