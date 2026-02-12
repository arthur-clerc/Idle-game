# Chivalry Journey - Architecture modulaire ES6

## Vue d'ensemble

Le jeu a été refactorisé en modules ES6 pour améliorer la maintenabilité, les performances et corriger les bugs.

## Structure des dossiers

```
src/
├── core/              # Modules fondamentaux
│   ├── EventBus.js    # Système pub/sub pour communication découplée
│   ├── GameState.js   # État centralisé du jeu (singleton)
│   └── StorageManager.js # Gestion localStorage avec erreurs
├── modules/           # Modules métier
│   ├── gold/          # Gestion de l'or
│   ├── inventory/     # Shop et inventaire
│   ├── progress/      # Barre de progression
│   ├── character/     # Apparence du personnage
│   ├── chest/         # Coffres et bonus
│   └── parallax/      # Effet parallaxe
├── ui/                # Coordination UI
│   ├── PanelManager.js    # Toggle shop/inventaire
│   └── UIController.js    # Coordination globale UI
├── utils/             # Utilitaires
│   ├── AnimationLoop.js   # Loop unique requestAnimationFrame
│   ├── DOMCache.js        # Cache des requêtes DOM
│   ├── DataLoader.js      # Chargement JSON
│   └── validators.js      # Validation données
└── main.js            # Point d'entrée
```

## Principes architecturaux

### 1. GameState - Source unique de vérité
- Centralise toutes les données du jeu
- Émet des événements sur les changements
- Gère la persistence localStorage
- **Corrige le bug** : `currentGold` n'est plus une variable globale

### 2. EventBus - Communication découplée
- Pattern Observer/pub-sub
- Les modules s'abonnent aux événements qui les concernent
- Exemple : `gameState.addGold()` → émet `gold:changed` → `GoldUI` met à jour

### 3. Séparation Manager/UI
- **Manager** : Logique métier pure
- **UI** : Affichage et événements DOM
- Facilite les tests et la maintenance

### 4. AnimationLoop unique
- Un seul `requestAnimationFrame` pour tout
- **Corrige le bug** : Plus de création multiple d'intervals
- Émet `frame` (60fps) et `tick` (1/sec)
- Optimisation : pause automatique quand onglet inactif

### 5. DOMCache
- Toutes les requêtes DOM faites une fois au démarrage
- **Optimisation** : Économise ~50+ requêtes par cycle

## Flux de données typique

### Clic sur l'ennemi
```
User click
  → UIController.setupEnemyClickHandler()
    → GoldManager.handleClick()
      → GameState.addGold(goldPerClick)
        → EventBus.emit('gold:changed')
          → GoldUI.updateCurrentGold()
```

### Achat d'un item
```
User click item
  → InventoryUI click handler (event delegation)
    → InventoryManager.purchaseItem(itemId)
      → GameState.addItem()
        → GameState.addGold(-price)
        → GameState.recalculateGoldPerSec()
        → GameState.checkArmorSetCompletion()
        → EventBus.emit('inventory:itemAdded')
          → InventoryUI.updateShopDisplay()
          → CharacterManager.updateAppearance()
```

## Bugs corrigés

1. ✅ **Variable `currentGold` globale** : Maintenant centralisée dans GameState
2. ✅ **Interval goldPerSec recréé** : Remplacé par AnimationLoop unique
3. ✅ **Incohérences string/number** : StorageManager gère les conversions
4. ✅ **Pas de gestion d'erreur localStorage** : Try/catch dans StorageManager
5. ✅ **Duplication sprite personnage** : Une seule méthode dans CharacterManager
6. ✅ **Toggle shop/inventory complexe** : Simplifié avec PanelManager

## Optimisations

1. **AnimationLoop** : requestAnimationFrame au lieu de setInterval
2. **DOMCache** : Requêtes DOM effectuées une fois
3. **Event delegation** : 1 listener au lieu de 16 pour le shop
4. **Parallax optimisé** : Mis à jour via RAF, pas sur chaque mousemove
5. **Progress bar** : Utilise transform pour meilleure performance GPU

## Compatibilité

✅ **100% rétrocompatible** avec les sauvegardes existantes
- GameState.load() lit l'ancien format localStorage
- GameState.save() écrit dans l'ancien format

## Comment ajouter une nouvelle feature

### Nouveau tier d'armure
1. Ajouter à `data.json`
2. Mettre à jour `CharacterManager.spriteMap`
3. Mettre à jour `GameState.updateGoldPerClickFromSet()`

### Nouvel item de coffre
1. Ajouter à `bonus.json`
2. Automatiquement intégré (pas de code à changer)

### Nouveau système (achievements, quêtes, etc.)
1. Créer `src/modules/newSystem/`
2. Créer `NewSystemManager.js` et `NewSystemUI.js`
3. S'abonner aux événements EventBus pertinents
4. Initialiser dans `main.js`

## Tests

Pour tester après modifications :

1. **Chargement** : Vérifier console (pas d'erreurs)
2. **Sauvegarde** : Rafraîchir → données persistent
3. **Clic ennemi** : Or augmente, progress augmente
4. **Achat item** : Or diminue, item dans inventaire
5. **Gold/sec** : Attendre 10 secondes, vérifier augmentation
6. **Coffre** : Cliquer coffre, vérifier bonus dans inventaire
7. **Armure complète** : Acheter set complet, vérifier sprite change

## Performance

Avant refactoring :
- Multiples setInterval actifs
- ~50+ requêtes DOM répétées par frame
- 16+ event listeners individuels

Après refactoring :
- 1 requestAnimationFrame
- Requêtes DOM mises en cache
- Event delegation (1 listener)
- **Résultat** : 60fps stable, pas de ralentissement
