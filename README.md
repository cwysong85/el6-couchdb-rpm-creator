# CentOS 6 Couchdb RPM creator
Trying to find a CentOS RPM for Couchdb? Relax... I've got you covered!  

## Distribution
### Erlang Dependency
You must install Erlang in order to run CouchDB. Here's a simple way to import their repo:
```
wget https://packages.erlang-solutions.com/erlang-solutions-1.0-1.noarch.rpm
rpm -Uvh erlang-solutions-1.0-1.noarch.rpm
```

### RPM folder
The `rpm` folder holds all the built RPMs for CentOS 6.

```
rpm ---
      |- couchdb-1.6.1-0.el6.x86_64.rpm
      |- couchdb-2.0.0-0.el6.x86_64.rpm
```

### Install & Configuration

Install the CouchDB version you downloaded:
```
yum install ./couchdb-X.X.X-0.el6.x86_64.rpm
```

The home directory for CouchDB is `/opt/couchdb`. The configuration files for couchdb are under directory `/opt/couchdb/etc`.

### Running
Use the service command to start/stop/restart the service:
```
service couchdb {start|force-start|stop|force-start|force-stop|status|restart}
```

### Logs
#### 1.6.1
The logs are located under the `/opt/couchdb/var/log/couchdb` directory.

#### 2.0.0
The logs are located under the `/var/log` directory. There are two logs, stderr and stdout.

### Couch Web UI
After configuring and starting the CouchDB service, you should be able to view the Web UI by visiting the IP of your CouchDB on a web browser:
```
http://[CouchDB-IP]:5984/_utils
```

You can verify the CouchDB installation by clicking on the "Verify Installation" link (on 1.6.1) or by clicking on the the "Verify" button (on 2.0.0).

## Development
### Build a new CouchDB version
#### Environment setup
The build environment can be on CentOS 6 or Mac. Before you begin, you'll need to download and install NodeJS:
```
https://nodejs.org/en/download/
```

Make sure `grunt` & `grunt-cli` are installed globally:
```
npm install grunt grunt-cli -g
```

Change to the `el6-couchdb-rpm-creator` root directory install dependencies for NodeJS.
```
cd /this/project/directory/el6-couchdb-rpm-creator
```

Install Node packages:
```
npm install
```

##### CentOS
RPM Development tools are required to build the RPM:
```
sudo yum install rpmdevtools
```

You must install Erlang in order to build CouchDB. Here's a simple way to import their repo:
```
wget https://packages.erlang-solutions.com/erlang-solutions-1.0-1.noarch.rpm
rpm -Uvh erlang-solutions-1.0-1.noarch.rpm
```

Install esl-erlang version that couchdb supports:
```
yum install esl-erlang-[version]
```

##### Mac OSX
**Note:** Installation can be done from source on Mac OSX either manually or with Homebrew. See these notes regarding installation with Homebrew.


#### Add a new version of CouchDB
Add any new versions of CouchDB and it's dependencies to the `build_versions` folder. The `build_versions` folder is separated by each version of CouchDB.

Add the new CouchDB version and the libs that need to be built under the `build_versions/x.x.x/libs` folder. Also add the init script under the `init.d` folder.

Then you'll need to create a new `build.sh` file for the build process. Here's an example build file:
```
#!/bin/bash
DIR=$(pwd)
LIBS="$DIR/build_versions/2.0.0/libs"
BUILD="$DIR/build"
# BUILD_DEPS="esl-erlang-19.2 wget autoconf autoconf-archive automake ncurses-devel curl-devel help2man libicu-devel libtool perl-Test-Harness openssl-devel"
FILE_EXT=".tar.gz"

COUCHDB_FILE="apache-couchdb-2.0.0"
COUCHDB_URL="$LIBS/$COUCHDB_FILE$FILE_EXT"

SPIDER_FILE="js185-1.0.0"
SPIDER_URL="$LIBS/$SPIDER_FILE$FILE_EXT"

# Add erlang repo
wget https://packages.erlang-solutions.com/erlang-solutions-1.0-1.noarch.rpm
rpm -Uvh erlang-solutions-1.0-1.noarch.rpm
rm erlang-solutions-1.0-1.noarch.rpm

yum clean all
yum groupinstall -y "Development Tools"
yum install -y esl-erlang-19.2 wget autoconf autoconf-archive automake ncurses-devel curl-devel help2man libicu-devel libtool perl-Test-Harness openssl-devel

mkdir -p $BUILD
tar -xvf $LIBS/$SPIDER_FILE$FILE_EXT -C $BUILD
tar -xvf $LIBS/$COUCHDB_FILE$FILE_EXT -C $BUILD

cd $BUILD/js-1.8.5/js/src
./configure
make

cd $BUILD/$COUCHDB_FILE
./configure
make release

```

Then create a `gruntScript.js` file for the RPM build process. Here's an example of how that should look:

```
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

```

#### Build the CouchDB RPM
Build the latest CouchDB version (2.0.0):
```
grunt build
```

Or build a specific version:
```
grunt build --target=[build_version]
```

### Contribution
If you want to contribute in any way, just send a pull request and I'll review. Thanks!
