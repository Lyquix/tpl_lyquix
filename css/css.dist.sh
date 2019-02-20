#!/bin/bash
###
#
# css.dist.sh - Bash script to process SCSS files, run autoprefixer, and chunk files
#
# @version     2.1.0
# @package     tpl_lyquix
# @author      Lyquix
# @copyright   Copyright (C) 2015 - 2018 Lyquix
# @license     GNU General Public License version 2 or later
# @link        https://github.com/Lyquix/tpl_lyquix
#
###

# Get script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"
cd $DIR

sass ./styles.scss > ./styles.css
postcss -u autoprefixer --autoprefixer.browsers "> 0.5%, last 3 versions" -r ./styles.css
uglifycss ./styles.css > ./styles.min.css
