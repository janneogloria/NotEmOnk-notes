// Central icon registry — all PNG assets from /icons folder.
// Add or swap icons here without touching any screen files.

const icons = {
  // ── Bottom Navigation ──────────────────────────────────────
  homeDefault:        require('../../icons/home selected.png'),
  homeSelected:       require('../../icons/home selected.png'),
  searchDefault:      require('../../icons/search default.png'),
  searchSelected:     require('../../icons/search selected.png'),
  categoriesDefault:  require('../../icons/categories default.png'),
  categoriesSelected: require('../../icons/categories selected.png'),
  remindersDefault:   require('../../icons/reminders default.png'),
  remindersSelected:  require('../../icons/reminders selected.png'),
  moreDefault:        require('../../icons/more default.png'),
  moreSelected:       require('../../icons/more default.png'),

  // ── Reminders Screen ───────────────────────────────────────
  notification:       require('../../icons/notification.png'),  // urgent banner bell
  remindersIcon:      require('../../icons/reminders default.png'), // alarm clock in time badge

  // ── Note Card ─────────────────────────────────────────────
  favoriteStar:       require('../../icons/favorite star default.png'),
  favoriteStarFilled: require('../../icons/favorite star selected.png'),

  // ── Create Note — Attachment Bar ──────────────────────────
  photo:    require('../../icons/photo.png'),
  file:     require('../../icons/file.png'),
  audio:    require('../../icons/audio.png'),
  location: require('../../icons/location.png'),
  draw:     require('../../icons/draw.png'),

  // ── Misc ──────────────────────────────────────────────────
  history:  require('../../icons/history.png'),
  wordList: require('../../icons/word list.png'),
};

export default icons;