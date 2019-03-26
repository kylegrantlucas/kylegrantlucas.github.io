'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

var _const = require('./const');

var _commands = require('./commands');

var BaseCommands = _interopRequireWildcard(_commands);

var _parser = require('./parser');

var BashParser = _interopRequireWildcard(_parser);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bash = function () {
    function Bash() {
        var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Bash);

        this.commands = Object.assign({}, BaseCommands, extensions);
        this.prevCommands = [];
        this.prevCommandsIndex = 0;
    }

    /*
     * This parses and executes the given <input> and returns an updated
     * state object.
     *
     * @param {string} input - the user input
     * @param {Object} state - the current terminal state
     * @returns {Object} the new terminal state
     */


    _createClass(Bash, [{
        key: 'execute',
        value: function execute(input, currentState) {
            this.prevCommands.push(input);
            this.prevCommandsIndex = this.prevCommands.length;

            // Append input to history
            var newState = Object.assign({}, currentState, {
                history: currentState.history.concat({
                    cwd: currentState.cwd,
                    value: input
                })
            });

            var commandList = BashParser.parse(input);
            return this.runCommands(commandList, newState);
        }

        /*
         * This function executes a list of command lists. The outer list
         * is a dependency list parsed from the `&&` operator. The inner lists
         * are groups of commands parsed from the `;` operator. If any given
         * command fails, the outer list will stop executing.
         *
         * @param {Array} commands - the commands to run
         * @param {Object} state - the terminal state
         * @returns {Object} the new terminal state
         */

    }, {
        key: 'runCommands',
        value: function runCommands(commands, state) {
            var _this = this;

            var errorOccurred = false;

            /*
             * This function executes a single command and marks whether an error
             * occurred. If an error occurs, the following dependent commands should
             * not be run.
             */
            var reducer = function reducer(newState, command) {
                if (command.name === '') {
                    return newState;
                } else if (_this.commands[command.name]) {
                    var nextState = _this.commands[command.name].exec(newState, command);
                    errorOccurred = errorOccurred || nextState && nextState.error;
                    return nextState;
                } else {
                    errorOccurred = true;
                    return Util.appendError(newState, _const.Errors.COMMAND_NOT_FOUND, command.name);
                }
            };

            while (!errorOccurred && commands.length) {
                var dependentCommands = commands.shift();
                state = dependentCommands.reduce(reducer, state);
            }
            return state;
        }

        /*
         * This is a very naive autocomplete method that works for both
         * commands and directories. If the input contains only one token it
         * should only suggest commands.
         *
         * @param {string} input - the user input
         * @param {Object} state - the terminal state
         * @param {Object} state.structure - the file structure
         * @param {string} state.cwd - the current working directory
         * @returns {?string} a suggested autocomplete for the <input>
         */

    }, {
        key: 'autocomplete',
        value: function autocomplete(input, _ref) {
            var structure = _ref.structure,
                cwd = _ref.cwd;

            var tokens = input.split(/ +/);
            var token = tokens.pop();
            var filter = function filter(item) {
                return item.indexOf(token) === 0;
            };
            var result = function result(str) {
                return tokens.concat(str).join(' ');
            };

            if (tokens.length === 0) {
                var suggestions = Object.keys(this.commands).filter(filter);
                return suggestions.length === 1 ? result(suggestions[0]) : null;
            } else {
                var pathList = token.split('/');
                token = pathList.pop();
                var partialPath = pathList.join('/');
                var path = Util.extractPath(partialPath, cwd);

                var _Util$getDirectoryByP = Util.getDirectoryByPath(structure, path),
                    err = _Util$getDirectoryByP.err,
                    dir = _Util$getDirectoryByP.dir;

                if (err) return null;
                var _suggestions = Object.keys(dir).filter(filter);
                var prefix = partialPath ? partialPath + '/' : '';
                return _suggestions.length === 1 ? result('' + prefix + _suggestions[0]) : null;
            }
        }
    }, {
        key: 'getPrevCommand',
        value: function getPrevCommand() {
            return this.prevCommands[--this.prevCommandsIndex];
        }
    }, {
        key: 'getNextCommand',
        value: function getNextCommand() {
            return this.prevCommands[++this.prevCommandsIndex];
        }
    }, {
        key: 'hasPrevCommand',
        value: function hasPrevCommand() {
            return this.prevCommandsIndex !== 0;
        }
    }, {
        key: 'hasNextCommand',
        value: function hasNextCommand() {
            return this.prevCommandsIndex !== this.prevCommands.length - 1;
        }
    }]);

    return Bash;
}();

exports.default = Bash;