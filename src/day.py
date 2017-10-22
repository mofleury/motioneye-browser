#!/usr/bin/python

import ConfigParser
from string import Template

import os
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

directory = os.environ['QUERY_STRING']

root = config.get("directory", "root") + "/" + directory
templatePath = "day.html"

templateFile = open(templatePath, "r")

template = Template(templateFile.read())

parameters = {}
parameters.update(configSectionMap(config, 'web'))

imageFiles = [f for f in listdir(root) if
              (f.endswith(".jpg") or f.endswith(".mp4")) and isfile(join(root, f))]
imageFiles.sort()

# make sure that all thumbnails are present. this can be optimized in a lot of ways, but hell, it works...
for f in imageFiles:
    thumbnail = f + ".thumb"
    if not os.path.isfile(root + "/" + thumbnail):
        filename, file_extension = os.path.splitext(f)

        thumbnailIntermediary = filename + ".thumb" + file_extension
        os.system(
            "cp {0} {1} && mogrify  -format jpg -thumbnail 160x120 {1} && mv {1} {2}"
                .format(root + "/" + f, root + "/" + thumbnailIntermediary, root + "/" + thumbnail))

parameters['images'] = imageFiles
parameters['day_root'] = parameters['motion_root'] + "/" + directory

print template.substitute(parameters)
