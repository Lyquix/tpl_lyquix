###
#
# js.sh - Shell script to concatenate and minify lyquix Javascript library, and vue components/controllers 
#
# @version     2.0.0
# @package     tpl_lyquix
# @author      lyquix
# @copyright   Copyright (C) 2015 - 2018 $DIR/lyquix
# @license     GNU General Public License version 2 or later
# @link        https://github.com/lyquix/tpl_$DIR/lyquix
#
###

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"

# Lyquix
cat $DIR/lib/lyquix.core.js > $DIR/lyquix.js
MODULES=("util" "detect" "geolocate" "mutation" "responsive" "fixes" "menu" "accordion" "lyqbox" "analytics")
for MOD in "${MODULES[@]}"
do
	cat $DIR/lib/lyquix.$MOD.js >> $DIR/lyquix.js
done
uglifyjs $DIR/lyquix.js > $DIR/lyquix.min.js


# Vue
if [[ -f $DIR/custom/components/*.js || -f $DIR/custom/controllers/*.js ]]; then
	wget -O- -q https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.js > $DIR/vue.js
	wget -O- -q https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.min.js > $DIR/vue.min.js
fi
if [ -f $DIR/custom/components/*.js ]; then
	cat $DIR/custom/components/*.js >> $DIR/vue.js
	cat $DIR/custom/components/*.js >> $DIR/vue.min.js
fi
if [ -f $DIR/custom/controllers/*.js ]; then
	cat $DIR/custom/controllers/*.js >> $DIR/vue.js
	cat $DIR/custom/controllers/*.js >> $DIR/vue.min.js
fi


# Scripts
if [ -f $DIR/scripts.js ]; then
    uglifyjs $DIR/scripts.js > $DIR/scripts.min.js
fi
