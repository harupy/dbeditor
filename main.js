(() => {
  const enhanceCell = event => {
    const cellEditing = document.querySelector('div.is-editing div.CodeMirror');

    if (cellEditing) {
      // ----- snippets -----
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
          gb: 'groupBy(${*cols})',
          ob: 'orderBy(${*cols, ascending})',
          pb: 'partitionBy(${*cols})',
          fil: 'filter(${condition})',
          fna: 'fillna(${value})',
          wc: 'withColumn(${colName, col})',
          wcr: 'withColumnRenamed(${existing, new})',
          jo: 'join(${other, on, how})',
          un: 'union(${other})',
          dp: 'display(${df_or_fig})',
          dph: 'displayHTML(${html})',
          sh: 'show(${nrows, truncate})',
          ps: 'printSchema()',
          sam: 'sample(${withReplacement, fraction, seed})',
          samb: 'sampleBy(${col, fractions, seed=None})',
          st: 'subtract(${other})',
          dt: 'distinct()',
          dr: 'drop(${*cols})',
          drn: 'dropna(${how, thresh, subset})',
          drd: 'dropDuplicates(${subset})',
          tpd: 'toPandas()',

          // column
          al: 'alias(${alias})',
          ca: 'cast(${dataType})',
          at: 'astype(dataType)',
          ow: 'otherwise(${value})',
          ew: 'endswith(${other})',
          ss: 'startswith(${other})',
          isn: 'isNull()',
          isnn: 'isNotNull()',
          isi: 'isin(${*cols})',
          btw: 'between(${lower, upper})',

          // functions
          col: 'F.col(${col})',
          lit: 'F.lit(${col})',
          std: 'F.stddev(${col})',
          sumd: 'F.sumDistinct(${col})',
          len: 'F.length(${col})',
          rnd: 'F.round(${col, scale})',
          cnt: 'F.count(${col})',
          cntd: 'F.countDistinct(${col})',
          uxt: 'F.unix_timestamp(${timestamp, format})',
          up: 'F.upper(${col})',
          low: 'F.lower(${col})',
          tr: 'F.trim(${col})',
          ltr: 'F.ltrim(${col})',
          rtr: 'F.rtrim(${col})',
          ss: 'F.substring(${str, pos, len})',
          rr: 'F.regexp_replace(${str, pattern, replacement})',
          rep: 'F.repeat(${col, n})',
          rev: 'F.reverse(${col})',
          todt: 'F.to_date(${col})',
          dtad: 'F.date_add(${date})',
          dtsb: 'F.date_sub(${date})',
          dtfmt: 'F.date_format(${date, format})',
          dtdf: 'F.datediff(${end, start})',
          sec: 'F.second(${col})',

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
          ag: 'agg(${*exprs})',
          agcnt: 'agg(F.count(${col}))',
          agcntd: 'agg(F.countDistinct(${col}))',
          agsum: 'agg(F.sum(${col}))',
          agsumd: 'agg(F.sumDistinct(${col}))',
          agmn: 'agg(F.mean(${col}))',
          agavg: 'agg(F.avg(${col}))',
          agmin: 'agg(F.min(${col}))',
          agmax: 'agg(F.max(${col}))',

          // aggregation with alias
          agcnta: "agg(F.count('${col}').alias('${col}_cnt'))",
          agcntda: "agg(F.countDistinct('${col}').alias('${col}_cntd'))",
          agsuma: "agg(F.sum('${col}').alias('${col}_sum'))",
          agsumda: "agg(F.sumDistinct('${col}').alias('${col}_sumd'))",
          agmna: "agg(F.mean('${col}').alias('${col}_mean'))",
          agavga: "agg(F.ave('${col}').alias('${col}_avg'))",
          agmina: "agg(F.min('${col}').alias('${col}_min'))",
          agmaxa: "agg(F.max('${col}').alias('${col}_max'))",

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

        const replacePlaceholder = (body, selections = []) => {
          const pattern = /\$\{([^{}]*)\}/;
          const match = body.match(pattern);
          if (!match) {
            return [body, selections];
          } else {
            const [placeholder, defaultStr] = match;
            const head = { line: 0, ch: match.index };
            const anchor = { line: 0, ch: head.ch + defaultStr.length };
            const newBody = body.replace(placeholder, defaultStr);
            return replacePlaceholder(newBody, [...selections, { head, anchor }]);
          }
        };

        if (prefix in snippets) {
          const body = snippets[prefix];
          const selections = cm.listSelections();
          const rangesToReplace = selections.map(({ anchor, head }) => {
            return { anchor, head: { line: head.line, ch: head.ch - prefix.length } };
          });
          const [newBody, offsets] = replacePlaceholder(body);

          const newSelectionsList = selections.map(({ anchor: anchorSel, head: headSel }) => {
            return offsets.map(({ anchor: anchorOffset, head: headOffset }) => {
              const anchor = {
                ch: anchorSel.ch + anchorOffset.ch - prefix.length,
                line: anchorSel.line + anchorOffset.line,
              };
              const head = {
                ch: headSel.ch + headOffset.ch - prefix.length,
                line: headSel.line + headOffset.line,
              };
              return { anchor, head };
            });
          });
          cm.setSelections(rangesToReplace);
          cm.replaceSelections(Array(selections.length).fill(newBody));
          cm.setSelections(newSelectionsList.flat());
        } else {
          tabDefaultFunc(cm);
        }
      };

      // ----- shortcuts -----
      const getCursorLine = cm => {
        const { line } = cm.getCursor();
        return cm.getLine(line);
      };

      const getCursorShift = (cm, hShift = 0, vShift = 0) => {
        const { line, ch } = cm.getCursor();
        return { ch: ch + hShift, line: line + vShift };
      };

      const goLineLeftSmart = cm => {
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

      const duplicateLineBelow = cm => {
        const selections = cm.listSelections();
        const cursorLines = selections.map(({ head }) => cm.getLine(head.line));
        ['goLineRight', 'openLine', 'goLineDown'].forEach(cmd => cm.execCommand(cmd));
        cm.replaceSelections(cursorLines);
        const newSelections = selections.map(({ head: headSel, anchor: anchorSel }, idx) => {
          const head = { ch: headSel.ch, line: headSel.line + idx + 1 };
          const anchor = { ch: anchorSel.ch, line: anchorSel.line + idx + 1 };
          return { head, anchor };
        });
        cm.setSelections(newSelections);
      };

      const duplicateLineAbove = cm => {
        const selections = cm.listSelections();
        const cursorLines = selections.map(({ head }) => cm.getLine(head.line));
        ['goLineLeft', 'openLine'].forEach(cmd => cm.execCommand(cmd));
        cm.replaceSelections(cursorLines);
        const newSelections = selections.map(({ head: headSel, anchor: anchorSel }, idx) => {
          const head = { ch: headSel.ch, line: headSel.line + idx };
          const anchor = { ch: anchorSel.ch, line: anchorSel.line + idx };
          return { head, anchor };
        });
        cm.setSelections(newSelections);
      };

      const openBlankLineBelow = cm => {
        const cursorLine = getCursorLine(cm);
        ['goLineRight', 'openLine', 'goLineDown'].forEach(cmd => cm.execCommand(cmd));
        cm.replaceSelection(cursorLine.match(/^\s*/)[0]);
      };

      const openBlankLineAbove = cm => {
        const cursorLine = getCursorLine(cm);
        ['goLineLeft', 'openLine'].forEach(cmd => cm.execCommand(cmd));
        cm.replaceSelection(cursorLine.match(/^\s*/)[0]);
      };

      const delLineLeftSmart = cm => {
        const cursorLine = getCursorLine(cm);
        cm.execCommand('delLineLeft');
        cm.replaceSelection(cursorLine.match(/^\s*/)[0]);
      };

      const deleteCursorWord = cm => {
        const cursor = cm.getCursor();
        const anchor = getCursorShift(cm, 1);
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

      const useDefaultAction = actionName => cm => {
        cm.execCommand(actionName);
      };

      const extraKeyActions = {
        'Ctrl-O': openBlankLineBelow,
        'Shift-Ctrl-O': openBlankLineAbove,
        'Alt-Right': useDefaultAction('goWordRight'),
        'Alt-Left': useDefaultAction('goWordLeft'),
        'Ctrl-L': useDefaultAction('delWrappedLineRight'),
        'Ctrl-H': delLineLeftSmart,
        'Ctrl-K': deleteCursorWord,
        'Ctrl-U': duplicateLineBelow,
        'Shift-Ctrl-U': duplicateLineAbove,
        Tab: expandSnippetOrIndent,
      };

      Object.entries(extraKeyActions).forEach(([key, actionFunc]) => {
        cellEditing.CodeMirror.options.extraKeys[key] = actionFunc;
      });

      // ----- key-sequence action -----
      const onKeyup = (cm, e) => {
        const anchor = cm.getCursor();
        const head = getCursorShift(cm, -2, 0);
        const now = new Date().getTime();
        const lapseTime = now - (cm.changedAt || now); // unit: milliseconds
        cm.changedAt = now;

        const keySequenceActions = {
          jj: useDefaultAction('goLineDown'),
          kk: useDefaultAction('goLineUp'),
          kj: goLineLeftSmart,
          jk: useDefaultAction('goLineRight'),
        };

        if (lapseTime < 500) {
          const keySequence = cm.getRange(head, anchor);
          if (keySequence in keySequenceActions) {
            const selections = cm.listSelections();
            const rangesToReplace = selections.map(({ anchor, head }) => {
              return { anchor, head: { line: head.line, ch: head.ch - 2 } };
            });
            cm.setSelections(rangesToReplace);
            cm.replaceSelections(Array(selections.length).fill(''));
            const actionFunc = keySequenceActions[keySequence];
            actionFunc(cm);
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
