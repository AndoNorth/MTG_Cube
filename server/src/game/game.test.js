const { Hello, DraftingSession } = require('./game')
// describe('Setup', () => {test('Setup game state correctly', () => {});});
describe('Draft Setup', () => {
  test('Simulate a draft setup', () => {
    var pack_size = 15;
    var no_packs = 3;
    var no_players = 8;
    var draft = new DraftingSession(pack_size, no_packs, no_players);
    draft.createSession();
  });
});