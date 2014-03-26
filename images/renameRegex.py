#!/usr/bin/env python
"""
Author: Daniel Zamorano
Date:   03/24/14

Renames files based on the input options.
"""

import os
import sys
import re

def nameCleaner(actualName):
  newName = actualName

  regexp = re.compile('\{(.+)\}.+(\.jpg)', re.IGNORECASE)

  if regexp.match(actualName):
    search = re.search('\{(.+)\}.+(\.JPG)', actualName, re.IGNORECASE)
    fileExtention = search.group(2)
    newName = search.group(1) + fileExtention.lower()
    print actualName + '!!' +newName
  else:
    print "file excluded: ", actualName

  return newName

for fileName in os.listdir('.'):
  os.rename(fileName, nameCleaner(fileName))

# exit successful
sys.exit(0)
