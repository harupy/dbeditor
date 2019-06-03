(() => {
  const enhanceCell = event => {
    const cellEditing = document.querySelector('div.is-editing div.CodeMirror');

    if (cellEditing) {
      const goLineLeftSmart = cm => {
        const { line } = cm.getCursor();
        const cursorLine = cm.getLine(line);
        const leadingSpaces = cursorLine.match(/^\s*/)[0];
        cm.setCursor({ line, ch: leadingSpaces.length });
      };

      const duplicateLineBelow = cm => {
        const { line, ch } = cm.getCursor();
        const cursorLine = cm.getLine(line);
        ['goLineRight', 'openLine', 'goLineDown'].forEach(cmd => cm.execCommand(cmd));
        cm.replaceSelection(cursorLine);
        cm.setCursor({ line: line + 1, ch });
      };

      const duplicateLineAbove = cm => {
        const { line, ch } = cm.getCursor();
        const cursorLine = cm.getLine(line);
        ['goLineLeft', 'openLine'].forEach(cmd => cm.execCommand(cmd));
        cm.replaceSelection(cursorLine);
        cm.setCursor({ line, ch });
      };

      const openBlankLineBelow = cm => {
        const { line } = cm.getCursor();
        const cursorLine = cm.getLine(line);
        if (cursorLine.endsWith(':')) {
          ['goLineRight', 'newlineAndIndent'].forEach(cmd => cm.execCommand(cmd));
        } else {
          ['goLineRight', 'openLine', 'goLineDown'].forEach(cmd => cm.execCommand(cmd));
          cm.replaceSelection(cursorLine.match(/^\s*/)[0]);
        }
      };

      const openBlankLineAbove = cm => {
        const { line } = cm.getCursor();
        const cursorLine = cm.getLine(line);
        ['goLineLeft', 'openLine'].forEach(cmd => cm.execCommand(cmd));
        cm.replaceSelection(cursorLine.match(/^\s*/)[0]);
      };

      const delLineLeftSmart = cm => {
        const { line } = cm.getCursor();
        const cursorLine = cm.getLine(line);
        cm.execCommand('delLineLeft');
        cm.replaceSelection(cursorLine.match(/^\s*/)[0]);
      };

      const deleteCursorWord = cm => {
        const cursor = cm.getCursor();
        const anchor = { line: cursor.line, ch: cursor.ch + 1 };
        const charCursorRight = cm.getRange(cursor, anchor);
        const regex = /[a-zA-Z0-9_]/; // characters which can be used in a variable name
        if (charCursorRight.match(regex)) {
          cm.execCommand('goWordRight');
        }
        const rightEdge = cm.getCursor();
        cm.execCommand('goWordLeft');
        const leftEdge = cm.getCursor();
        cm.setCursor(cursor);
        cm.replaceRange('', leftEdge, rightEdge);
      };

      // snippets
      const tabDefaultFunc = cellEditing.CodeMirror.options.extraKeys['Tab'];
      const expandSnippetOrIndent = cm => {
        const cursor = cm.getCursor();
        const cursorLine = cm.getLine(cursor.line);
        const cursorLeft = cursorLine.slice(0, cursor.ch);
        const regex = /[^a-zA-Z0-9_]?([a-zA-Z0-9_]+)$/;
        const match = cursorLeft.match(regex);
        const prefix = match ? match[1] : '';
        const head = { line: cursor.line, ch: cursor.ch - prefix.length };

        const snippets = {
          // DataFrame
          sel: 'select()',
          cnt: 'count()',
          gb: 'groupBy()',
          ob: 'orderBy()',
          pb: 'partitionBy()',
          fil: 'filter()',
          fna: 'fillna()',
          wc: 'withColumn()',
          wcr: 'withColumnRenamed()',
          jo: 'join()',
          dp: 'display()',
          sh: 'show()',
          ps: 'printSchema()',
          sam: 'sample()',
          dt: 'distinct()',
          dr: 'drop()',
          drn: 'dropna()',
          drd: 'dropDuplicates()',
          tpd: 'toPandas()',

          // column
          al: 'alias()',
          ow: 'otherwise()',
          ew: 'endswith()',
          ss: 'startswith()',
          isn: 'isNull()',
          isnn: 'isNotNull()',
          isi: 'isin()',
          btw: 'between()',

          // functions
          col: 'F.col()',
          lit: 'F.lit()',
          len: 'F.length()',
          rnd: 'F.round()',
          cntd: 'F.countDistinct()',
          uxt: 'F.unix_timestamp()',
          up: 'F.upper()',
          low: 'F.lower()',
          tr: 'F.trim()',
          ltr: 'F.ltrim()',
          rtr: 'F.rtrim()',
          dtad: 'F.date_add()',
          dtsb: 'F.date_sub()',
          dtfmt: 'F.date_format()',
          dtdf: 'F.datediff()',

          // io
          src: 'spark.read.csv()',
          srt: 'spark.read.table()',
          srp: 'spark.read.parquet()',
          wcsv: 'write.csv()',
          wp: 'write.parquet()',
          wop: "write.mode('overwrite').parquet()",
          wap: "write.mode('append').parquet()",
          wep: "write.mode('error').parquet()",
          wip: "write.mode('ignore').parquet()",

          // aggregation
          agcnt: 'agg(F.count())',
          agcntd: 'agg(F.countDistinct())',
          agsum: 'agg(F.sum())',
          agmean: 'agg(F.mean())',
          agavg: 'agg(F.avg())',
          agmin: 'agg(F.min())',
          agmax: 'agg(F.max())',

          // dbutils
          dwg: 'dbutils.widgets.get()',
          dnr: 'dbutils.notebook.run()',
          dne: 'dbutils.notebook.exit()',
          pypi: 'dbutils.library.installPyPI()',

          // udf
          udfstr: '@F.udf(T.StringType())\n',
          udfbl: '@F.udf(T.BooleanType())\n',
          udfsht: '@F.udf(T.ShortType())\n',
          udfint: '@F.udf(T.IntegerType())\n',
          udflong: '@F.udf(T.LongType())\n',
          udfflt: '@F.udf(T.FloatType())\n',
          udfdbl: '@F.udf(T.DoubleType())\n',

          // others
          scs: 'sqlContext.sql()',
          ftw: 'from pyspark.sql import functions as F, types as T, window as W',
        };

        if (prefix in snippets) {
          const body = snippets[prefix];
          cm.replaceRange(body, head, cursor);
          const match = body.match(/\)+$/);
          if (match) {
            cm.moveH(-match[0].length, 'char');
          }
        } else {
          tabDefaultFunc(cm);
        }
      };

      // shortcuts
      const extraKeyActions = {
        'Ctrl-O': [openBlankLineBelow],
        'Shift-Ctrl-O': [openBlankLineAbove],
        'Ctrl-L': ['delWrappedLineRight'],
        'Ctrl-H': [delLineLeftSmart],
        'Ctrl-K': [deleteCursorWord],
        'Ctrl-U': [duplicateLineBelow],
        'Shift-Ctrl-U': [duplicateLineAbove],
        Tab: [expandSnippetOrIndent],
      };

      const execAction = (cm, act) => {
        switch (typeof act) {
          case 'string':
            cm.execCommand(act);
            break;
          case 'function':
            act(cm);
            break;
          default:
            throw new TypeError(`Expected string or function, but got ${typeof act}`);
        }
      };

      for (const [key, actions] of Object.entries(extraKeyActions)) {
        cellEditing.CodeMirror.options.extraKeys[key] = cm => {
          actions.forEach(act => execAction(cm, act));
        };
      }

      // key sequences
      const onKeyup = (cm, e) => {
        const anchor = cm.getCursor();
        const head = { line: anchor.line, ch: anchor.ch - 2 };
        const now = new Date().getTime();
        const lapseTime = now - (cm.changedAt || now); // unit: milliseconds
        cm.changedAt = now;

        const fastKeysActions = {
          jj: [goLineLeftSmart],
          jk: ['goLineRight'],
        };

        if (lapseTime < 500) {
          const keys = cm.getRange(head, anchor);
          if (keys in fastKeysActions) {
            cm.replaceRange('', head, anchor);
            fastKeysActions[keys].forEach(act => execAction(cm, act));
          }
        }
      };

      if (cellEditing.CodeMirror._handlers.keyup.length === 1) {
        cellEditing.CodeMirror.on('keyup', onKeyup);
      }
    }
  };

  document.addEventListener('mouseup', enhanceCell, false);
  document.addEventListener('keyup', enhanceCell, false);
})();
