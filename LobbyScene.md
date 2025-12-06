# Lobby Scene Setup

Hướng dẫn từng bước để dựng `Lobby.scene` theo cấu trúc dự án hiện tại (Cocos Creator 3.x + TypeScript).

## 1) Chuẩn bị prefab & asset
- Icon game: các sprite frame (vd: `textures/ui/lobby/icons/*`).
- Prefab `LobbySlotItem`:
  - Root node với `LobbySlotItem` (scripts/ui/lobby/LobbySlotItem.ts).
  - Child Label: bind `titleLabel`.
  - Child Sprite: bind `iconSprite`.
  - Child Button: bind `playButton` (click → phát sự kiện chọn game).
- Prefab list container (tùy chọn): ScrollView/Content node để chứa item.

## 2) Tạo hierarchy trong Lobby.scene
- Canvas
  - Background (Sprite)
  - UI Root (Node)
    - Header (title/logo nếu cần)
    - GameList (Node hoặc ScrollView → Content)
    - Footer (nút Settings/Exit nếu cần)

## 3) Thêm script LobbyController
- Thêm component `LobbyController` (scripts/ui/lobby/LobbyController.ts) lên node GameList hoặc UI Root.
- Kéo thả:
  - `listRoot` → Content node chứa item.
  - `slotItemPrefab` → prefab `LobbySlotItem`.

## 4) Binding prefab LobbySlotItem
- Mở prefab `LobbySlotItem`:
  - Gắn script `LobbySlotItem` vào root.
  - Kéo Label → `titleLabel`.
  - Kéo Sprite → `iconSprite`.
  - Kéo Button → `playButton`.
  - Đảm bảo Button transition/triggers đã set (CLICK).

## 5) Nạp dữ liệu lobby
- Trong code (vd: Entry/Lobby scene script hoặc GameManager khi chuyển cảnh), gọi:
  ```ts
  import { LobbyController } from './assets/scripts/ui/lobby/LobbyController';

  const slots = [
    { id: 'Slot_Pharaoh', title: 'Pharaoh Riches', icon: 'textures/ui/lobby/icons/pharaoh/spriteFrame' },
    { id: 'Slot_Candy', title: 'Candy Mania', icon: 'textures/ui/lobby/icons/candy/spriteFrame' },
  ];

  lobbyController.populate(slots);
  ```
- Mặc định `LobbySlotItem` khi click sẽ emit `LOBBY_SLOT_SELECTED` và `LobbyController` sẽ load bundle qua `AssetLoader`.

## 6) Xử lý chuyển sang game
- Lắng nghe sự kiện trong script bootstrap (vd: GameManager hoặc scene script):
  ```ts
  import { GlobalEventBus } from './assets/scripts/core/EventBus';
  import { GameManager } from './assets/scripts/core/GameManager';

  GlobalEventBus.on('LOBBY_SLOT_SELECTED', async (bundleName: string) => {
    // Preload bundle (AssetLoader trong LobbyController đã load)
    // Tùy chỉnh: load scene Game.scene hoặc dynamic scene của bundle
    GameManager.getInstance();
    // director.loadScene('Game'); // hoặc load scene từ bundle nếu có
  });
  ```

## 7) Hook Settings/Popups (tùy chọn)
- Thêm nút Settings ở Lobby, click → `PopupManager.getInstance().showPopup('prefabs/ui/popups/PopupSettings')`.
- Lắng nghe `AUDIO_VOLUME_CHANGED` để cập nhật AudioManager/SettingsRepository.

## 8) Safe area & responsive
- Nếu chạy mobile notch: dùng `SafeAreaHelper` (systems/platform/SafeAreaHelper.ts) cho UI Root/Background.

## 9) Kiểm tra nhanh
- Chạy `Lobby.scene` trong editor: kiểm tra list render, click Play có log/emit sự kiện, không lỗi asset missing.

