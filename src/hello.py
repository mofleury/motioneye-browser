#!/usr/bin/python

import ConfigParser

print "Content-type: text/html\n\n"

config = ConfigParser.ConfigParser()
config.read("./viewer.conf")

root = config.get("directory", "root")
templatePath = config.get("directory", "templatePath")

templateFile = open(templatePath, "r")

print templateFile.read()
