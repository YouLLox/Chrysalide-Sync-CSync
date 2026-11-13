# Chrysalide Sync CSync

Ce dépôt est un **sous-projet de synchronisation** pour le projet principal **Chrysalide**.

Il ne s’agit pas de l’application finale visible par l’utilisateur, mais d’une **couche d’ingestion, de transformation et de cache local** qui permet de récupérer les données d’un étudiant depuis les services externes, puis de les stocker dans une base SQLite locale.

## À quoi sert ce dépôt ?

Ce repository sert à :

- récupérer les données de **l’environnement Auriga** avec un token de session ;
- transformer ces données en objets métier locaux ;
- charger certains payloads complémentaires depuis un dépôt GitLab parent ;
- persister le tout dans une base **SQLite** locale via **Drizzle ORM** ;
- fournir une base de données prête à être consommée par le projet principal Chrysalide.

En pratique, ce sous-projet agit comme un **connecteur/synchroniseur** entre les sources externes et la donnée locale utilisée par le reste de l’écosystème Chrysalide.

## Relation avec le projet parent

Ce dépôt est pensé comme un **module compagnon** d’un projet plus large.

Il s’inscrit dans une architecture où :

- le **projet parent** porte l’expérience applicative finale ;
- ce sous-projet s’occupe de la **récupération des données**, de leur **normalisation** et de leur **stockage local** ;
- certaines ressources, comme des payloads JSON, sont lues directement depuis le repository parent (`ChrysalideApp`).

## Ce que fait le code

Le pipeline principal est le suivant :

1. connexion à Auriga via `src/services/auriga` ;
2. extraction des données brutes (étudiant, emploi du temps, notes, syllabus) ;
3. transformation vers les types métier définis dans `src/types` ;
4. persistance dans SQLite via `src/db` et `src/repositories` ;
5. exécution d’un script de synchronisation dans `src/index.ts`.

## Composants principaux

- `src/services/auriga/` : client et extraction des données Auriga ;
- `src/services/gitlab/` : lecture des payloads JSON depuis GitLab ;
- `src/services/core/` : logique métier de synchronisation et de transformation ;
- `src/repositories/` : accès à la base SQLite ;
- `src/db/` : client SQLite et schéma Drizzle ;
- `src/index.ts` : point d’entrée de test/synchronisation manuelle.

## Usage attendu

Ce repository est principalement prévu pour être :

- lancé en local pendant le développement ;
- utilisé comme brique technique au service du projet Chrysalide ;
- appelé par un script ou un workflow de synchronisation.

## Remarque

Le fichier `src/index.ts` contient surtout un **runner de test** et de validation du flux de synchronisation. Ce dépôt n’est donc pas une application standalone complète, mais bien un **sous-projet technique** destiné à alimenter le projet principal.
