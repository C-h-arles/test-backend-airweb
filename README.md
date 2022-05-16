# test-backend-airweb

## API d'une boutique simple

#### Pour lancer le projet en local : 
- il vous faut npm et nodejs sur votre poste
- Ouvrez un terminal à la racine du projet et executez ```npm install```
- ensuite lancez le serveur en executant ```node index.js```

Par défaut, le serveur écoute sur le port 8080. Il faudra alors envoyer vos requêtes sur ```http://localhost:8080/```
Il est conseillé d'utiliser un outil comme _PostMan_ pour envoyer des requêtes http POST ET GET

#### liste des appels pris en charge par l'API
###### Pour vous authentifier :
Envoyez une requête POST à ```http://localhost:8080/user/check``` avec un JSON dans le body contenant une propriété _email_ (contenant l'email de l'utilisateur voulant se connecter) et _password_ (avec le mot de passe de l'utilisateur) 
Exemple : 
```
{
  "email" : "vincent@airweb.fr",
  "password" : "bonjour"
}
```
Vous recevrez le token de session vous confirmant l'authentification ou un message d'erreur

__Attention__ Stoquez ce token afin de pouvoir le fournir lors de vos prochains appels
Pour effectuer des appels en étant authentifier vous devez ajouter une donnée dont la clé est _x-xsrf-token_ et la valeur le token que vous aurez reçu


###### Pour récuperer la liste des produits et leur catégories
Faites un appel GET à ```http://localhost:8080/catalog```
> Si vous fournissez le token dans l'en-tête de la requête, vous recevrez les produits visibles pour les utilisateurs authentifiés 

###### Pour ajouter un produit à votre panier 
__Cet appel est réservé pour les utilisateurs authentifiés__
Faites un appel POST à ```http://localhost:8080/addToShoppingCart``` avec un JSON dans le body contenant :
- une propriété _product_ contenant l'ID du produit que vous souhaitez ajouter à votre panier 
- une propriété _quantity_ contenant le nombre de produit que vous souhaitez ajouter 
Exemple :
```
{
  "product": 4,
  "quantity": 8
}
```
Si le produit communiqué est déjà présent dans votre panier, sa quantité s'additionera avec le quantité communiquée.

###### Pour supprimer un produit de votre panier 
__Cet appel est réservé pour les utilisateurs authentifiés__
Faites un appel POST à ```http://localhost:8080/delToShoppingCart``` avec un JSON dans le body contenant une propriété _product_ contenant l'ID du produit que vous souhaitez supprimer de votre panier 
Exemple :
```
{
  "product": 4
}
```

###### Pour accéder à votre panier
__Cet appel est réservé pour les utilisateurs authentifiés__
Faites un appel GET à ```http://localhost:8080/shoppingCart```




