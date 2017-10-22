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


def missingThumbnail(imageFiles):
    for f in imageFiles:
        thumbnail = thumbnails_root + "/" + f
        if not os.path.isfile(thumbnail):
            return 1
    return 0


print "Content-type: text/html\n\n"

config = ConfigParser.ConfigParser()

configPath = os.environ['CONFIG_PATH'] if 'CONFIG_PATH' in os.environ else './viewer.conf'

config.read(configPath)

directory = os.environ['QUERY_STRING']

root = config.get("directory", "motion_root") + "/" + directory
templatePath = "./day.html"

templateFile = open(templatePath, "r")

template = Template(templateFile.read())

parameters = {}
parameters.update(configSectionMap(config, 'web'))

imageFiles = [f for f in listdir(root) if
              (f.endswith(".jpg") or f.endswith(".mp4")) and isfile(join(root, f))]
imageFiles.sort()

thumbnails_root = config.get("directory", "thumbnails_root") + "/" + directory

# make sure that all thumbnails are present. this can be optimized in a lot of ways, but hell, it works...
if missingThumbnail(imageFiles):
    os.system(
        "mkdir -p {0} && mogrify  -format jpg -path {0} -thumbnail 100x100 {1}/*.jpg".format(thumbnails_root, root))
    for videoThumbnail in filter(lambda f : f.endswith(".thumb"), listdir(root)):
        basename = os.path.splitext(videoThumbnail)[0]
        os.system("cp {0} {1}".format(join(root, videoThumbnail), join(thumbnails_root, basename)))

parameters['images'] = imageFiles
parameters['day'] = directory

print template.substitute(parameters)
