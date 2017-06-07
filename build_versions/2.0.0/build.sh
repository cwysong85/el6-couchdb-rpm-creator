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
