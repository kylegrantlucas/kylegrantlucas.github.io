'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rm = exports.whoami = exports.printenv = exports.echo = exports.pwd = exports.cd = exports.mkdir = exports.cat = exports.ls = exports.help = undefined;

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

var _const = require('./const');

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