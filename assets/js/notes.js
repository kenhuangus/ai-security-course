/* ============================================================
   Speaker notes for html-slides decks.
   Additive: listens to the engine's `deck:slide` event, does not modify deck.js.
   Author notes as <aside class="notes"> inside a slide.
   Press N to toggle the panel. Notes always print.
   ============================================================ */
(function () {
  const css = `
    aside.notes { display: none; }
    #notesPanel {
      position: fixed; right: 0; bottom: var(--ctrl-h); width: min(420px, 34vw);
      max-height: calc(100vh - var(--bar-h) - var(--ctrl-h) - 4vh);
      overflow-y: auto; z-index: 55;
      background: #0f141c; color: #d6deeb;
      border: 1px solid #222d3f; border-right: none; border-radius: 10px 0 0 10px;
      padding: 0.9rem 1.1rem; box-shadow: -8px 0 24px rgba(0,0,0,.35);
      font-family: var(--sans); font-size: 0.92rem; line-height: 1.5;
      transform: translateX(105%); transition: transform .22s ease;
    }
    #notesPanel.is-open { transform: none; }
    #notesPanel h4 {
      font-family: var(--mono); font-size: .72rem; letter-spacing: .08em;
      text-transform: uppercase; color: var(--accent-2); margin: 0 0 .5rem;
    }
    #notesPanel p { margin: 0 0 .6rem; }
    #notesPanel strong { color: #fff; }
    #notesPanel .empty { color: #6b7688; font-style: italic; }
    @media print {
      #notesPanel { display: none; }
      aside.notes {
        display: block; margin-top: 1rem; padding-top: .6rem;
        border-top: 1px dashed #999; font-size: .8rem; color: #333;
      }
      aside.notes::before { content: "Speaker notes: "; font-weight: 700; }
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const panel = document.createElement('div');
  panel.id = 'notesPanel';
  panel.setAttribute('aria-live', 'polite');
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(panel));
  if (document.readyState !== 'loading') document.body.appendChild(panel);

  let open = false;

  function render(slide) {
    const notes = slide && slide.querySelector('aside.notes');
    const title = (slide && slide.dataset.title) || '';
    panel.innerHTML = '<h4>Notes · ' + title + '</h4>' +
      (notes ? notes.innerHTML : '<p class="empty">No notes on this slide.</p>');
  }

  document.addEventListener('deck:slide', e => render(e.detail.slide));

  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target && e.target.tagName) || '')) return;
    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      open = !open;
      panel.classList.toggle('is-open', open);
      if (open) render(document.querySelector('.slide.is-active'));
    }
  });
})();
