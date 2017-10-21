#!/usr/bin/python

import ConfigParser
from string import Template

from os import listdir
from os.path import isfile, join


def configSectionMap(conf, section):
    dict1 = {}
    options = conf.options(section)
    for option in options:
        dict1[option] = conf.get(section, option)
    return dict1


print "Content-type: text/html\n\n"

config = ConfigParser.ConfigParser()
config.read("./viewer.conf")

root = config.get("directory", "root")
templatePath = config.get("directory", "templatePath")

templateFile = open(templatePath, "r")

template = Template(templateFile.read())

parameters = {}
parameters.update(configSectionMap(config, 'web'))


imageFiles = [f for f in listdir(root) if f.endswith(".gif") and isfile(join(root, f))]

parameters['images'] = imageFiles

print template.substitute(parameters)
