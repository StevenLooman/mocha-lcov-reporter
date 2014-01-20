
/**
 * Vars
 */
var config = require("../config.json")
  , filePath = process.env.LCOV_FILE || config.file
  , fs = require("fs")
  , fd = fs.openSync(filePath, 'w', 0755)
  , consoleOutput = config.consoleOutput;

/**
 * Expose `LCov`.
 */

exports = module.exports = LCov;

/**
 * Initialize a new LCOV reporter.
 * File format of LCOV can be found here: http://ltp.sourceforge.net/coverage/lcov/geninfo.1.php
 * The reporter is built after this parser: https://raw.github.com/SonarCommunity/sonar-javascript/master/sonar-javascript-plugin/src/main/java/org/sonar/plugins/javascript/coverage/LCOVParser.java
 *
 * @param {Runner} runner
 * @api public
 */

function LCov(runner) {
  runner.on('end', function(){
    var cov = global._$jscoverage || {};

    for (var filename in cov) {
      var data = cov[filename];
      reportFile(filename, data);
    }
  });
}

function reportFile(filename, data) {
  writeLine('SF:' + filename);

  data.source.forEach(function(line, num) {
    // increase the line number, as JS arrays are zero-based
    num++;

    if (data[num] !== undefined) {
      writeLine('DA:' + num + ',' + data[num]);
    }
  });

  writeLine('end_of_record');
}


function writeLine(line) {
    line = line + "\n";
    if (consoleOutput) {
      process.stdout.write(line);
    }
    fs.writeSync(fd, line, null, 'utf8');
}
