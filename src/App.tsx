import React, { Component } from 'react';
import Terminal from 'react-terminal-emulator';
import logo from './logo.svg';
import './App.css';
import { strictEqual } from 'assert';

export const clear = {
    exec: ({ structure, history, cwd }, command) => {
        return { structure, cwd, history: [] };
    },
};

const extensions = { clear };

class App extends Component {
  public render() {
    return (
      <div className="App">
        <Terminal extensions={extensions} history={history} structure={structure} prefix={prefix} theme={theme} styles={styles}/>
      </div>
    );
  }
}

const styles = {
  ReactBash: {
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '\'Fira Code\', monospace',
    fontSize: '12px',
    fontWeight: '400',
    height: '100%',
    overflow: 'hidden',
    textAlign: 'left',
  }
};

const theme = 'solarized'
const prefix = 'kyle@kylelucas.io';
const history = [
  { value: 'Welcome to my terminal!' },
  { value: ' ' },
  { value: 'My name is Kyle Lucas and I am a Software Engineer located in Los Angeles, CA.' },
  { value: 'If you\'d like to learn more about me go ahead and run `cat README.md` without the backticks :)' }
];

const structure = {
  '.hiddenFile': { content: 'This is a hidden file' },
  "CREDITS.md": { content: 'First thanks to /u/Flurokazoo and the awesome Last.FM collage generator @ http://background.jasperdekroon.nl' },
  'README.md': { content: '# Kyle Lucas' },
  projects: {
    c: {
      sugarkorn: {
        content: 'This is the text content for <file1> of <src>'
      },
    },
    go: {
      'plex-lametric.md': {
        content: '# plex-lametric https://github.com/kylegrantlucas/plex-lametric'
      },
      'transmission-exporter.md': {
        content: '# transmission-explorer https://github.com/kylegrantlucas/transmission-explorer'
      }
    },
    js: {
      'kylelucas.io': {
        content: 'This is the text content for <file1> of <src>'
      },
    },
    other: {},
    ruby: {
      singing_assistant: {
        content: 'This is the text content for <file1> of <src>'
      },
    },
  },
  work: {
    current: {},
    previous: {},
  },
};

export default App;
