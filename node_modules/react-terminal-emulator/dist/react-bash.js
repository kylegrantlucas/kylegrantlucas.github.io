(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactBash"] = factory(require("react"));
	else
		root["ReactBash"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_16__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.BashUtil = exports.BashConst = undefined;

	var _component = __webpack_require__(9);

	var _component2 = _interopRequireDefault(_component);

	var _util = __webpack_require__(2);

	var BashUtil = _interopRequireWildcard(_util);

	var _const = __webpack_require__(1);

	var BashConst = _interopRequireWildcard(_const);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _component2.default;
	exports.BashConst = BashConst;
	exports.BashUtil = BashUtil;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.trim = trim;
	exports.appendError = appendError;
	exports.extractPath = extractPath;
	exports.getDirectoryByPath = getDirectoryByPath;
	exports.getEnvVariables = getEnvVariables;
	exports.isFile = isFile;

	var _const = __webpack_require__(1);

	/*
	 * This is a utility method for trimming the beginning
	 * and ending of a string of any given char.
	 *
	 * @param {string} str - the string the trim
	 * @param {string} char - the char to remove
	 * @returns {string} the trimmed string
	 */
	function trim(str, char) {
	    if (str[0] === char) {
	        str = str.substr(1);
	    }
	    if (str[str.length - 1] === char) {
	        str = str.substr(0, str.length - 1);
	    }
	    return str;
	}

	/*
	 * This is a utility method for appending an error
	 * message to the current state.
	 *
	 * @param {Object} state - the terminal state
	 * @param {string} error - the error to interpolate
	 * @param {string} command - the string to insert
	 * @returns {Object} the new terminal state
	 */
	function appendError(state, error, command) {
	    return Object.assign({}, state, {
	        error: true,
	        history: state.history.concat({
	            value: error.replace('$1', command)
	        })
	    });
	}

	/*
	 * This is a utility method for appending a relative path
	 * to a root path. Handles trimming and backtracking.
	 *
	 * @param {string} relativePath
	 * @param {string} rootPath
	 * @returns {string} the combined path
	 */
	function extractPath(relativePath, rootPath) {
	    // Short circuit for relative path
	    if (relativePath === '') return rootPath;

	    // Strip trailing slash
	    relativePath = trim(relativePath, '/');

	    // Create raw path
	    var path = '' + (rootPath ? rootPath + '/' : '') + relativePath;

	    // Strip ../ references
	    while (path.match(_const.BACK_REGEX)) {
	        path = path.replace(_const.BACK_REGEX, '');
	    }
	    return trim(path, '/');
	}

	/*
	 * This is a utility method for traversing the structure
	 * down the relative path.
	 *
	 * @param {Object} structure - the terminal file structure
	 * @param {string} relativePath - the path of the directory
	 * @returns {Object} the directory or error
	 */
	function getDirectoryByPath(structure, relativePath) {
	    var path = relativePath.split('/');

	    // Short circuit for empty root path
	    if (!path[0]) return { dir: structure };

	    var dir = structure;
	    var i = 0;
	    while (i < path.length) {
	        var key = path[i];
	        var child = dir[key];
	        if (child && (typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object') {
	            if (child.hasOwnProperty('content')) {
	                return { err: _const.Errors.NOT_A_DIRECTORY.replace('$1', relativePath) };
	            } else {
	                dir = child;
	            }
	        } else {
	            return { err: _const.Errors.NO_SUCH_FILE.replace('$1', relativePath) };
	        }
	        i++;
	    }
	    return { dir: dir };
	}

	/*
	 * This is a utility method for getting the environment
	 * variables with the dynamic values updated with state.
	 *
	 * @param {Object} state - the terminal state
	 * @returns {Object} the updated env variables
	 */
	function getEnvVariables(state) {
	    return Object.keys(_const.EnvVariables).reduce(function (envVars, key) {
	        var value = _const.EnvVariables[key];
	        envVars[key] = typeof value === 'function' ? value(state) : value;
	        return envVars;
	    }, {});
	}

	/*
	 * This is a utility method for determining if a given filesystem entry is a
	 * file or directoy.
	 *
	 * @param {Object} entry - the filesystem entry
	 * @returns {Boolean} whether the entry is a file
	 */
	function isFile(entry) {
	    return entry.content !== undefined;
	}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.rm = exports.whoami = exports.printenv = exports.echo = exports.pwd = exports.cd = exports.mkdir = exports.cat = exports.ls = exports.help = undefined;

	var _util = __webpack_require__(2);

	var Util = _interopRequireWildcard(_util);

	var _const = __webpack_require__(1);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var helpCommands = ['ls', 'cat', 'mkdir', 'cd', 'pwd', 'echo', 'printenv', 'whoami', 'rm'];

	var help = exports.help = {
	    exec: function exec(state) {
	        var _state$history;

	        return Object.assign({}, state, {
	            history: (_state$history = state.history).concat.apply(_state$history, [{ value: 'React-bash:' }, { value: 'These shell commands are defined internally.  Type \'help\' to see this list.' }].concat(_toConsumableArray(helpCommands.map(function (value) {
	                return { value: value };
	            }))))
	        });
	    }
	};

	var ls = exports.ls = {
	    exec: function exec(state, _ref) {
	        var flags = _ref.flags,
	            args = _ref.args;

	        var path = args[0] || '';
	        var fullPath = Util.extractPath(path, state.cwd);

	        var _Util$getDirectoryByP = Util.getDirectoryByPath(state.structure, fullPath),
	            err = _Util$getDirectoryByP.err,
	            dir = _Util$getDirectoryByP.dir;

	        if (err) {
	            return Util.appendError(state, err, path);
	        } else {
	            var content = Object.keys(dir);
	            if (!flags.a) {
	                content = content.filter(function (name) {
	                    return name[0] !== '.';
	                });
	            }
	            if (flags.l) {
	                return Object.assign({}, state, {
	                    history: state.history.concat(content.map(function (value) {
	                        return { value: value };
	                    }))
	                });
	            } else {
	                return Object.assign({}, state, {
	                    history: state.history.concat({ value: content.join(' ') })
	                });
	            }
	        }
	    }
	};

	var cat = exports.cat = {
	    exec: function exec(state, _ref2) {
	        var args = _ref2.args;

	        var path = args[0];
	        var relativePath = path.split('/');
	        var fileName = relativePath.pop();
	        var fullPath = Util.extractPath(relativePath.join('/'), state.cwd);

	        var _Util$getDirectoryByP2 = Util.getDirectoryByPath(state.structure, fullPath),
	            err = _Util$getDirectoryByP2.err,
	            dir = _Util$getDirectoryByP2.dir;

	        if (err) {
	            return Util.appendError(state, err, path);
	        } else if (!dir[fileName]) {
	            return Util.appendError(state, _const.Errors.NO_SUCH_FILE, path);
	        } else if (!dir[fileName].hasOwnProperty('content')) {
	            return Util.appendError(state, _const.Errors.IS_A_DIRECTORY, path);
	        } else {
	            return Object.assign({}, state, {
	                history: state.history.concat({
	                    value: dir[fileName].content
	                })
	            });
	        }
	    }
	};

	var mkdir = exports.mkdir = {
	    exec: function exec(state, _ref3) {
	        var args = _ref3.args;

	        var path = args[0];
	        var relativePath = path.split('/');
	        var newDirectory = relativePath.pop();
	        var fullPath = Util.extractPath(relativePath.join('/'), state.cwd);
	        var deepCopy = JSON.parse(JSON.stringify(state.structure));

	        var _Util$getDirectoryByP3 = Util.getDirectoryByPath(deepCopy, fullPath),
	            dir = _Util$getDirectoryByP3.dir;

	        if (dir[newDirectory]) {
	            return Util.appendError(state, _const.Errors.FILE_EXISTS, path);
	        } else {
	            dir[newDirectory] = {};
	            return Object.assign({}, state, { structure: deepCopy });
	        }
	    }
	};

	var cd = exports.cd = {
	    exec: function exec(state, _ref4) {
	        var args = _ref4.args;

	        var path = args[0];
	        if (!path || path === '/') {
	            return Object.assign({}, state, { cwd: '' });
	        }

	        var fullPath = Util.extractPath(path, state.cwd);

	        var _Util$getDirectoryByP4 = Util.getDirectoryByPath(state.structure, fullPath),
	            err = _Util$getDirectoryByP4.err;

	        if (err) {
	            return Util.appendError(state, err, path);
	        } else {
	            return Object.assign({}, state, { cwd: fullPath });
	        }
	    }
	};

	var pwd = exports.pwd = {
	    exec: function exec(state) {
	        var directory = '/' + state.cwd;
	        return Object.assign({}, state, {
	            history: state.history.concat({ value: directory })
	        });
	    }
	};

	var echo = exports.echo = {
	    exec: function exec(state, _ref5) {
	        var input = _ref5.input;

	        var ECHO_LENGTH = 'echo '.length;
	        var envVariables = Util.getEnvVariables(state);
	        var value = input.slice(ECHO_LENGTH).replace(/(\$\w+)/g, function (key) {
	            return envVariables[key.slice(1)] || '';
	        });
	        return Object.assign({}, state, {
	            history: state.history.concat({ value: value })
	        });
	    }
	};

	var printenv = exports.printenv = {
	    exec: function exec(state) {
	        var envVariables = Util.getEnvVariables(state);
	        var values = Object.keys(envVariables).map(function (key) {
	            return { value: key + '=' + envVariables[key] };
	        });
	        return Object.assign({}, state, {
	            history: state.history.concat(values)
	        });
	    }
	};

	var whoami = exports.whoami = {
	    exec: function exec(state) {
	        var value = state.settings.user.username;
	        return Object.assign({}, state, {
	            history: state.history.concat({ value: value })
	        });
	    }
	};

	var rm = exports.rm = {
	    exec: function exec(state, _ref6) {
	        var flags = _ref6.flags,
	            args = _ref6.args;

	        var path = args[0];
	        var relativePath = path.split('/');
	        var file = relativePath.pop();
	        var fullPath = Util.extractPath(relativePath.join('/'), state.cwd);
	        var deepCopy = JSON.parse(JSON.stringify(state.structure));

	        var _Util$getDirectoryByP5 = Util.getDirectoryByPath(deepCopy, fullPath),
	            dir = _Util$getDirectoryByP5.dir;

	        if (dir[file]) {
	            // folder deletion requires the recursive flags `-r` or `-R`
	            if (!Util.isFile(dir[file]) && !(flags.r || flags.R)) {
	                return Util.appendError(state, _const.Errors.IS_A_DIRECTORY, path);
	            }
	            delete dir[file];
	            return Object.assign({}, state, { structure: deepCopy });
	        } else {
	            return Util.appendError(state, _const.Errors.NO_SUCH_FILE, path);
	        }
	    }
	};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (true) {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	var emptyFunction = __webpack_require__(4);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (true) {
	  var printWarning = function printWarning(format) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    var argIndex = 0;
	    var message = 'Warning: ' + format.replace(/%s/g, function () {
	      return args[argIndex++];
	    });
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };

	  warning = function warning(condition, format) {
	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }

	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }

	    if (!condition) {
	      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	        args[_key2 - 2] = arguments[_key2];
	      }

	      printWarning.apply(undefined, [format].concat(args));
	    }
	  };
	}

	module.exports = warning;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	module.exports = ReactPropTypesSecret;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(2);

	var Util = _interopRequireWildcard(_util);

	var _const = __webpack_require__(1);

	var _commands = __webpack_require__(3);

	var BaseCommands = _interopRequireWildcard(_commands);

	var _parser = __webpack_require__(10);

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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(16);

	var _react2 = _interopRequireDefault(_react);

	var _propTypes = __webpack_require__(15);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _commands = __webpack_require__(3);

	var BaseCommands = _interopRequireWildcard(_commands);

	var _bash = __webpack_require__(8);

	var _bash2 = _interopRequireDefault(_bash);

	var _styles = __webpack_require__(11);

	var _styles2 = _interopRequireDefault(_styles);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CTRL_CHAR_CODE = 17;
	var L_CHAR_CODE = 76;
	var C_CHAR_CODE = 67;
	var UP_CHAR_CODE = 38;
	var DOWN_CHAR_CODE = 40;
	var TAB_CHAR_CODE = 9;
	var noop = function noop() {};

	var Terminal = function (_Component) {
	    _inherits(Terminal, _Component);

	    function Terminal(_ref) {
	        var history = _ref.history,
	            structure = _ref.structure,
	            extensions = _ref.extensions,
	            settings = _ref.settings;

	        _classCallCheck(this, Terminal);

	        var _this = _possibleConstructorReturn(this, (Terminal.__proto__ || Object.getPrototypeOf(Terminal)).call(this));

	        _this.Bash = new _bash2.default(extensions);
	        _this.ctrlPressed = false;
	        _this.state = {
	            settings: settings,
	            history: history.slice(),
	            structure: Object.assign({}, structure),
	            cwd: ''
	        };
	        _this.handleKeyDown = _this.handleKeyDown.bind(_this);
	        _this.handleKeyUp = _this.handleKeyUp.bind(_this);
	        return _this;
	    }

	    _createClass(Terminal, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            this.refs.input.focus();
	        }
	    }, {
	        key: 'componentWillReceiveProps',
	        value: function componentWillReceiveProps(_ref2) {
	            var extensions = _ref2.extensions,
	                structure = _ref2.structure,
	                history = _ref2.history;

	            var updatedState = {};
	            if (structure) {
	                updatedState.structure = Object.assign({}, structure);
	            }
	            if (history) {
	                updatedState.history = history.slice();
	            }
	            if (extensions) {
	                this.Bash.commands = Object.assign({}, BaseCommands, extensions);
	            }
	            this.setState(updatedState);
	        }

	        /*
	         * Utilize immutability
	         */

	    }, {
	        key: 'shouldComponentUpdate',
	        value: function shouldComponentUpdate(nextProps, nextState) {
	            return this.state !== nextState || this.props !== nextProps;
	        }

	        /*
	         * Keep input in view on change
	         */

	    }, {
	        key: 'componentDidUpdate',
	        value: function componentDidUpdate() {
	            this.refs.input.scrollIntoView();
	        }

	        /*
	         * Forward the input along to the Bash autocompleter. If it works,
	         * update the input.
	         */

	    }, {
	        key: 'attemptAutocomplete',
	        value: function attemptAutocomplete() {
	            var input = this.refs.input.value;
	            var suggestion = this.Bash.autocomplete(input, this.state);
	            if (suggestion) {
	                this.refs.input.value = suggestion;
	            }
	        }

	        /*
	         * Handle keydown for special hot keys. The tab key
	         * has to be handled on key down to prevent default.
	         * @param {Event} evt - the DOM event
	         */

	    }, {
	        key: 'handleKeyDown',
	        value: function handleKeyDown(evt) {
	            if (evt.which === CTRL_CHAR_CODE) {
	                this.ctrlPressed = true;
	            } else if (evt.which === TAB_CHAR_CODE) {
	                // Tab must be on keydown to prevent default
	                this.attemptAutocomplete();
	                evt.preventDefault();
	            }
	        }

	        /*
	         * Handle keyup for special hot keys.
	         * @param {Event} evt - the DOM event
	         *
	         * -- Supported hot keys --
	         * ctrl + l : clear
	         * ctrl + c : cancel current command
	         * up - prev command from history
	         * down - next command from history
	         * tab - autocomplete
	         */

	    }, {
	        key: 'handleKeyUp',
	        value: function handleKeyUp(evt) {
	            if (evt.which === L_CHAR_CODE) {
	                if (this.ctrlPressed) {
	                    this.setState(this.Bash.execute('clear', this.state));
	                }
	            } else if (evt.which === C_CHAR_CODE) {
	                if (this.ctrlPressed) {
	                    this.refs.input.value = '';
	                }
	            } else if (evt.which === UP_CHAR_CODE) {
	                if (this.Bash.hasPrevCommand()) {
	                    this.refs.input.value = this.Bash.getPrevCommand();
	                }
	            } else if (evt.which === DOWN_CHAR_CODE) {
	                if (this.Bash.hasNextCommand()) {
	                    this.refs.input.value = this.Bash.getNextCommand();
	                } else {
	                    this.refs.input.value = '';
	                }
	            } else if (evt.which === CTRL_CHAR_CODE) {
	                this.ctrlPressed = false;
	            }
	        }
	    }, {
	        key: 'handleSubmit',
	        value: function handleSubmit(evt) {
	            evt.preventDefault();

	            // Execute command
	            var input = evt.target[0].value;
	            var newState = this.Bash.execute(input, this.state);
	            this.setState(newState);
	            this.refs.input.value = '';
	        }
	    }, {
	        key: 'renderHistoryItem',
	        value: function renderHistoryItem(style) {
	            var _this2 = this;

	            return function (item, key) {
	                var prefix = item.hasOwnProperty('cwd') ? _react2.default.createElement(
	                    'span',
	                    { style: style.prefix },
	                    _this2.props.prefix + ' ~' + item.cwd + ' $'
	                ) : undefined;
	                return _react2.default.createElement(
	                    'div',
	                    { 'data-test-id': 'history-' + key, key: key },
	                    prefix,
	                    item.value
	                );
	            };
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this3 = this;

	            var _props = this.props,
	                onClose = _props.onClose,
	                onExpand = _props.onExpand,
	                onMinimize = _props.onMinimize,
	                prefix = _props.prefix,
	                styles = _props.styles,
	                theme = _props.theme;
	            var _state = this.state,
	                history = _state.history,
	                cwd = _state.cwd;

	            var style = Object.assign({}, _styles2.default[theme] || _styles2.default.light, styles);
	            return _react2.default.createElement(
	                'div',
	                { className: 'ReactBash', style: style.ReactBash },
	                _react2.default.createElement(
	                    'div',
	                    { style: style.header },
	                    _react2.default.createElement('span', { style: style.redCircle, onClick: onClose }),
	                    _react2.default.createElement('span', { style: style.yellowCircle, onClick: onMinimize }),
	                    _react2.default.createElement('span', { style: style.greenCircle, onClick: onExpand })
	                ),
	                _react2.default.createElement(
	                    'div',
	                    { style: style.body, onClick: function onClick() {
	                            return _this3.refs.input.focus();
	                        } },
	                    history.map(this.renderHistoryItem(style)),
	                    _react2.default.createElement(
	                        'form',
	                        { onSubmit: function onSubmit(evt) {
	                                return _this3.handleSubmit(evt);
	                            }, style: style.form },
	                        _react2.default.createElement(
	                            'span',
	                            { style: style.prefix },
	                            prefix + ' ~' + cwd + ' $'
	                        ),
	                        _react2.default.createElement('input', {
	                            autoComplete: 'off',
	                            onKeyDown: this.handleKeyDown,
	                            onKeyUp: this.handleKeyUp,
	                            ref: 'input',
	                            style: style.input
	                        })
	                    )
	                )
	            );
	        }
	    }]);

	    return Terminal;
	}(_react.Component);

	exports.default = Terminal;


	Terminal.Themes = {
	    LIGHT: 'light',
	    DARK: 'dark',
	    SOLARIZED: 'solarized'
	};

	Terminal.propTypes = {
	    extensions: _propTypes2.default.object,
	    history: _propTypes2.default.array,
	    onClose: _propTypes2.default.func,
	    onExpand: _propTypes2.default.func,
	    onMinimize: _propTypes2.default.func,
	    prefix: _propTypes2.default.string,
	    structure: _propTypes2.default.object,
	    styles: _propTypes2.default.object,
	    theme: _propTypes2.default.string,
	    settings: _propTypes2.default.object
	};

	Terminal.defaultProps = {
	    extensions: {},
	    history: [],
	    onClose: noop,
	    onExpand: noop,
	    onMinimize: noop,
	    prefix: 'hacker@default',
	    structure: {},
	    styles: {},
	    theme: Terminal.Themes.LIGHT
	};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseInput = parseInput;
	exports.parse = parse;
	/*
	 * This method parses a single command + args. It handles
	 * the tokenization and processing of flags, anonymous args,
	 * and named args.
	 *
	 * @param {string} input - the user input to parse
	 * @returns {Object} the parsed command/arg dataf84t56y78ju7y6f
	 */
	function parseInput(input) {
	    var tokens = input.split(/ +/);
	    var name = tokens.shift();
	    var flags = {};
	    var args = {};
	    var anonArgPos = 0;

	    while (tokens.length > 0) {
	        var token = tokens.shift();
	        if (token[0] === '-') {
	            if (token[1] === '-') {
	                var next = tokens.shift();
	                args[token.slice(2)] = next;
	            } else {
	                token.slice(1).split('').forEach(function (flag) {
	                    flags[flag] = true;
	                });
	            }
	        } else {
	            args[anonArgPos++] = token;
	        }
	    }
	    return { name: name, flags: flags, input: input, args: args };
	}

	/*
	 * This function splits the input by `&&`` creating a
	 * dependency chain. The chain consists of a list of
	 * other commands to be run.
	 *
	 * @param {string} input - the user input
	 * @returns {Array} a list of lists of command/arg pairs
	 *
	 * Example: `cd dir1; cat file.txt && pwd`
	 * In this example `pwd` should only be run if dir/file.txt
	 * is a readable file. The corresponding response would look
	 * like this, where the outer list is the dependent lists..
	 *
	 * [
	 *   [
	 *     { command: 'cd', args: { 0: 'dir1'} },
	 *     { command: 'cat', args: { 0: 'file.txt'} }
	 *   ],
	 *   [
	 *     { command: 'pwd' }
	 *   ]
	 * ]
	 */
	function parse(inputs) {
	    return inputs.trim().split(/ *&& */).map(function (deps) {
	        return deps.split(/ *; */).map(parseInput);
	    });
	}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var BaseStyles = {};

	BaseStyles.ReactBash = {
	    borderRadius: '5px',
	    display: 'flex',
	    flexDirection: 'column',
	    fontFamily: '\'Inconsolata\', monospace',
	    fontSize: '13px',
	    fontWeight: '400',
	    height: '100%',
	    overflow: 'hidden',
	    textAlign: 'left'
	};

	BaseStyles.header = {
	    padding: '5px 10px 0'
	};

	var circle = {
	    borderRadius: '50%',
	    display: 'inline-block',
	    height: '15px',
	    marginRight: '5px',
	    width: '15px'
	};

	BaseStyles.redCircle = Object.assign({}, circle, {
	    backgroundColor: '#bf616a'
	});

	BaseStyles.yellowCircle = Object.assign({}, circle, {
	    backgroundColor: '#ebcb8b'
	});

	BaseStyles.greenCircle = Object.assign({}, circle, {
	    backgroundColor: '#a3be8c'
	});

	BaseStyles.body = {
	    flexGrow: 1,
	    overflowY: 'scroll',
	    padding: '10px'
	};

	BaseStyles.form = {
	    display: 'flex'
	};

	BaseStyles.input = {
	    background: 'none',
	    border: 'none',
	    color: 'inherit',
	    flexGrow: '1',
	    fontFamily: 'inherit',
	    fontSize: 'inherit',
	    outline: 'none !important',
	    padding: 0
	};

	BaseStyles.prefix = {
	    marginRight: '5px'
	};

	exports.default = {
	    light: Object.assign({}, BaseStyles, {
	        body: Object.assign({}, BaseStyles.body, {
	            backgroundColor: '#fff',
	            color: '#5D5D5D'
	        }),
	        header: Object.assign({}, BaseStyles.header, {
	            backgroundColor: '#eee'
	        }),
	        prefix: Object.assign({}, BaseStyles.prefix, {
	            color: '#bd081c'
	        })
	    }),
	    dark: Object.assign({}, BaseStyles, {
	        body: Object.assign({}, BaseStyles.body, {
	            backgroundColor: '#000',
	            color: '#d0d0d0'
	        }),
	        header: Object.assign({}, BaseStyles.header, {
	            backgroundColor: '#dcdbdb'
	        }),
	        prefix: Object.assign({}, BaseStyles.prefix, {
	            color: '#5b65fb'
	        })
	    }),
	    solarized: Object.assign({}, BaseStyles, {
	        body: Object.assign({}, BaseStyles.body, {
	            backgroundColor: '#073642',
	            color: '#657b83'
	        }),
	        header: Object.assign({}, BaseStyles.header, {
	            backgroundColor: '#dcdbdb'
	        }),
	        prefix: Object.assign({}, BaseStyles.prefix, {
	            color: '#859900'
	        })
	    })
	};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	if (true) {
	  var invariant = __webpack_require__(5);
	  var warning = __webpack_require__(6);
	  var ReactPropTypesSecret = __webpack_require__(7);
	  var loggedTypeFailures = {};
	}

	/**
	 * Assert that the values match with the type specs.
	 * Error messages are memorized and will only be shown once.
	 *
	 * @param {object} typeSpecs Map of name to a ReactPropType
	 * @param {object} values Runtime values that need to be type-checked
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @param {string} componentName Name of the component for error messages.
	 * @param {?Function} getStack Returns the component stack.
	 * @private
	 */
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
	  if (true) {
	    for (var typeSpecName in typeSpecs) {
	      if (typeSpecs.hasOwnProperty(typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
	        } catch (ex) {
	          error = ex;
	        }
	        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;

	          var stack = getStack ? getStack() : '';

	          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
	        }
	      }
	    }
	  }
	}

	module.exports = checkPropTypes;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var emptyFunction = __webpack_require__(4);
	var invariant = __webpack_require__(5);
	var warning = __webpack_require__(6);
	var assign = __webpack_require__(12);

	var ReactPropTypesSecret = __webpack_require__(7);
	var checkPropTypes = __webpack_require__(13);

	module.exports = function(isValidElement, throwOnDirectAccess) {
	  /* global Symbol */
	  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

	  /**
	   * Returns the iterator method function contained on the iterable object.
	   *
	   * Be sure to invoke the function with the iterable as context:
	   *
	   *     var iteratorFn = getIteratorFn(myIterable);
	   *     if (iteratorFn) {
	   *       var iterator = iteratorFn.call(myIterable);
	   *       ...
	   *     }
	   *
	   * @param {?object} maybeIterable
	   * @return {?function}
	   */
	  function getIteratorFn(maybeIterable) {
	    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  /**
	   * Collection of methods that allow declaration and validation of props that are
	   * supplied to React components. Example usage:
	   *
	   *   var Props = require('ReactPropTypes');
	   *   var MyArticle = React.createClass({
	   *     propTypes: {
	   *       // An optional string prop named "description".
	   *       description: Props.string,
	   *
	   *       // A required enum prop named "category".
	   *       category: Props.oneOf(['News','Photos']).isRequired,
	   *
	   *       // A prop named "dialog" that requires an instance of Dialog.
	   *       dialog: Props.instanceOf(Dialog).isRequired
	   *     },
	   *     render: function() { ... }
	   *   });
	   *
	   * A more formal specification of how these methods are used:
	   *
	   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
	   *   decl := ReactPropTypes.{type}(.isRequired)?
	   *
	   * Each and every declaration produces a function with the same signature. This
	   * allows the creation of custom validation functions. For example:
	   *
	   *  var MyLink = React.createClass({
	   *    propTypes: {
	   *      // An optional string or URI prop named "href".
	   *      href: function(props, propName, componentName) {
	   *        var propValue = props[propName];
	   *        if (propValue != null && typeof propValue !== 'string' &&
	   *            !(propValue instanceof URI)) {
	   *          return new Error(
	   *            'Expected a string or an URI for ' + propName + ' in ' +
	   *            componentName
	   *          );
	   *        }
	   *      }
	   *    },
	   *    render: function() {...}
	   *  });
	   *
	   * @internal
	   */

	  var ANONYMOUS = '<<anonymous>>';

	  // Important!
	  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
	  var ReactPropTypes = {
	    array: createPrimitiveTypeChecker('array'),
	    bool: createPrimitiveTypeChecker('boolean'),
	    func: createPrimitiveTypeChecker('function'),
	    number: createPrimitiveTypeChecker('number'),
	    object: createPrimitiveTypeChecker('object'),
	    string: createPrimitiveTypeChecker('string'),
	    symbol: createPrimitiveTypeChecker('symbol'),

	    any: createAnyTypeChecker(),
	    arrayOf: createArrayOfTypeChecker,
	    element: createElementTypeChecker(),
	    instanceOf: createInstanceTypeChecker,
	    node: createNodeChecker(),
	    objectOf: createObjectOfTypeChecker,
	    oneOf: createEnumTypeChecker,
	    oneOfType: createUnionTypeChecker,
	    shape: createShapeTypeChecker,
	    exact: createStrictShapeTypeChecker,
	  };

	  /**
	   * inlined Object.is polyfill to avoid requiring consumers ship their own
	   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	   */
	  /*eslint-disable no-self-compare*/
	  function is(x, y) {
	    // SameValue algorithm
	    if (x === y) {
	      // Steps 1-5, 7-10
	      // Steps 6.b-6.e: +0 != -0
	      return x !== 0 || 1 / x === 1 / y;
	    } else {
	      // Step 6.a: NaN == NaN
	      return x !== x && y !== y;
	    }
	  }
	  /*eslint-enable no-self-compare*/

	  /**
	   * We use an Error-like object for backward compatibility as people may call
	   * PropTypes directly and inspect their output. However, we don't use real
	   * Errors anymore. We don't inspect their stack anyway, and creating them
	   * is prohibitively expensive if they are created too often, such as what
	   * happens in oneOfType() for any type before the one that matched.
	   */
	  function PropTypeError(message) {
	    this.message = message;
	    this.stack = '';
	  }
	  // Make `instanceof Error` still work for returned errors.
	  PropTypeError.prototype = Error.prototype;

	  function createChainableTypeChecker(validate) {
	    if (true) {
	      var manualPropTypeCallCache = {};
	      var manualPropTypeWarningCount = 0;
	    }
	    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
	      componentName = componentName || ANONYMOUS;
	      propFullName = propFullName || propName;

	      if (secret !== ReactPropTypesSecret) {
	        if (throwOnDirectAccess) {
	          // New behavior only for users of `prop-types` package
	          invariant(
	            false,
	            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	            'Use `PropTypes.checkPropTypes()` to call them. ' +
	            'Read more at http://fb.me/use-check-prop-types'
	          );
	        } else if (("development") !== 'production' && typeof console !== 'undefined') {
	          // Old behavior for people using React.PropTypes
	          var cacheKey = componentName + ':' + propName;
	          if (
	            !manualPropTypeCallCache[cacheKey] &&
	            // Avoid spamming the console because they are often not actionable except for lib authors
	            manualPropTypeWarningCount < 3
	          ) {
	            warning(
	              false,
	              'You are manually calling a React.PropTypes validation ' +
	              'function for the `%s` prop on `%s`. This is deprecated ' +
	              'and will throw in the standalone `prop-types` package. ' +
	              'You may be seeing this warning due to a third-party PropTypes ' +
	              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
	              propFullName,
	              componentName
	            );
	            manualPropTypeCallCache[cacheKey] = true;
	            manualPropTypeWarningCount++;
	          }
	        }
	      }
	      if (props[propName] == null) {
	        if (isRequired) {
	          if (props[propName] === null) {
	            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
	          }
	          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
	        }
	        return null;
	      } else {
	        return validate(props, propName, componentName, location, propFullName);
	      }
	    }

	    var chainedCheckType = checkType.bind(null, false);
	    chainedCheckType.isRequired = checkType.bind(null, true);

	    return chainedCheckType;
	  }

	  function createPrimitiveTypeChecker(expectedType) {
	    function validate(props, propName, componentName, location, propFullName, secret) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== expectedType) {
	        // `propValue` being instance of, say, date/regexp, pass the 'object'
	        // check, but we can offer a more precise error message here rather than
	        // 'of type `object`'.
	        var preciseType = getPreciseType(propValue);

	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createAnyTypeChecker() {
	    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
	  }

	  function createArrayOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
	      }
	      var propValue = props[propName];
	      if (!Array.isArray(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
	      }
	      for (var i = 0; i < propValue.length; i++) {
	        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createElementTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!isValidElement(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createInstanceTypeChecker(expectedClass) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!(props[propName] instanceof expectedClass)) {
	        var expectedClassName = expectedClass.name || ANONYMOUS;
	        var actualClassName = getClassName(props[propName]);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createEnumTypeChecker(expectedValues) {
	    if (!Array.isArray(expectedValues)) {
	       true ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
	      return emptyFunction.thatReturnsNull;
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      for (var i = 0; i < expectedValues.length; i++) {
	        if (is(propValue, expectedValues[i])) {
	          return null;
	        }
	      }

	      var valuesString = JSON.stringify(expectedValues);
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createObjectOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
	      }
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
	      }
	      for (var key in propValue) {
	        if (propValue.hasOwnProperty(key)) {
	          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	          if (error instanceof Error) {
	            return error;
	          }
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createUnionTypeChecker(arrayOfTypeCheckers) {
	    if (!Array.isArray(arrayOfTypeCheckers)) {
	       true ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
	      return emptyFunction.thatReturnsNull;
	    }

	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (typeof checker !== 'function') {
	        warning(
	          false,
	          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
	          'received %s at index %s.',
	          getPostfixForTypeWarning(checker),
	          i
	        );
	        return emptyFunction.thatReturnsNull;
	      }
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	        var checker = arrayOfTypeCheckers[i];
	        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
	          return null;
	        }
	      }

	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createNodeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!isNode(props[propName])) {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      for (var key in shapeTypes) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          continue;
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createStrictShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      // We need to check all keys in case some are required but missing from
	      // props.
	      var allKeys = assign({}, props[propName], shapeTypes);
	      for (var key in allKeys) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          return new PropTypeError(
	            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
	            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
	            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
	          );
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }

	    return createChainableTypeChecker(validate);
	  }

	  function isNode(propValue) {
	    switch (typeof propValue) {
	      case 'number':
	      case 'string':
	      case 'undefined':
	        return true;
	      case 'boolean':
	        return !propValue;
	      case 'object':
	        if (Array.isArray(propValue)) {
	          return propValue.every(isNode);
	        }
	        if (propValue === null || isValidElement(propValue)) {
	          return true;
	        }

	        var iteratorFn = getIteratorFn(propValue);
	        if (iteratorFn) {
	          var iterator = iteratorFn.call(propValue);
	          var step;
	          if (iteratorFn !== propValue.entries) {
	            while (!(step = iterator.next()).done) {
	              if (!isNode(step.value)) {
	                return false;
	              }
	            }
	          } else {
	            // Iterator will provide entry [k,v] tuples rather than values.
	            while (!(step = iterator.next()).done) {
	              var entry = step.value;
	              if (entry) {
	                if (!isNode(entry[1])) {
	                  return false;
	                }
	              }
	            }
	          }
	        } else {
	          return false;
	        }

	        return true;
	      default:
	        return false;
	    }
	  }

	  function isSymbol(propType, propValue) {
	    // Native Symbol.
	    if (propType === 'symbol') {
	      return true;
	    }

	    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
	    if (propValue['@@toStringTag'] === 'Symbol') {
	      return true;
	    }

	    // Fallback for non-spec compliant Symbols which are polyfilled.
	    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
	      return true;
	    }

	    return false;
	  }

	  // Equivalent of `typeof` but with special handling for array and regexp.
	  function getPropType(propValue) {
	    var propType = typeof propValue;
	    if (Array.isArray(propValue)) {
	      return 'array';
	    }
	    if (propValue instanceof RegExp) {
	      // Old webkits (at least until Android 4.0) return 'function' rather than
	      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	      // passes PropTypes.object.
	      return 'object';
	    }
	    if (isSymbol(propType, propValue)) {
	      return 'symbol';
	    }
	    return propType;
	  }

	  // This handles more types than `getPropType`. Only used for error messages.
	  // See `createPrimitiveTypeChecker`.
	  function getPreciseType(propValue) {
	    if (typeof propValue === 'undefined' || propValue === null) {
	      return '' + propValue;
	    }
	    var propType = getPropType(propValue);
	    if (propType === 'object') {
	      if (propValue instanceof Date) {
	        return 'date';
	      } else if (propValue instanceof RegExp) {
	        return 'regexp';
	      }
	    }
	    return propType;
	  }

	  // Returns a string that is postfixed to a warning about an invalid type.
	  // For example, "undefined" or "of type array"
	  function getPostfixForTypeWarning(value) {
	    var type = getPreciseType(value);
	    switch (type) {
	      case 'array':
	      case 'object':
	        return 'an ' + type;
	      case 'boolean':
	      case 'date':
	      case 'regexp':
	        return 'a ' + type;
	      default:
	        return type;
	    }
	  }

	  // Returns class name of the object, if any.
	  function getClassName(propValue) {
	    if (!propValue.constructor || !propValue.constructor.name) {
	      return ANONYMOUS;
	    }
	    return propValue.constructor.name;
	  }

	  ReactPropTypes.checkPropTypes = checkPropTypes;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	if (true) {
	  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
	    Symbol.for &&
	    Symbol.for('react.element')) ||
	    0xeac7;

	  var isValidElement = function(object) {
	    return typeof object === 'object' &&
	      object !== null &&
	      object.$$typeof === REACT_ELEMENT_TYPE;
	  };

	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = __webpack_require__(14)(isValidElement, throwOnDirectAccess);
	} else {
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = require('./factoryWithThrowingShims')();
	}


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_16__;

/***/ })
/******/ ])
});
;