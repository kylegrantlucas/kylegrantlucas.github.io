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
                      <br>\`ls work/previous\` - list files about my previous work
                      <br>\`ls projects\` - list files about my projects
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
              Hello! I'm a software engineer with a passion for building efficient, scalable, stable services. I primary like to build in Go but also have lots of personal and professional experience with Ruby. I have a whole bunch of projects I'd love for you to check out over in the projects/ directory!
              <br><br>
              ## Find Me Elsewhere
              <br><br>
              <i class="fab fa-github-alt"></i> <a href="https://github.com/kylegrantlucas">GitHub</a><br>
              <i class="fab fa-lastfm-square"></i> <a href="https://last.fm/user/thejazi13">Last.fm</a><br>
              <i class="fab fa-twitter-square"></i> <a href="https://twitter.com/kylegrantlucas">Twitter</a><br>` },
  'resume.pdf': {
    content: 'You can find my resume here: <a href="https://github.com/kylegrantlucas/resume/blob/master/output/kyle_modern.pdf">https://github.com/kylegrantlucas/resume/blob/master/output/kyle_modern.pdf</a>',
  },
  projects: {
    go: {
      'cyberpower-exporter.md': {
        content: `# <a href="https://github.com/kylegrantlucas/cyberpower-explorer">transmission-explorer</a>
                  <br><br>
                  A prometheus exporter for metrics from the Cyberpower UPS line.`
      },
      'discord-lametric.md': {
        content: `# <a href="https://github.com/kylegrantlucas/discord-lametric">discord-lametric</a>
                  <br><br>
                  A daemon that listens to a Discord server and published the messages to a LaMetric Clock.`
      },
      'plex-lametric.md': {
        content: `# <a href="https://github.com/kylegrantlucas/plex-lametric">plex-lametric</a>
                  <br><br>
                  A small little HTTP server that listens to a Plex Media Server websocket to display Now Playing information on a LaMetric clock.`
      },
      'resume-exporter.md': {
        content: `# <a href="https://github.com/kylegrantlucas/resume-exporter">resume-exporter</a>
                  <br><br>
                  A JSONResume to LaTeX exporter with some fun additions.`
      },
      'speedtest.md': {
        content: `# <a href="https://github.com/kylegrantlucas/speedtest">speedtest</a>
                  <br><br>
                  A Golang package for running speedtest.net tests.`
      },
      'speedtest-influxdb.md': {
        content: `# <a href="https://github.com/kylegrantlucas/speedtest-influxdb">speedtest-influxdb</a>
                  <br><br>
                  A daemon to ingest speedtest runs into influxdb for analysis.`
      },
    },
    js: {
      'kylelucas-io.md': {
        content: `# <a href="https://github.com/kylegrantlucas/kylelucas.io">kylelucas.io</a>
                  <br><br>
                  This website! Build entirely with TypeScript using React.`
      },
      'react-fish': {
        content: `# <a href="https://github.com/kylegrantlucas/react-fish">react-fish</a>
                  <br><br>
                  The terminal you\'re using! It\'s my first NPM module and a fork of an existing project. I spruced it up a little bit, and gave it some new features!`
      },
    },
    // other: {},
    ruby: {
      "singing_assistant.md": {
        content: `# <a href="https://github.com/kylegrantlucas/singing-assistant">singing-assistant</a>
                  <br><br>
                  A homebrew Alexa server for arbitrary plugins.`
      },
    },
  },
  work: {
    current: {
      "iamplus.md": {
        content: `# i.am+
                  <br><br>
                  ## Roles
                  <br><br>
                  ### Software Engineering Manager (Oct 2018 - Present)
                  <br><br>
                  * Managed a small but effective backend services team
                  <br>
                  * Lead the planning and execution of all US-based infrastructure
                  <br>
                  * Worked with offshore QA and Engineering teams to pursue mutual goals
                  <br>
                  * Organized deployment of microservices on a Kubernetes platform
                  <br><br>
                  ### Senior Software Engineer (Aug 2016 - Present)
                  <br><br>
                  * Built several highly scalable services for a music streaming platform
                  <br>
                  * Optimized elasticsearch for voice-first search on a music knowledge base
                  <br>
                  * Built tools for fast ingestion of GBs of metadata for service consumption
                  <br>
                  * Designed an automated pipeline for nightly music data ingestion
                  <br>
                  * Managed projects for our MIT interns
                  <br>
                  * Built a service for managing smartwatch registration and preferences
                  <br>
                  * Golang, gRPC, Docker, Postgresql, Elasticsearch, Redis, Neo4j, Ruby`,
      },
    },
    previous: {
      "down.md": {
        content: `# Down
                  <br><br>
                  ## Roles
                  <br><br>
                  ### Software Engineering Intern (Jun 2013 - Oct 2013)
                  <br><br>
                  * Built a Neo4j graph and API v2.0 for match discovery on 1.3m users
                  <br>
                  * Ruby on Rails, Neo4j, Postgresql`
      },
      "gigit.md": {
        content: `# Project Gigit
                  <br><br>
                  ## Roles
                  <br><br>
                  ### Software Engineer (Oct 2013 - Dec 2013)
                  <br><br>
                  * Built a service using concert data to help promoters identify band bookings
                  <br>
                  * Ruby On Rails, Facebook API, Postgresql`
      },
      "goseek.md": {
        content: `# goSeek
                  <br><br>
                  ## Roles
                  <br><br>
                  ### Software Engineer (Mar 2015 - Mar 2016)
                  <br><br>
                  * Built a central API for booking hotel stays through multiple 3rd party APIs
                  <br>
                  * Built a full-stack login authentication system
                  <br>
                  * Worked with caching large volumes of hotel searches and results
                  <br>
                  * Ruby On Rails, Redis, Memcached, Postgresql w/ PostGIS`
      },
      "radpad.md": {
        content: `# RadPad
                  <br><br>
                  ## Roles
                  <br><br>
                  ### Software Engineer (Jan 2015 - Mar 2015)
                  <br><br>
                  * Redesigned the backend apartment aggregation service to be 3x faster
                  <br>
                  * Designed and implemented a realtime messaging service with PubSub
                  <br>
                  * Implemented the base unit testing framework on an established application
                  <br>
                  * Ruby On Rails, Postgresql, S3`
      },
      "resound.md": {
        content: `# resound.fm
                  <br><br>
                  ## Roles
                  <br><br>
                  ### Lead Backend Engineer & Co-Founder (Mar 2014 - Mar 2015)
                  <br><br>
                  * Designed and implemented data models, built APIs, managed DevOps
                  <br>
                  * Participated in business development, marketing and social media
                  <br>
                  * Ruby On Rails, Redis, Websockets, Postgresql, Chef, Rackspace`
      },
      "trackr.md": {
        content: `# TrackR
                  <br><br>
                  ## Roles
                  <br><br>
                  ### Software Engineer (Consultant) (Sep 2014 - Sept 2015)
                  <br><br>
                  * Built a management tool for users to manage their Indiegogo orders
                  <br>
                  * Built a blogging platform in Rails
                  <br>
                  * Ruby On Rails, Postgresql, ActiveAdmin`
      },
    },
  },
};

export default App;
