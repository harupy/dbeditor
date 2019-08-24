import * as cu from './cursorUtils';

export const useDefaultAction = actionName => cm => {
  cm.execCommand(actionName);
};

// Actions defined by default in CodeMirror
export const goLineRight = useDefaultAction('goLineRight');
export const goLineLeft = useDefaultAction('goLineLeft');
export const goLineDown = useDefaultAction('goLineDown');
export const goLineUp = useDefaultAction('goLineUp');
export const openLine = useDefaultAction('openLine');
export const delLineLeft = useDefaultAction('delLineLeft');
export const goWordRight = useDefaultAction('goWordRight');
export const goWordLeft = useDefaultAction('goWordLeft');
export const delWrappedLineRight = useDefaultAction('delWrappedLineRight');

export const goLineLeftSmart = cm => {
  const selections = cm.listSelections();
  const newSelections = selections.map(({ head: headSel }) => {
    const cursorLine = cm.getLine(headSel.line);
    const leadingSpaces = cursorLine.match(/^\s*/)[0];
    const head = { line: headSel.line, ch: leadingSpaces.length };
    const anchor = head;
    return { head, anchor };
  });

  cm.setSelections(newSelections);
};

export const duplicateLineBelow = cm => {
  const selections = cm.listSelections();
  const cursorLines = selections.map(({ head }) => cm.getLine(head.line));
  [goLineRight, openLine, goLineDown].forEach(fn => fn(cm));
  cm.replaceSelections(cursorLines);
  const newSelections = selections.map(({ head, anchor }, idx) => {
    const newHead = cu.withOffset(head, 0, idx + 1);
    const newAnchor = cu.withOffset(anchor, 0, idx + 1);
    return { head: newHead, anchor: newAnchor };
  });
  cm.setSelections(newSelections);
};

export const duplicateLineAbove = cm => {
  const selections = cm.listSelections();
  const cursorLines = selections.map(({ head }) => cm.getLine(head.line));
  [goLineLeft, openLine].forEach(fn => fn(cm));
  cm.replaceSelections(cursorLines);
  const newSelections = selections.map(({ head, anchor }, idx) => {
    const newHead = cu.withOffset(head, 0, idx);
    const newAnchor = cu.withOffset(anchor, 0, idx);
    return { head: newHead, anchor: newAnchor };
  });
  cm.setSelections(newSelections);
};

export const openBlankLineBelow = cm => {
  const cursorLine = cu.getCursorLine(cm);
  [goLineRight, openLine, goLineDown].forEach(fn => fn(cm));
  cm.replaceSelection(cursorLine.match(/^\s*/)[0]);
};

export const openBlankLineAbove = cm => {
  const cursorLine = cu.getCursorLine(cm);
  [goLineLeft, openLine].forEach(fn => fn(cm));
  cm.replaceSelection(cursorLine.match(/^\s*/)[0]);
};

export const delLineLeftSmart = cm => {
  const cursorLine = cu.getCursorLine(cm);
  delLineLeft(cm);
  cm.replaceSelection(cursorLine.match(/^\s*/)[0]);
};

export const deleteCursorWord = cm => {
  const cursor = cm.getCursor();
  const charCursorRight = cm.getRange(cursor, cu.withOffset(cursor, 1));
  const regex = /[a-zA-Z0-9_]/;
  if (charCursorRight.match(regex)) {
    goWordRight(cm);
  }
  const anchor = cm.getCursor();
  goWordLeft(cm);
  const head = cm.getCursor();
  cm.setCursor(cursor); // reset the cursor position
  cm.replaceRange('', head, anchor);
};
