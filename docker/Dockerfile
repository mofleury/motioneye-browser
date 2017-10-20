FROM httpd:2.4

RUN apt-get update && apt-get -y install python

RUN echo 'LoadModule cgi_module modules/mod_cgi.so' >> /usr/local/apache2/conf/httpd.conf