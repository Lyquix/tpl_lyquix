#!/bin/bash
###
#
# css.sh - Bash script to process SCSS files, run autoprefixer, and chunk files
#
# @version     1.0.10
# @package     tpl_lyquix
# @author      Lyquix
# @copyright   Copyright (C) 2015 - 2018 Lyquix
# @license     GNU General Public License version 2 or later
# @link        https://github.com/Lyquix/tpl_lyquix
#
###

# Get script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"

npx lessc --source-map=$DIR/styles.map $DIR/styles.less $DIR/styles.css
npx postcss -u autoprefixer -b \"\> 0.5%, last 3 versions\" -r $DIR/styles.css
npx uglifycss $DIR/styles.css > $DIR/styles.min.css
npx blessc chunk $DIR/styles.css