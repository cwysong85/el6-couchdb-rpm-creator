module.exports = {
    // When RPM installs on target machine, these scripts are ran
    installScripts: {
        preInstallScript: [],
        postInstallScript: [
            "groupadd 'CouchDB-Administrator'",
            "adduser --system --no-create-home --shell /bin/bash --group 'CouchDB-Administrator' couchdb",
            "chown -R couchdb:couchdb /opt/couchdb",
            "chmod 0644 /opt/couchdb/etc/*"
        ],
        preUninstallScript: [],
        postUninstallScript: []
    },

    // An array of packages that this package depends
    // ** Include esl-erlang version here **
    requires: ['esl-erlang >= 19.2'],

    // When the RPM build process occurs, these files are added to the RPM
    // see https://www.npmjs.com/package/grunt-easy-rpm for more info
    releaseFiles: [{
        cwd: "build/apache-couchdb-2.0.0/rel/couchdb",
        src: "**/*",
        dest: "/opt/couchdb"
    }, {
        cwd: "build/js-1.8.5/js/src/dist",
        src: "**/*",
        dest: "/usr/local"
    }, {
        cwd: "build_versions/2.0.0/init.d",
        src: "couchdb",
        dest: "/etc/init.d",
        mode: "755"
    }],

    // This is the script that is ran to build Couch and it's dependencies
    buildCmd: './build_versions/2.0.0/build.sh'
};
