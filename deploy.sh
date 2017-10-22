#!/usr/bin/env bash

scp htdocs/*.js htdocs/*.css osmc@192.168.1.25:/var/www/html/
scp src/*.html src/*.py osmc@192.168.1.25:/usr/lib/cgi-bin/