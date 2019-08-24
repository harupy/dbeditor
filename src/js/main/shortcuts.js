import * as act from './actions';

const shortcuts = {
  'Ctrl-O': act.openBlankLineBelow,
  'Shift-Ctrl-O': act.openBlankLineAbove,
  'Alt-Right': act.goWordRight,
  'Alt-Left': act.goWordLeft,
  'Ctrl-L': act.delWrappedLineRight,
  'Ctrl-H': act.delLineLeftSmart,
  'Ctrl-K': act.deleteCursorWord,
  'Ctrl-U': act.duplicateLineBelow,
  'Shift-Ctrl-U': act.duplicateLineAbove,
};

export default cm => {
  // Enable shortcuts
  Object.entries(shortcuts).forEach(([key, actionFunc]) => {
    cm.options.extraKeys[key] = actionFunc;
  });
};
