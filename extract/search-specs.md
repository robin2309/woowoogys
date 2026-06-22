Les 4 étapes de la meilleure pratique

    Extraction : Lire la première ligne commençant par # dans chaque fichier .md.

    Normalisation : Mettre tout le texte en minuscules et retirer les accents (ex: "Bœuf" devient "boeuf", "Pâté" devient "pate"). Cela permet à l'utilisateur de chercher sans se soucier de la casse ou des accents.

    Tokenization & Nettoyage : Séparer la phrase en mots (tokens) en utilisant les espaces et la ponctuation comme séparateurs, puis ignorer les caractères spéciaux.

    Filtrage des "Stop-words" : Retirer les mots de liaison qui n'ont aucune valeur de recherche (de, le, la, des, un, et, aux...). Dans ton exemple, on ne veut probablement pas de clé "de": ["carpaccio-de-buf.md"].

    pour chaque clé dans l'index, relie-la à un objet {fileName: 'carpaccio-de-buf.md', title: 'Carpaccio de boeuf'} ou le title est le Heading 1 du fichier .md

    écris le résultat dans un fichier nommé search-index.json