###
#
# js.dist.sh - Shell script to concatenate and minify lyquix Javascript library, and vue components/controllers
#
# @version     2.0.0-beta-4
# @package     tpl_lyquix
# @author      lyquix
# @copyright   Copyright (C) 2015 - 2018 Lyquix
# @license     GNU General Public License version 2 or later
# @link        https://github.com/lyquix/tpl_lyquix
#
###

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"
cd $DIR

# Lyquix
cat ./lib/core.js > ./lyquix.js
MODULES=("string" "util" "detect" "mutation" "geolocate" "responsive" "fixes" "accordion" "autoresize" "lyqbox" "menu" "tabs" "analytics")
for MOD in "${MODULES[@]}"
do
	cat ./lib/$MOD.js >> ./lyquix.js
done
uglifyjs ./lyquix.js > ./lyquix.min.js


# Vue
#if [ -f ./custom/components/*.js -o -f ./custom/controllers/*.js ]; then
if [[ -n $(find ./custom/components ./custom/controllers -name '*.js' -not -name '*.dist.js') ]]; then
	wget -O- -q https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.js > ./vue.js
	wget -O- -q https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.min.js > ./vue.min.js
fi
if [[ -n $(find ./custom/components -name '*.js' -not -name '*.dist.js') ]]; then
	find ./custom/components -name '*.js' -not -name '*.dist.js' -exec cat {} + >> ./vue.js
	find ./custom/components -name '*.js' -not -name '*.dist.js' -exec cat {} + >> ./vue.min.js
fi
if [[ -n $(find ./custom/controllers -name '*.js' -not -name '*.dist.js') ]]; then
	find ./custom/controllers -name '*.js' -not -name '*.dist.js' -exec cat {} + >> ./vue.js
	find ./custom/controllers -name '*.js' -not -name '*.dist.js' -exec cat {} + >> ./vue.min.js
fi


# Scripts
if [ -f ./scripts.js ]; then
    uglifyjs ./scripts.js > ./scripts.min.js
fi
