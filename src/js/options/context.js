import React from 'react';

const SnippetContext = React.createContext([]);

export class SnippetProvider extends React.Component {
  state = {
    snippets: [{ prefix: 'yes', body: 'bar' }, { prefix: 'no', body: 'bar' }],
  };

  componentDidMount = () => {
    chrome.storage.sync.get(items => {
      const snippets = Object.entries(items).map(([prefix, body]) => ({
        prefix,
        body,
      }));
      this.setState({ snippets });
    });
  };

  setSnippet = snippets => {
    this.setState({ snippets });
  };

  addSnippet = snippet => {
    this.setState({ snippets: [...this.state.snippets, snippet] });
  };

  removeSnippet = index => {
    const snippets = [...this.state.snippets];
    snippets.splice(index, 1);
    this.setState({ snippets });
  };

  updateSnippet = (event, index) => {
    const snippets = [...this.state.snippets];
    snippets[index][event.target.name] = event.target.value;
    this.setState({ snippets });
  };

  render() {
    return (
      <SnippetContext.Provider
        value={{
          snippets: this.state.snippets,
          addSnippet: this.addSnippet,
          removeSnippet: this.removeSnippet,
          updateSnippet: this.updateSnippet,
        }}
      >
        {this.props.children}
      </SnippetContext.Provider>
    );
  }
}

export const SnippetConsumer = SnippetContext.Consumer;
export default SnippetContext;
