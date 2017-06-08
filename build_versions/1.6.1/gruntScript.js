module.exports = {
    // When RPM installs on target machine, these scripts are ran
    installScripts: {
        preInstallScript: [],
        postInstallScript: [
            "groupadd 'CouchDB-Administrator'",
            "adduser --system --no-create-home --shell /bin/bash --group 'CouchDB-Administrator' couchdb",
            "chown -R couchdb:couchdb /opt/couchdb",
            "ln -sf /opt/couchdb/etc/rc.d/couchdb /etc/init.d/couchdb",
            "chkconfig --add couchdb"
        ],
        preUninstallScript: [],
        postUninstallScript: []
    },

    // An array of packages that this package depends
    // ** Include esl-erlang version here **
    requires: ['esl-erlang <= 17.5.3'],

    // When the RPM build process occurs, these files are added to the RPM
    // see https://www.npmjs.com/package/grunt-easy-rpm for more info
    releaseFiles: [{
        cwd: "/opt/couchdb",
        src: "**/*",
        dest: "/opt/couchdb"
    }, {
        cwd: "build/mozjs17.0.0/js/src/dist",
        src: "**/*",
        dest: "/usr/local"
    }],

    // This is the script that is ran to build Couch and it's dependencies
    buildCmd: './build_versions/1.6.1/build.sh'
};
