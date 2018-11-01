# lqx Options

`@version     2.0.0`

## Default Options

The following JSON string is provided as a reference of the complete set of options for `lqx`, with their default values:

```
{
  "debug": true,
  "siteURL": null,
  "tmplURL": null,
  "accordion": {
    "enabled": true,
    "scrollTop": {
      "enabled": true,
      "padding": 5,
      "duration": 500
    }
  },
  "analytics": {
    "enabled": true,
    "downloads": true,
    "outbound": true,
    "scrollDepth": true,
    "lyqBox": true,
    "video": true,
    "userActive": {
      "enabled": true,
      "idleTime": 5000,
      "throttle": 100,
      "refresh": 250,
      "maxTime": 1800000
    },
    "createParams": null,
    "setParams": null,
    "requireParams": null,
    "provideParams": null,
    "customParamsFuncs": null,
    "abTestName": null,
    "abTestNameDimension": null,
    "abTestGroupDimension": null
  },
  "autoresize": {
    "enabled": true,
    "sel": [
      "textarea",
      "input[type=text]",
      "input[type=email]",
      "input[type=number]",
      "select:not([size])"
    ]
  },
  "detect": {
    "enabled": true,
    "mobile": true,
    "browser": true,
    "os": true,
    "urlParts": true,
    "urlParams": true,
    "features": true
  },
  "fixes": {
    "enabled": true,
    "imgWidthAttrib": {
      "enabled": true,
      "method": "include",
      "matches": [
        {
          "browser": {
            "type": "msie"
          }
        }
      ]
    },
    "fontFeatureOpts": {
      "enabled": true,
      "method": "include",
      "matches": [
        {
          "browser": {
            "type": "msie"
          }
        }
      ]
    },
    "cssGrid": {
      "enabled": true,
      "method": "include",
      "matches": [
        {
          "browser": {
            "type": "msie"
          }
        }
      ]
    },
    "linkPreload": {
      "enabled": true,
      "method": "include",
      "matches": [
        {
          "os": {
            "type": "ios",
            "version": [
              null,
              "11.2"
            ]
          }
        },
        {
          "browser": {
            "type": "msie"
          }
        },
        {
          "browser": {
            "type": "firefox"
          }
        },
        {
          "browser": {
            "type": "safari",
            "version": [
              null,
              "11.2"
            ]
          }
        },
        {
          "browser": {
            "type": "msedge",
            "version": [
              null,
              16
            ]
          }
        }
      ]
    },
    "objectFit": {
      "enabled": true,
      "method": "include",
      "matches": [
        {
          "browser": {
            "type": "msie"
          }
        }
      ]
    }
  },
  "geolocate": {
    "enabled": true,
    "gps": false
  },
  "lyqbox": {
    "enabled": true,
    "html": "<div id=\"lyqbox\"><div class=\"content-wrapper\"><div class=\"content\"></div><div class=\"info\"><div class=\"title\"></div><div class=\"caption\"></div><div class=\"credit\"></div></div></div><div class=\"content-wrapper\"><div class=\"content\"></div><div class=\"info\"><div class=\"title\"></div><div class=\"caption\"></div><div class=\"credit\"></div></div></div><div class=\"close\"></div><div class=\"prev\"></div><div class=\"next\"></div><div class=\"zoom-in\"></div><div class=\"zoom-out\"></div><div class=\"counter\"><span class=\"current\"></span> / <span class=\"total\"></span></div><div class=\"thumbnails\"></div><div class=\"loading\"></div></div>",
    "analytics": true
  },
  "menu": {
    "enabled": true,
    "screens": [
      "xs",
      "sm",
      "md",
      "lg",
      "xl"
    ]
  },
  "mutation": {
    "enabled": true
  },
  "responsive": {
    "enabled": true,
    "sizes": [
      "xs",
      "sm",
      "md",
      "lg",
      "xl"
    ],
    "breakPoints": [
      320,
      640,
      960,
      1280,
      1600
    ],
    "minIndex": "0",
    "maxIndex": "4"
  },
  "string": {
    "enabled": true,
    "funcs": [
      "capitalize",
      "isCreditCard",
      "isEmail",
      "isSSN",
      "isURL",
      "isUsPhone",
      "isZipCode",
      "latinize",
      "slugify",
      "toCamelCase",
      "toKebabCase",
      "toSnakeCase",
      "toTitleCase",
      "words"
    ]
  },
  "tabs": {
    "enabled": true
  },
  "util": {
    "enabled": true
  }
}
```

## Analytics Options

The following are examples of options to setup Google Analytics:

```
"createParams": {
  "default": {
    "trackingId": "UA-XXXXX-Y",
    "cookieDomain": "auto",
    "fieldsObject": {}
  }
}

"setParams": {
  "default": {
    "dimension1": "Age",
    "metric1": 25
  }
}

"requireParams": {
  "default: {
    "pluginName": "displayFeatures",
    "pluginOptions": {
      "cookieName": "mycookiename"
    }
  }
}

"provideParams": {
  "default": {
    "pluginName": "MyPlugin",
    "pluginConstructor": myPluginFunc
  }
}
```
