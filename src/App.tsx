import React, { Component } from 'react';
import Terminal from 'react-fish';
import renderHTML from 'react-render-html';
import './App.css';
// import { strictEqual } from 'assert';

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
  ReactFish: {
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
  { value: renderHTML('Welcome to my terminal!<br><br>My name is Kyle Lucas and i\'m a Software Engineer from Los Angeles, California.<br><br>If you\'d like to learn more about me go ahead and run `cat README.md` without the backticks :)') },
];

const structure = {
  "CREDITS.md": { content: 'First thanks to /u/Flurokazoo and the awesome <a href="http://background.jasperdekroon.nl">Last.FM collage generator</a>' },
  'README.md': { content: '# Kyle Lucas' },
  projects: {
    // c: {
    //   sugarkorn: {
    //     content: 'This is the text content for <file1> of <src>'
    //   },
    // },
    go: {
      'plex-lametric.md': {
        content: '# <a href="https://github.com/kylegrantlucas/plex-lametric">plex-lametric</a><br><br>A small little HTTP server that listens to a Plex Media Server websocket to display Now Playing information on a LaMetric clock.'
      },
      'transmission-exporter.md': {
        content: '# <a href="https://github.com/kylegrantlucas/transmission-explorer">transmission-explorer</a><br><br>A prometheus exporter for Transmission metrics.'
      }
    },
    js: {
      'kylelucas-io.md': {
        content: '# <a href="https://github.com/kylegrantlucas/kylelucas.io">kylelucas.io</a><br><br>This website! Build entirely with TypeScript using React.'
      },
      'react-fish': {
        content: '# <a href="https://github.com/kylegrantlucas/react-fish">react-fish</a><br><br>The terminal you\'re using! It\'s my first NPM module and a fork of an existing project. I spruced it up a little bit, and gave it some new features!'
      },
    },
    other: {},
    ruby: {
      "singing_assistant.md": {
        content: '# <a href="https://github.com/kylegrantlucas/singing-assistan">transmission-explorer</a><br><br>A prometheus exporter for Transmission metrics.'
      },
    },
  },
  work: {
    current: {},
    previous: {},
  },
};

export default App;
