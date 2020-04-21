#!/bin/bash
###
#
# js.dist.sh - Shell script to concatenate and minify lyquix Javascript library, and vue components/controllers
#
# @version     2.1.0
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
MODULES=("string" "util" "detect" "mutation" "geolocate" "analytics" "responsive" "fixes" "accordion" "autoresize" "menu" "tabs" "fittext" "lyqbox" "popup")
for MOD in "${MODULES[@]}"
do
	cat ./lib/$MOD.js >> ./lyquix.js
done
npx jshint ./lyquix.js --verbose
npx terser --comments false ./lyquix.js > ./lyquix.min.js


# Vue
if [[ -n $(find ./custom/components ./custom/controllers -name '*.js' -not -name '*.dist.js') ]]; then
	npx wget -O- -q https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.js > ./vue.js
	npx wget -O- -q https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.min.js > ./vue.min.js
fi
if [[ -n $(find ./custom/components -name '*.js' -not -name '*.dist.js') ]]; then
	find ./custom/components -name '*.js' -not -name '*.dist.js' -exec cat {} + >> ./vue.js
	find ./custom/components -name '*.js' -not -name '*.dist.js' -exec cat {} + >> ./vue.min.js
fi
if [[ -n $(find ./custom/controllers -name '*.js' -not -name '*.dist.js') ]]; then
	find ./custom/controllers -name '*.js' -not -name '*.dist.js' -exec cat {} + >> ./vue.js
	find ./custom/controllers -name '*.js' -not -name '*.dist.js' -exec cat {} + >> ./vue.min.js
fi
if [ -f ./vue.js ]; then
		npx jshint ./vue.js --verbose
fi

# Scripts
if [ -f ./scripts.core.js ]; then
	cat ./scripts.core.js > ./scripts.js
	if [[ -n $(find ./custom/scripts -name '*.js' -not -name '*.dist.js') ]]; then
		find ./custom/scripts -name '*.js' -not -name '*.dist.js' -exec cat {} + >> ./scripts.js
	fi
	npx jshint ./scripts.js --verbose
	npx terser --comments false ./scripts.js > ./scripts.min.js
fi
