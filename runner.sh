#!/usr/bin/env bash
docker run -it --rm  --network host -v $PWD/src:/usr/local/apache2/cgi-bin -v $PWD/htdocs:/usr/local/apache2/htdocs/ --name viewer  python-cgi
