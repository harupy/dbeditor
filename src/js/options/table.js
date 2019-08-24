import React, { useState } from 'react';
import { SnippetConsumer } from './context';
import Row from './row';

const Table = () => {
  const [message, setMessage] = useState('');
  return (
    <SnippetConsumer>
      {context => {
        const saveSnippets = () => {
          chrome.storage.sync.clear();
          chrome.storage.sync.set(
            context.snippets.reduce((acc, { prefix, body }) => ({ ...acc, [prefix]: body }), {}),
          );
        };

        const rows = context.snippets.map(({ prefix, body }, index) => (
          <Row
            prefix={prefix}
            body={body}
            index={index}
            key={index}
            removeSnippet={context.removeSnippet}
            updateSnippet={context.updateSnippet}
          />
        ));

        return (
          <div>
            <table className="ui celled table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Prefix</th>
                  <th>Body</th>
                  <th>
                    Result
                    <br />
                    (red: selected area after expansion)
                  </th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>

            <button
              className="ui button primary"
              onClick={() => context.addSnippet({ prefix: '', body: '' })}
            >
              Add a New Snippet
            </button>
            <button
              className="ui button positive"
              onClick={() => {
                saveSnippets();
                setMessage('Successfully saved!');
              }}
            >
              Save Snippets
            </button>
            <div>{message}</div>
          </div>
        );
      }}
    </SnippetConsumer>
  );
};

export default Table;
