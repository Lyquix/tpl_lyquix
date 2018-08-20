###
#
# js.sh - Shell script to concatenate and minify lyquix Javascript library, and vue components/controllers
#
# @version     1.0.5
# @package     tpl_lyquix
# @author      lyquix
# @copyright   Copyright (C) 2015 - 2018 Lyquix
# @license     GNU General Public License version 2 or later
# @link        https://github.com/lyquix/tpl_lyquix
#
###

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"
uglifyjs $DIR/lyquix.js > $DIR/lyquix.min.js
if [ -f $DIR/scripts.js ]; then
    uglifyjs $DIR/scripts.js > $DIR/scripts.min.js
fi
