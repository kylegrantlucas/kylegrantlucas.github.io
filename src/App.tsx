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

export const open = {
  exec: ({ structure, state, history }, command) => {
    const parsedCommand = history[1].value.split(' ');
    const fileName = parsedCommand[1];

    if (fileName == "resume.pdf") {
      window.open('https://github.com/kylegrantlucas/resume/blob/master/output/kyle_modern.pdf');
    }

    return { structure, state, history };
  },
};

const extensions = { clear, open };

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
  {
    value: renderHTML(`Welcome to my terminal 🎉
                      <br><br>
                      I\'m Kyle Lucas, a Software Engineer from Los Angeles, California.
                      <br><br>
                      If you\'d like to learn more about me run \`cat README.md\` without the backticks.
                      <br><br>
                      Other Examples:
                      <br>\`ls\` - list all files & directories
                      <br>\`open resume.pdf\` - Open my resume
                      <br>\`cat work/current/iamplus.md\` - View information about my current work
                      <br>\`cat projects/go/plex-latmetric.md\` - View information about my plex-lametric project
                      <br><br>`)
  },
];

const structure = {
  "CREDITS.md": { content: 'First thanks to /u/Flurokazoo and the awesome <a href="http://background.jasperdekroon.nl">Last.FM collage generator</a>' },
  'README.md': {
    content: `# Kyle Lucas
              <br><br>
              ## Intro
              <br><br>
              Hello! I'm a software engineer with a passion for building efficent, scalable, stable services. I primary like to build in Go but also have lots of personal and professional experience with Ruby. I have a whole bunch of projects I'd love for you to check out over in the projects/ directory!
              <br><br>
              ## Find Me Elsewhere
              <br><br>
              <i class="fab fa-github-alt"></i> <a href="https://github.com/kylegrantlucas">GitHub</a><br>
              <i class="fab fa-lastfm-square"></i> <a href="https://last.fm/user/thejazi13">Last.fm</a><br>
              <i class="fab fa-twitter-square"></i> <a href="https://twitter.com/kylegrantlucas">Twitter</a><br>` },
  'resume.pdf': '<br>',
  projects: {
    go: {
      'plex-lametric.md': {
        content: '# <a href="https://github.com/kylegrantlucas/plex-lametric">plex-lametric</a><br><br>A small little HTTP server that listens to a Plex Media Server websocket to display Now Playing information on a LaMetric clock.'
      },
      'cyberpower-exporter.md': {
        content: '# <a href="https://github.com/kylegrantlucas/cyberpower-explorer">transmission-explorer</a><br><br>A prometheus exporter for metrics from the Cyberpower UPS line.'
      },
      'resume-exporter.md': {
        content: '# <a href="https://github.com/kylegrantlucas/resume-exporter">resume-exporter</a><br><br>A JSONResume to LaTeX exporter with some fun additions.'
      },
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
        content: '# <a href="https://github.com/kylegrantlucas/singing-assistant">singing-assistant</a><br><br>A homebrew Alexa server for arbitrary plugins.'
      },
    },
  },
  work: {
    current: {
      "iamplus.md": {
        content: '# i.am+<br><br>## Roles<br><br>### Software Engineering Manager<br><br>* Managed a small but effective backend services team<br>* Lead the planning and execution of all US-based infrastructure<br>* Organized deployment of several microservices on a Docker + Kubernetes platform<br><br>### Senior Software Engineer<br><br>* Built serveral highly scalable services for a music streaming platform<br>* Optimized elasticsearch for voice-first accurate search on a music knowledge base<br>* Built several tools for fast ingestion of gigabytes of music metadata for service consumption<br>* Golang, gRPC/HTTP, Postgresql, Elasticsearch, Redis, Neo4j, and Ruby (Rails & Sinatra)',
      },
    },
    previous: {},
  },
};

export default App;
