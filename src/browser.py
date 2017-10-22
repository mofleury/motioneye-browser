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

root = config.get("directory", "root")

print """

<!DOCTYPE html>
<html>

<head>
</head>

<body translate="no">

<ul>
"""

days = filter(lambda d: os.path.isdir(os.path.join(root, d)), listdir(root))
days.sort()
for f in days:
    dayPath = join(root, f)
    contents = listdir(dayPath)
    imageCount = len(filter(lambda file: file.endswith(".jpg"), contents))
    videoCount = len(filter(lambda file: file.endswith(".mp4"), contents))

    print '<li><a href="/cgi-bin/day.py?{0}">{1}({2} images, {3} videos)</a></li>'.format(f, f, imageCount,
                                                                                          videoCount)
print """
</ul>
"""
