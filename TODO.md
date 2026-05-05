# mtgruling.com — TODO

## Bugs / UX issues

- [ ] **File-a-Ruling modal — "Continue" button (step 1) feels broken.**
  Likely cause: button is disabled until `cards.length >= 1 && title && body` are all set, but the picker requires clicking a dropdown suggestion (typing alone doesn't add a card). Users may not realize they have to pick from the list.
  Location: `modals.jsx:130`

- [ ] **CardPicker affordance unclear.**
  Typing a card name in the picker doesn't add it — you have to click a suggestion or press Enter on the highlighted row. Not obvious. Consider one of:
    - Inline validation errors instead of a disabled button (so clicking Continue tells you what's missing)
    - Stronger visual cue when a query has matches but nothing has been picked yet
    - Auto-select the top match on blur/Enter
  Location: `card-picker.jsx`
