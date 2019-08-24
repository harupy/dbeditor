import React from 'react';
import ReactDOM from 'react-dom';
import { SnippetProvider } from './context';
import Table from './table';

const App = () => {
  return (
    <SnippetProvider>
      <div className="ui container">
        <Table />
      </div>
    </SnippetProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
