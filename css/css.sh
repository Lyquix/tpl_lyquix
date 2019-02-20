#!/bin/bash
###
#
# css.sh - Bash script to process SCSS files, run autoprefixer, and chunk files
#
# @version     1.0.8
# @package     tpl_lyquix
# @author      Lyquix
# @copyright   Copyright (C) 2015 - 2018 Lyquix
# @license     GNU General Public License version 2 or later
# @link        https://github.com/Lyquix/tpl_lyquix
#
###

# Get script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"

lessc --source-map=$DIR/styles.map $DIR/styles.less $DIR/styles.css
postcss -u autoprefixer --autoprefixer.browsers "> 0.5%, last 3 versions" -r $DIR/styles.css
uglifycss $DIR/styles.css > $DIR/styles.min.css
blessc chunk $DIR/styles.css
