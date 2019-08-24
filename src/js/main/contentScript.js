(() => {
  // get snippets from storage and inject it using textarea
  chrome.storage.sync.get(null, items => {
    const ta = document.createElement('textarea');
    ta.value = JSON.stringify(items);
    ta.id = 'user-snippets';
    ta.style = 'display: none';
    (document.head || document.documentElement).appendChild(ta);
  });

  // it seems that CodeMirror object can be accessed with injected scripts.
  const main = document.createElement('script');
  main.src = chrome.extension.getURL('./dist/main.js');
  (document.head || document.documentElement).appendChild(main);
})();
