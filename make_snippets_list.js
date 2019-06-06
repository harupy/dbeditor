const fs = require('fs');

const fileContent = fs.readFileSync('main.js', { encoding: 'utf8' });

const getSnippetsString = fileContent => {
  const pattern = /const snippets = \{(.+?)\};/s;
  return fileContent.match(pattern)[1];
};

const removePlaceholder = body => {
  return body.replace(/\$\{([^{}]*)\}/, '');
};

const extractSnippets = snippetsString => {
  const snippetLines = snippetsString.match(/\s+(.+?):(.+)/gm);
  return snippetLines.map(line => {
    const [snippet, body] = line
      .trim()
      .match(/(.+?):\s+(.+),/)
      .slice(1, 3);
    return [snippet, removePlaceholder(body.slice(1, -1))];
  });
};

const funcs = [getSnippetsString];
const snippetsString = funcs.reduce((s, f) => f(s), fileContent);
const snippets = extractSnippets(snippetsString);

const markdownTable =
  '|Snippet|Output|\n|:-|:-|\n' + snippets.map(s => `|${s.join('|')}|`).join('\n');

fs.writeFile('snippets.md', markdownTable, err => {
  if (err) console.log(err);
  console.log('Successfully written to file.');
});
