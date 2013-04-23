mocha-lcov-reporter
===================

LCOV reporter for Mocha.

LCOV format can be found in this [geninfo manpage](http://ltp.sourceforge.net/coverage/lcov/geninfo.1.php). This LCOV reporter was built after [Sonar Javascript Plugin LCOVParser class](https://raw.github.com/SonarCommunity/sonar-javascript/master/sonar-javascript-plugin/src/main/java/org/sonar/plugins/javascript/coverage/LCOVParser.java).

Usage
=====

The mocha-lcov-reporter is a reporter for mocha. In order to get coverage data, the same instructions are to be followed as for the JSONCov and HTMLCov reporters:

- Install [node-jscoverage](https://github.com/visionmedia/node-jscoverage)
- Instrument your library with node-jscoverage
- Run your tests against your instrumented libraray and save the output

For example, the following script can be part of your build process:

```
#!/usr/bin/env bash
rm -rf coverage
rm -rf lib-cov

mkdir coverage

node-jscoverage lib lib-cov
mv lib lib-orig
mv lib-cov lib
mocha -R mocha-lcov-reporter > coverage/coverage.lcov
rm -rf lib
mv lib-orig lib
```

This script instruments your library (library 'lib', target 'lib-cov'), temporarily replaces your library by the instrumented version, run the tests and undo the replacing of the original library by the instrumented library.

A safer and better approach is to coverage your library, and include the directory with the instrumented code from your tests directly. Instead of doing a 'require("../lib")' do a 'require("../lib-cov")'. This saves the hassle of replacing directory 'lib' with directory 'lib-cov' and undoing it afterwards. You can set an environment variable to check if the instrumented library should be included or the normal version:

```
var lib = process.env.JSCOV ? require('../lib-cov') : require('../lib');
```

And run mocha as follows:

```
JSCOV=1 mocha -R mocha-lcov-reporter > coverage/coverage.lcov
```
