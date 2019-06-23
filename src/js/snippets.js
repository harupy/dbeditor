import * as cu from './cursorUtils';

const snippets = {
  // ${...} represents the placeholder

  // dataframe
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
  sst: 'F.substring(${str, pos, len})',
  rr: 'F.regexp_replace(${str, pattern, replacement})',
  rep: 'F.repeat(${col, n})',
  rev: 'F.reverse(${col})',
  todt: 'F.to_date(${col})',
  dtad: 'F.date_add(${date})',
  dtsb: 'F.date_sub(${date})',
  dtfmt: 'F.date_format(${date, format})',
  dtdf: 'F.datediff(${end, start})',
  sec: 'F.second(${col})',
  epl: 'F.explode(${col})',

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
  udfarr: '@F.udf(T.ArrayType(${dataType}))',

  // others
  scs: 'sqlContext.sql()',
  ftw: 'from pyspark.sql import functions as F, types as T, window as W',
  shcnt: 'select(F.count(${col})).show()',
  asc: 'ascending',
};

const replacePlaceholder = (body, ranges = []) => {
  const pattern = /\$\{([^{}]*)\}/;
  const match = body.match(pattern);
  if (!match) {
    return [body, ranges];
  } else {
    const [placeholder, defaultStr] = match;
    const head = cu.makeCursor(match.index, 0);
    const anchor = cu.withOffset(head, defaultStr.length);
    const newBody = body.replace(placeholder, defaultStr);
    return replacePlaceholder(newBody, [...ranges, { head, anchor }]);
  }
};

const expandSnippet = cm => {
  const lineBeforeCursor = cu.getLineBeforeCursor(cm);
  const regex = /[^a-zA-Z0-9_]?([a-zA-Z0-9_]+)$/;
  const match = lineBeforeCursor.match(regex);
  const prefix = match ? match[1] : '';

  if (prefix && prefix in snippets) {
    const body = snippets[prefix];
    const selections = cm.listSelections();
    const rangesToReplace = selections.map(({ anchor, head }) => {
      return { anchor, head: { line: head.line, ch: head.ch - prefix.length } };
    });
    const [newBody, rangesToSelect] = replacePlaceholder(body);

    const newSelections = selections
      .map(sel => {
        return rangesToSelect.map(range => {
          const anchor = cu.withOffset(cu.mergeCursors(sel.anchor, range.anchor), -prefix.length);
          const head = cu.withOffset(cu.mergeCursors(sel.head, range.head), -prefix.length);
          return { anchor, head };
        });
      })
      .flat();

    cm.setSelections(rangesToReplace);
    cm.replaceSelections(Array(selections.length).fill(newBody));
    cm.setSelections(newSelections);
    return true;
  } else {
    return false;
  }
};

export default cm => {
  // Enable snippets
  const defaultTabFunc = cm.options.extraKeys['Tab'];
  const expandSnippetOrIndent = cm => !expandSnippet(cm) && defaultTabFunc(cm);
  cm.options.extraKeys['Tab'] = expandSnippetOrIndent;
};
