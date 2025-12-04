# 🎰 Cocos Slot Framework
A comprehensive slot game framework built with **Cocos Creator 3.x + TypeScript**, featuring Reel System, UI Flow, Popup Stack, Spin Controller, FX, Audio, Optimizations, and a modular architecture for easy expansion.

## 📁 Folder Structure
```
assets/
  scenes/
    Lobby.scene
    Game.scene
    Loading.scene

  scripts/
    core/
      GameManager.ts
      SlotStateMachine.ts
      EventBus.ts
      AudioManager.ts
      PopupManager.ts
      ToastManager.ts
      AssetLoader.ts
      TimeService.ts

    game/
      reel/
        ReelController.ts
        ReelGroupController.ts
        ReelConfig.ts
      symbol/
        SymbolView.ts
        SymbolConfig.ts
      result/
        ResultMatrix.ts
        LineEvaluator.ts
        PaylineConfig.ts
      spin/
        SpinController.ts
        SpinInputHandler.ts
      fx/
        WinEffectsController.ts
        CoinPool.ts
        BigWinShaderController.ts

    ui/
      common/
        ButtonScaleEffect.ts
        ToggleButtonGroup.ts
        ProgressBarController.ts

      hud/
        HudController.ts
        BalancePanel.ts
        BetPanel.ts
        AutoSpinPanel.ts
        SpinButtonController.ts

      popups/
        PopupBase.ts
        PopupSettings.ts
        PopupResult.ts
        PopupPause.ts
        PopupPaytable.ts

      lobby/
        LobbyController.ts
        LobbySlotItem.ts

      loading/
        LoadingController.ts

    systems/
      network/
        SlotApiClient.ts
        SlotSession.ts
      storage/
        PlayerPrefs.ts
        SettingsRepository.ts
      platform/
        DeviceInfo.ts
        SafeAreaHelper.ts

    data/
      SlotGameConfig.ts
      SymbolDefinitions.ts
      PaytableData.ts
      types/
        SlotTypes.ts

  prefabs/
    game/
    ui/
      popups/
      common/

  textures/
    symbols/
    ui/
    background/
    atlas/

  audio/
    bgm/
    sfx/

  particles/
  spine/

  bundles/
    Slot_Pharaoh/
    Slot_Candy/
```

## 🧠 Architecture
### 1. Core Layer
- GameManager
- SlotStateMachine
- PopupManager
- EventBus
- AudioManager
- ToastManager
- AssetLoader
- TimeService

### 2. Game Layer (Slot Logic)
- ReelController
- ReelGroupController
- SymbolView
- ResultMatrix
- LineEvaluator
- SpinController
- SpinInputHandler
- WinEffectsController
- CoinPool

### 3. UI Layer
- HUD panels
- Popup system
- Lobby
- Loading
- Shared UI components

### 4. Systems
- SlotApiClient
- SlotSession
- PlayerPrefs
- SettingsRepository
- SafeAreaHelper

### 5. Data Layer
- SlotGameConfig
- SymbolDefinitions
- PaytableData
- SlotTypes

## 📌 Naming Conventions

### Scripts
- Managers: GameManager, AudioManager
- Controllers: ReelController, SpinController
- View: SymbolView
- Config: SymbolConfig, ReelConfig
- Utils: MathUtils

### Prefabs
- PopupSettings.prefab
- HudRoot.prefab
- ToastMessage.prefab
- Symbol.prefab

### Events
```
SLOT_SPIN_REQUESTED
SLOT_SPIN_STARTED
SLOT_RESULT_READY
SLOT_REEL_STOPPED
SLOT_WIN_APPLIED
```

## ▶️ Running the Project
1. Install Cocos Creator 3.x
2. Clone this repository
3. Open project in Cocos Creator
4. Run `Lobby.scene` or `Game.scene`

## 📈 Development Roadmap
- Week 1–2: Core Reel + State Machine
- Week 3–4: UI Flow + Popups
- Week 5: Audio + FX
- Week 6–7: Optimization + Bundles

## 📜 License
MIT License

## ✨ Author
Owen Phan
