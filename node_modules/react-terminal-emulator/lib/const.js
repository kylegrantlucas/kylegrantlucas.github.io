'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var IS_SERVER = exports.IS_SERVER = typeof window === 'undefined';

var BACK_REGEX = exports.BACK_REGEX = /\/?\.?[\w-_]+\/\.\./;

var Errors = exports.Errors = {
    COMMAND_NOT_FOUND: '-bash: $1: command not found',
    FILE_EXISTS: 'mkdir: $1: File exists',
    NO_SUCH_FILE: '-bash: cd: $1: No such file or directory',
    NOT_A_DIRECTORY: '-bash: cd: $1: Not a directory',
    IS_A_DIRECTORY: 'cat: $1: Is a directory'
};

var EnvVariables = exports.EnvVariables = {
    TERM_PROGRAM: 'ReactBash.app',
    TERM: 'reactbash-256color',
    TERM_PROGRAM_VERSION: '1.4.3',
    TERM_SESSION_ID: 'w0t0p1:37842145-87D9-4768-BEC3-3684BAF3A964',
    USER: function USER(state) {
        return state.settings.user.username;
    },
    PATH: '/',
    PWD: function PWD(state) {
        return '/' + state.cwd;
    },
    LANG: function LANG() {
        return !IS_SERVER ? navigator.language.replace('-', '_') + '.UTF-8' : 'en_US.UTF-8';
    },
    HOME: '/',
    LOGNAME: function LOGNAME(state) {
        return state.settings.user.username;
    },
    OLDPWD: '/'
};