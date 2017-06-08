#!/bin/bash
DIR=$(pwd)
LIBS="$DIR/build_versions/1.6.1/libs"
BUILD="$DIR/build"
FILE_EXT=".tar.gz"

COUCHDB_FILE="apache-couchdb-1.6.1"
COUCHDB_URL="$LIBS/$COUCHDB_FILE$FILE_EXT"

SPIDER_FILE="mozjs17.0.0"
SPIDER_URL="$LIBS/$SPIDER_FILE$FILE_EXT"

# Add erlang repo
wget https://packages.erlang-solutions.com/erlang-solutions-1.0-1.noarch.rpm
rpm -Uvh erlang-solutions-1.0-1.noarch.rpm
rm erlang-solutions-1.0-1.noarch.rpm

yum clean all
yum groupinstall -y "Development Tools"
yum install -y esl-erlang-17.5.3 wget autoconf autoconf-archive automake ncurses-devel curl-devel help2man libicu-devel libtool perl-Test-Harness openssl-devel

mkdir -p $BUILD
tar -xvf $LIBS/$SPIDER_FILE$FILE_EXT -C $BUILD
tar -xvf $LIBS/$COUCHDB_FILE$FILE_EXT -C $BUILD

cd $BUILD/$SPIDER_FILE/js/src
./configure
make

cd $BUILD/$COUCHDB_FILE
./configure --prefix=/opt/couchdb
make && make install
