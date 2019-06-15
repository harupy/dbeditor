import enableShortcuts from './shortcuts';
import enableSnippets from './snippets';
import enableKeySeqActions from './keySeqActions';

(() => {
  const updateCell = () => {
    const cellEditing = document.querySelector('div.is-editing div.CodeMirror');

    if (cellEditing) {
      const cm = cellEditing.CodeMirror;
      enableShortcuts(cm);
      enableSnippets(cm);
      enableKeySeqActions(cm);
    }
  };

  document.addEventListener('mouseup', updateCell, false);
  document.addEventListener('keyup', updateCell, false);
})();
