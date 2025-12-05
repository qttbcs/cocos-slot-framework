import { view, UITransform, Node } from 'cc';

/**
 * Utility to pad UI nodes according to device safe area (notch devices).
 */
export class SafeAreaHelper {
  applySafeArea(node: Node): void {
    const transform = node.getComponent(UITransform);
    if (!transform) return;
    const safe = view.getSafeAreaRect();
    const frame = view.getFrameSize();
    const top = frame.height - safe.yMax;
    const bottom = safe.y;
    const left = safe.x;
    const right = frame.width - safe.xMax;
    transform.setAnchorPoint(0.5, 0.5);
    transform.setContentSize(frame.width - left - right, frame.height - top - bottom);
    node.setPosition(0, 0);
  }
}
