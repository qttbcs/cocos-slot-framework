# Hướng dẫn popup prefabs (Cocos Creator 3.x)

Tài liệu này mô tả cách tạo và sử dụng các prefab popup trong thư mục `assets/prefabs/popups` cùng với các script trong `assets/scripts/ui/popups`.

## Kiến trúc và luồng
- `GameManager` gán `popupRoot` (node full màn hình dưới Canvas) cho `PopupManager`. Mọi popup được instantiate sẽ gắn làm con của `popupRoot`.
- `PopupManager.showPopup(pathOrPrefab, { key? })` nhận đường dẫn prefab hoặc đối tượng Prefab, instantiate và đẩy vào stack (để đảm bảo modal ordering). `closeTop/closeByKey/closeAll` phá hủy node tương ứng.
- Mỗi popup kế thừa `PopupBase`, dùng tween scale 0.8→1 khi mở và 1→0.8 khi đóng; `open()` kích hoạt và play tween, `close(cb)` play tween rồi gọi callback (thường để `destroy`).

## Cấu trúc prefab chuẩn
```
PopupX (root)
  - Overlay (tùy chọn, Sprite/Mask mờ, full-screen, gán vào `overlay`)
  - Content (container chính, center align)
      - ... controls (Button/Label/Toggle/ScrollView tùy popup)
```
Khuyến nghị:
- Root: `UITransform` + `Widget` (Left/Right/Top/Bottom = 0) để full màn hình; thêm `BlockInputEvents` nếu cần chặn click nền.
- Overlay: Sprite màu đen alpha ~120–160; scale = (1,1,1); gán vào trường `overlay` của script.
- Content: đặt giữa màn hình (Widget center hoặc Position = 0,0); scale mặc định 1.
- Luôn gọi `open()` sau khi instantiate nếu script không tự gọi.

## Wiring từng popup
- `PopupPause` (`PopupPause.ts` / `PopupPause.prefab`)
  - Gán `resumeButton`, `quitButton` (Button). Resume emit `PAUSE_CHANGED=false`, Quit emit `GAME_QUIT`. Đóng bằng `closeWithDestroy()`.
- `PopupPaytable` (`PopupPaytable.ts` / `PopupPaytable.prefab`)
  - Gán `closeButton` (Button) và `scrollView` (ScrollView). Close sẽ destroy node.
- `PopupResult` (`PopupResult.ts` / `PopupResult.prefab`)
  - Gán `winLabel` (Label) và `closeButton` (Button). Gọi `showWin(amount)` sau khi instantiate để set text và mở popup.
- `PopupSettings` (`PopupSettings.ts` / `PopupSettings.prefab`)
  - Gán `bgmToggle`, `sfxToggle`, `closeButton`. `applySettings()` emit `AUDIO_VOLUME_CHANGED` cho `bgm`/`sfx` (1 nếu bật, 0 nếu tắt). Close sẽ destroy node.

## Sử dụng nhanh
```ts
// giả sử GameManager đã bind popupRoot
const node = await GameManager.getInstance().popups.showPopup('prefabs/popups/PopupPause');
// nếu cần gọi open() thủ công (khi script không auto-open)
node?.getComponent('PopupPause')?.open();
```

## Lưu ý
- Đảm bảo prefab đã có `UITransform`/`Widget`; nếu thiếu `Widget`, root có thể không phủ đủ màn hình.
- `popupRoot` cần nằm trong scene entry và node `GameManager` được đánh dấu persistent trong `onLoad`, để popup vẫn hoạt động sau khi đổi scene.
- Nếu thêm popup mới, tuân theo cấu trúc root + overlay + content, và wiring các @property trong Inspector.
