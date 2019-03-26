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