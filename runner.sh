#!/usr/bin/env bash
docker run -it --rm  --network host \
 -v $PWD/src:/usr/local/apache2/cgi-bin \
 -v $PWD/htdocs:/usr/local/apache2/htdocs/ \
 -v /home/mofleury/Downloads/octocam/2017-10-21:/usr/local/apache2/htdocs/data \
 --name viewer  python-cgi
