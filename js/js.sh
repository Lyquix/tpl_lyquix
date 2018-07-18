###
#
# js.sh - Shell script to concatenate and minify lyquix Javascript library 
#
# @version     2.0.0
# @package     tpl_lyquix
# @author      lyquix
# @copyright   Copyright (C) 2015 - 2018 $DIR/lyquix
# @license     GNU General Public License version 2 or later
# @link        https://github.com/lyquix/tpl_$DIR/lyquix
#
###

# Get script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

# Start with core
cat $DIR/lyquix.core.js > $DIR/lyquix.js

# Append the modules
MODULES=("util" "detect" "geolocate" "mutation" "responsive" "fixes" "menu" "lyqbox" "analytics")
for MOD in "${MODULES[@]}"
do
	cat $DIR/lyquix.$MOD.js >> $DIR/lyquix.js
done

# Minify
uglifyjs $DIR/lyquix.js > $DIR/lyquix.min.js
