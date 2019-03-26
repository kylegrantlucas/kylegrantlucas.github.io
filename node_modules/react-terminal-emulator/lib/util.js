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

var _const = require('./const');

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