import { SymbolConfigMap } from '../game/symbol/SymbolConfig';

// Declare all symbols used by the slot game: id, name, type, asset path, payouts.
export const SymbolDefinitions: SymbolConfigMap = {
  1: { id: 1, name: 'Ace', sprite: 'symbols/A', payout: [0, 2, 5, 10], type: 'normal' },
  2: { id: 2, name: 'King', sprite: 'symbols/K', payout: [0, 2, 5, 8], type: 'normal' },
  3: { id: 3, name: 'Queen', sprite: 'symbols/Q', payout: [0, 1, 4, 7], type: 'normal' },
  4: { id: 4, name: 'Jack', sprite: 'symbols/J', payout: [0, 1, 3, 6], type: 'normal' },
  5: { id: 5, name: 'Ten', sprite: 'symbols/10', payout: [0, 1, 3, 5], type: 'normal' },
  10: { id: 10, name: 'Gem Red', sprite: 'symbols/GemRed', payout: [0, 3, 8, 15], type: 'normal' },
  11: { id: 11, name: 'Gem Blue', sprite: 'symbols/GemBlue', payout: [0, 3, 8, 12], type: 'normal' },
  12: { id: 12, name: 'Gem Green', sprite: 'symbols/GemGreen', payout: [0, 2, 6, 10], type: 'normal' },
  99: { id: 99, name: 'Wild', sprite: 'symbols/Wild', payout: [0, 0, 10, 20], type: 'wild', substitutes: [] },
  100: { id: 100, name: 'Scatter', sprite: 'symbols/Scatter', payout: [0, 0, 0, 50], type: 'scatter' },
  101: { id: 101, name: 'Bonus', sprite: 'symbols/Bonus', payout: [0, 0, 0, 0], type: 'bonus' },
};
