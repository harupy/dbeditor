# DBEditor

Code **FASTER** on Databricks

<kbd>
  <img src="https://user-images.githubusercontent.com/17039389/53938304-21371780-40f3-11e9-949e-00c38dddf488.gif">
</kbd>

## What this extension provides

- Shortcuts
- Key-Sequence Action
- Code Snippets

## Installation

[DBEditor - Chrome Web Store](https://chrome.google.com/webstore/detail/dbeditor/nlnifkmijjmmoaindmhbcdfinkcmfafj)

## Getting Started

1. Open a Databricks notebook on the browser
1. Make sure the extension logo is enabled (the extension logo is enabled)
1. Select a cell and enter the edit mode
1. Type `df.gb`
1. Press `Tab` (`gb` will be expanded to `groupBy()`)
1. Press `Ctrl-U` (The current line will be duplicated below)

## Customize

1. Clone this repository
1. Edit the source code
1. Open `chrome://extensions` on Chrome
1. Enable `Developer mode`
1. Click `Load unpacked`
1. Select the extension directory

## Shortcuts

**Note that some default shortcuts in Chrome are overridden.**

| Shortcut     | Action                                     |
| :----------- | :----------------------------------------- |
| Ctrl-K       | Delete the word the cursor is on           |
| Ctrl-O       | Open a blank line below                    |
| Ctrl-Shift-O | Open a blank line above                    |
| Ctrl-L       | Delete up to the end of the current line   |
| Ctrl-H       | Delete up to the start of the current line |
| Ctrl-U       | Duplicate the current line below           |
| Ctrl-Shift-U | Duplicate the current line above           |

## Key-Sequence Action

This feature allows you to trigger actions by pressing one or more keys multiple times **FAST** in sequence (similar to mapping `jj`or `jk` to `Esc` in Vim).

| Key sequence | Action                      |
| :----------- | :-------------------------- |
| jj           | Go to the start of the line |
| jk           | Go to the end of the line   |

## Snippets (Press `Tab` to expand)

| Snippet | Output                                                          |
| :------ | :-------------------------------------------------------------- |
| sel     | select()                                                        |
| cnt     | count()                                                         |
| gb      | groupBy()                                                       |
| ob      | orderBy()                                                       |
| pb      | partitionBy(                                                    |
| fil     | filter()                                                        |
| fna     | fillna()                                                        |
| wc      | withColumn()                                                    |
| wcr     | withColumnRenamed()                                             |
| jo      | join()                                                          |
| un      | union()                                                         |
| dp      | display()                                                       |
| sh      | show()                                                          |
| ps      | printSchema()                                                   |
| sam     | sample()                                                        |
| samb    | sampleBy()                                                      |
| sub     | subtract()                                                      |
| dt      | distinct()                                                      |
| dr      | drop()                                                          |
| drn     | dropna()                                                        |
| drd     | dropDuplicates()                                                |
| tpd     | toPandas()                                                      |
| al      | alias()                                                         |
| ca      | cast(dataType)                                                  |
| at      | astype(dataType)                                                |
| ow      | otherwise()                                                     |
| ew      | endswith()                                                      |
| ss      | startswith()                                                    |
| isn     | isNull()                                                        |
| isnn    | isNotNull()                                                     |
| isi     | isin()                                                          |
| btw     | between()                                                       |
| col     | F.col()                                                         |
| lit     | F.lit()                                                         |
| std     | F.stddev()                                                      |
| sumd    | F.sumDistinct()                                                 |
| len     | F.length()                                                      |
| rnd     | F.round()                                                       |
| cntd    | F.countDistinct()                                               |
| uxt     | F.unix_timestamp()                                              |
| up      | F.upper()                                                       |
| low     | F.lower()                                                       |
| tr      | F.trim()                                                        |
| ltr     | F.ltrim()                                                       |
| rtr     | F.rtrim()                                                       |
| ss      | F.substring()                                                   |
| rr      | regexp_replace()                                                |
| rep     | repeat()                                                        |
| rev     | reverse()                                                       |
| todt    | F.to_date()                                                     |
| dtad    | F.date_add()                                                    |
| dtsb    | F.date_sub()                                                    |
| dtfmt   | F.date_format()                                                 |
| dtdf    | F.datediff()                                                    |
| sec     | second()                                                        |
| srt     | spark.read.table()                                              |
| src     | spark.read.csv()                                                |
| srp     | spark.read.parquet()                                            |
| wcsv    | write.csv()                                                     |
| wp      | write.parquet()                                                 |
| wop     | write.mode('overwrite').parquet()                               |
| wap     | write.mode('append').parquet()                                  |
| wep     | write.mode('error').parquet()                                   |
| wip     | write.mode('ignore').parquet()                                  |
| agcnt   | agg(F.count())                                                  |
| agcntd  | agg(F.countDistinct())                                          |
| agsum   | agg(F.sum())                                                    |
| agmean  | agg(F.mean())                                                   |
| agavg   | agg(F.avg())                                                    |
| agmin   | agg(F.min())                                                    |
| agmax   | agg(F.max())                                                    |
| dwg     | dbutils.widgets.get()                                           |
| dnr     | dbutils.notebook.run()                                          |
| dne     | dbutils.notebook.exit()                                         |
| pypi    | dbutils.library.installPyPI()                                   |
| udf     | @F.udf()                                                        |
| udfstr  | @F.udf(T.StringType())                                          |
| udfbl   | @F.udf(T.BooleanType())                                         |
| udfsht  | @F.udf(T.ShortType())                                           |
| udfint  | @F.udf(T.IntegerType())                                         |
| udflong | @F.udf(T.LongType())                                            |
| udfflt  | @F.udf(T.FloatType())                                           |
| udfdbl  | @F.udf(T.DoubleType())                                          |
| scs     | sqlContext.sql()                                                |
| ftw     | from pyspark.sql import functions as F, types as T, window as W |

## Add your own snippets

You can add your own snippets by inserting a new key/value pair to the variable `snippets` in `main.js`.

```js
const snippets = {
  ...
  // your own snippet
  'ms'   : 'func_name()',
}
```

## How this extension works

Each cell on the notebook has an object called `CodeMirror` which manages the cell content and state. This extension injects a JS script to override the properties related to key bindings and add new features not provided by default.

## Other Extensions

| Extension Name                             | Purpose                                       |
| :----------------------------------------- | :-------------------------------------------- |
| [DBDark](https://github.com/harupy/dbdark) | Provide dark theme for Databricks             |
| [DBToc](https://github.com/harupy/dbtoc)   | Create a table of contents automatically      |
| [DBHide](https://github.com/harupy/dbhide) | Hide code and cells to see the results easily |

## References

- [CodeMirror: User Manual](https://codemirror.net/doc/manual.html)
- [Is there a way to use Vim keybindings in Google Colaboratory?](https://stackoverflow.com/questions/48674326/is-there-a-way-to-use-vim-keybindings-in-google-colaboratory)

## Acknowledgements

A huge thanks to Databricks for making data science and machine learning easier to access for everyone.

## License

MIT
