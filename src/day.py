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


def missingThumbnails(imageFiles):
    return filter(lambda f: not os.path.isfile(thumbnails_root + "/" + f), imageFiles)


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
missing = missingThumbnails(imageFiles)

imageThumbnails = filter(lambda i: i.endswith(".jpg"), missing)
if len(imageThumbnails) > 0:
    missingList = " ".join(map(lambda i: root + "/" + i, imageThumbnails))
    os.system(
        "mkdir -p {0} && mogrify  -format jpg -path {0} -thumbnail 100x100 {1}".format(thumbnails_root, missingList))

videoThumbnails = filter(lambda i: i.endswith(".mp4"), missing)
if len(videoThumbnails) > 0:
    for videoThumbnail in videoThumbnails:
        os.system("cp {0} {1}".format(join(root, videoThumbnail +".thumb"), join(thumbnails_root, videoThumbnail)))

parameters['images'] = imageFiles
parameters['day'] = directory

print template.substitute(parameters)
