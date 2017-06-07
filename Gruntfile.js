module.exports = function(grunt) {

    var rpmVersion = grunt.option('version') || '2.0.0';
    var rpmRelease = grunt.option('release') || '0.el6';
    var gruntScript = require('./build_versions/' + rpmVersion + '/gruntScript.js');

    if (!gruntScript) {
        throw 'Not a valid version! Dependency directory not found!';
    }

    grunt.initConfig({
        run: {
            buildDeps: {
                cmd: gruntScript.buildCmd
            },
            clean: {
                exec: 'rm -Rf ./build'
            }
        },
        easy_rpm: {

            options: {
                name: 'couchdb',
                version: rpmVersion,
                release: rpmRelease,
                buildArch: 'x86_64',
                summary: 'Apache CouchDB is open source database software that focuses on ease of use and having an architecture that completely embraces the web.',
                requires: gruntScript.requires,
                rpmDestination: 'rpm',
                tempDir: 'dist',
                keepTemp: false,
                preInstallScript: gruntScript.installScripts.preInstallScript,
                postInstallScript: gruntScript.installScripts.postInstallScript,
                preUninstallScript: gruntScript.installScripts.preUninstallScript,
                postUninstallScript: gruntScript.installScripts.postUninstallScript
            },

            release: {
                files: gruntScript.releaseFiles
            }
        }
    });

    // Load easy-rpm task
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-easy-rpm');

    // Build RPM task
    grunt.registerTask('build', ['run:buildDeps', 'easy_rpm', 'run:clean']);
    grunt.registerTask('clean', ['run:clean']);

    // default task
    grunt.registerTask('default', 'build');
};
