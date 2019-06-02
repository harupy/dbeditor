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

| Snippet | Output                                             |
| :------ | :------------------------------------------------- |
| fft     | from pyspark.sql import functions as f, types as t |
| srt     | spark.read.table()                                 |
| srp     | spark.read.parquet()                               |
| scs     | sqlContext.sql()                                   |
| ps      | printSchema()                                      |
| pb      | partitionBy()                                      |
| fna     | fillna()                                           |
| dt      | distinct()                                         |
| wc      | withColumn()                                       |
| wcr     | withColumnRenamed(                                 |
| dist    | distinct()                                         |
| disp    | display()                                          |
| tpd     | toPandas()                                         |
| ob      | orderBy()                                          |
| gb      | groupBy()                                          |
| sl      | select()                                           |
| c       | f.col()                                            |
| al      | alias()                                            |
| fl      | filter()                                           |
| cnt     | count()                                            |
| rn      | round()                                            |
| cntd    | countDistinct()                                    |
| btw     | between()                                          |
| jo      | join()                                             |
| agcnt   | agg(f.count())                                     |
| agcntd  | agg(f.countDistinct())                             |
| agsum   | agg(f.sum())                                       |
| agmin   | agg(f.min())                                       |
| agmax   | agg(f.max())                                       |
| in      | isNull()                                           |
| inn     | isNotNull()                                        |
| ow      | otherwise()                                        |

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
