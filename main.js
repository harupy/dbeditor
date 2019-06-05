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
          sel: 'select(${*cols})',
          cnt: 'count()',
          gb: 'groupBy(${*cols})',
          ob: 'orderBy(${*cols, ascending})',
          pb: 'partitionBy(${*cols}',
          fil: 'filter(${condition})',
          fna: 'fillna(${value})',
          wc: 'withColumn(${colName, col})',
          wcr: 'withColumnRenamed(${existing, new})',
          jo: 'join(${df, on, how})',
          dp: 'display(${df})',
          sh: 'show(${n, truncate})',
          ps: 'printSchema()',
          sam: 'sample(${withReplacement, fraction, seed})',
          dt: 'distinct()',
          dr: 'drop(${*cols})',
          drn: 'dropna(${how, thresh, subset})',
          drd: 'dropDuplicates(${subset})',
          tpd: 'toPandas()',

          // column
          al: 'alias(${str})',
          ow: 'otherwise(${value})',
          ew: 'endswith(${str})',
          ss: 'startswith(${str})',
          isn: 'isNull()',
          isnn: 'isNotNull()',
          isi: 'isin(${*cols})',
          btw: 'between(${lower, upper})',

          // functions
          col: 'F.col(${col})',
          lit: 'F.lit(${col})',
          len: 'F.length(${col})',
          rnd: 'F.round(${col, scale})',
          cntd: 'F.countDistinct(${col})',
          uxt: 'F.unix_timestamp(${timestamp, format})',
          up: 'F.upper(${col})',
          low: 'F.lower(${col})',
          tr: 'F.trim(${col})',
          ltr: 'F.ltrim(${col})',
          rtr: 'F.rtrim(${col})',
          dtad: 'F.date_add(${date})',
          dtsb: 'F.date_sub(${date})',
          dtfmt: 'F.date_format(${date, format})',
          dtdf: 'F.datediff(${end, start})',

          // io
          srt: 'spark.read.table(${tableName})',
          src: 'spark.read.csv(${path})',
          srp: 'spark.read.parquet(${path})',
          wcsv: 'write.csv(${path})',
          wp: 'write.parquet(${path})',
          wop: "write.mode('overwrite').parquet(${path})",
          wap: "write.mode('append').parquet(${path})",
          wep: "write.mode('error').parquet(${path})",
          wip: "write.mode('ignore').parquet(${path})",

          // aggregation
          agcnt: 'agg(F.count(${col}))',
          agcntd: 'agg(F.countDistinct(${col}))',
          agsum: 'agg(F.sum(${col}))',
          agmean: 'agg(F.mean(${col}))',
          agavg: 'agg(F.avg(${col}))',
          agmin: 'agg(F.min(${col}))',
          agmax: 'agg(F.max(${col}))',

          // dbutils
          dwg: 'dbutils.widgets.get(${varName})',
          dnr: 'dbutils.notebook.run(${notebookPath})',
          dne: 'dbutils.notebook.exit(${value})',
          pypi: 'dbutils.library.installPyPI(${packageName})',

          // udf
          udf: '@F.udf(${type})',
          udfstr: '@F.udf(T.StringType())',
          udfbl: '@F.udf(T.BooleanType())',
          udfsht: '@F.udf(T.ShortType())',
          udfint: '@F.udf(T.IntegerType())',
          udflong: '@F.udf(T.LongType())',
          udfflt: '@F.udf(T.FloatType())',
          udfdbl: '@F.udf(T.DoubleType())',

          // others
          scs: 'sqlContext.sql()',
          ftw: 'from pyspark.sql import functions as F, types as T, window as W',
        };

        const replacePlaceholder = (body, cursor, selections = []) => {
          const pattern = /\$\{([^{}]*)\}/;
          const match = body.match(pattern);
          if (!match) {
            return [body, selections];
          } else {
            const [placeholder, defaultStr] = match;
            const head = { line: cursor.line, ch: cursor.ch + match.index };
            const anchor = { line: cursor.line, ch: head.ch + defaultStr.length };
            const newBody = body.replace(placeholder, defaultStr);
            return replacePlaceholder(newBody, cursor, [...selections, { head, anchor }]);
          }
        };

        if (prefix in snippets) {
          const body = snippets[prefix];
          const [newBody, selections] = replacePlaceholder(body, head);
          cm.replaceRange(newBody, head, cursor);
          cm.setSelections(selections);
        } else {
          tabDefaultFunc(cm);
        }
      };

      // shortcuts
      const extraKeyActions = {
        'Ctrl-O': [openBlankLineBelow],
        'Shift-Ctrl-O': [openBlankLineAbove],
        'Alt-Right': ['goWordRight'],
        'Alt-Left': ['goWordLeft'],
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

      Object.entries(extraKeyActions).forEach(([key, actions]) => {
        cellEditing.CodeMirror.options.extraKeys[key] = cm => {
          actions.forEach(act => execAction(cm, act));
        };
      });

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
