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
      .trim() // remove leading and trailing empty strings
      .match(/(.+?):\s+(.+),/) // find snippet and body
      .slice(1, 3); // extract 1st and 2nd matching groups
    return [snippet, removePlaceholder(body.slice(1, -1))]; // slice here removes outer single quotes
  });
};

const snippetsString = getSnippetsString(fileContent);
const snippets = extractSnippets(snippetsString);

const markdownTable =
  '|Snippet|Output|\n|:-|:-|\n' + snippets.map(s => `|${s.join('|')}|`).join('\n');

fs.writeFile('snippets.md', markdownTable, err => {
  if (err) console.log(err);
  console.log('Successfully written to file.');
});
