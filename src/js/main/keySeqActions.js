import * as act from './actions';
import * as cu from './cursorUtils';

const keySeqActions = {
  jj: act.goLineDown,
  kk: act.goLineUp,
  kj: act.goLineLeftSmart,
  jk: act.goLineRight,
};

const keySeqAction = cm => {
  const now = new Date().getTime();
  const lapseTime = now - (cm.changedAt || now); // unit: milliseconds
  cm.changedAt = now;

  if (lapseTime < 500) {
    const cursor = cm.getCursor();
    const keySeq = cm.getRange(cu.withOffset(cursor, -2), cursor);
    if (keySeq in keySeqActions) {
      const selections = cm.listSelections();
      const rangesToReplace = selections.map(({ anchor, head }) => {
        return { anchor, head: cu.withOffset(head, -2) };
      });
      cm.setSelections(rangesToReplace);
      cm.replaceSelections(Array(selections.length).fill(''));
      const actionFunc = keySeqActions[keySeq];
      actionFunc(cm);
    }
  }
};

export default cm => {
  // Enable key sequence actions
  if (cm._handlers.keyup.length === 1) {
    cm.on('keyup', keySeqAction);
  }
};
