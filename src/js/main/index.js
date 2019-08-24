import enableShortcuts from './shortcuts';
import enableSnippets from './snippets';

(() => {
  const updateCell = () => {
    const cellEditing = document.querySelector('div.is-editing div.CodeMirror');

    if (cellEditing) {
      const cm = cellEditing.CodeMirror;
      enableShortcuts(cm);
      enableSnippets(cm);
    }
  };

  document.addEventListener('mouseup', updateCell, false);
  document.addEventListener('keyup', updateCell, false);
})();
