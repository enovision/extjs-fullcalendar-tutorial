class directorizer {

    /**
     * constructor
     */
    constructor(plugin, config) {
        let me = this;
        
        me.plugin = plugin;
        me.config = config;

        me.lastLevel = null;
        me.el = null;

        me.postHandler = plugin.postHandler;
        me.iconPrefix = plugin.iconPrefix;
        me.iconMap = plugin.iconMap;
        me.iconMapOpen = plugin.iconMapOpen;
        me.iconFile = plugin.iconFile;
        me.iconQuestion = plugin.iconQuestion;
        me.iconClass = plugin.iconClass;

        me.charPath = plugin.charPath;
        me.charFile = plugin.charFile;
        me.charMap = plugin.charMap;
        me.charMapOpen = plugin.charMapOpen;
        me.validator;

        me.typeFile = plugin.typeFile;
        me.typeMap = plugin.typeMap;
        me.typeMapOpen = plugin.typeMapOpen;
        me.colorName = plugin.colorName;

        me.extIcons = {
            'jpg': 'fa fa-cog',
            'pdf': 'fa fa-question'
        };
    }

    /**
     * 
     * @param {*} element 
     * @returns 
     */
     renderElement(element) {
        let me = this;
        let level, type, levelClass, firstClass;

        level = this.getLevel(element);
        type = this.getType(element);

        levelClass = 'level-'.level;
        firstClass = me.lastLevel !== null && level !== me.lastLevel;
        hiliteColor = null;

        if (me.colorName) {
            if (type === me.typeMap) {
                hiliteColor = me.config.hiliteColor.mc;
            } else if (type === me.typeMapOpen) {
                hiliteColor = me.config.hiliteColor.mco;
                if (empty(hiliteColor)) {
                    hiliteColor = me.config.hiliteColor.mc;
                }
            } else if (type === me.typeFile) {
                hiliteColor = me.config.hiliteColor.fc;
            }
        }

        me.buildNode({
            type: type,
            levelClass: levelClass,
            firstClass: firstClass,
            hiliteColor: hiliteColor
        });

        me.lastLevel = level;

        return html;
    }

    getIcon(_sc, type) {
        icon = me.iconQuestion;
        iconColor = null;

        if (type === me.typeMap) {
            _mi = me.config.hiliteColor.mi;
            iconColor = me.iconColor;
            icon = empty(_mi) ? me.iconMap : _mi;
        } else if(type === me.typeMapOpen) {
            icon = me.iconMapOpen;
            iconColor = me.config.hiliteColor.mco;
            if (empty(iconColor)) {
                iconColor = me.config.iconColor;
            }
        } else if(type === me.typeFile) {
            icon = me.config.iconFile;
            iconColor = me.config.hiliteColor.iconColor;
        }

        me.buildIconEl({
            icon: icon,
            iconColor: iconColor
        });


    }

    /**
     * 
     * @param {*} element 
     * @returns 
     */
    getLevel(element) {
        level = 0;
        split = strsplit(element);

        foreach(split as _char) {
            if (_char === me.charPath) {
                level++;
            } else {
                break;
            }
        }

        return level;
    }

    /**
     * 
     * @param {*} element 
     * @returns 
     */
    getType(element) {
        let me = this;

        type = me.typeFile;

        split = me.strsplit(element);



        foreach(split as _char) {
            if (!in_array(_char, me.validator)) {
                break;
            }

            if (_char === me.charFile) {
                type = me.typeFile;
            } elseif(_char === me.charMap) {
                type = me.typeMap;
            } elseif(_char === me.charMapOpen) {
                type = me.typeMapOpen;
            }
        }

        return type;
    }

    /**
     * 
     * @param {*} element 
     * @returns 
     */
    getContent(element) {
        let me = this,
        pos = 0,
        split = strsplit(element, 1);

        validator = me.array_merge(me.validator, [' ']);

        split.map(function(char) {
            if (!in_array(_char, validator)) {
                break;
            }
            pos++;
        });

        _output = substr(element, pos);
        _output = preg_replace('~[\r\n]+~', '', _output);

        return sprintf(
            '<span class="%s-name">%s</span>',
            me.getType(element),
            _output
        );
    }


    buildIconEl(args) {
        let iEl;
        iEl = document.createElement('i');

        iEl.classList.add(me.iconPrefix);
        iEl.classList.add(args.icon);
        iEl.classList.add(me.iconClass);
        
        if (args.iconColor !== null) {
           iEl.style.color = iconColor;
        }

        return iEl;
    }


    /**
     *  @param object args
     * 
     *   type: type,
     *   levelClass: levelClass,
     *   firstClass: firstClass,
     *   hiliteColor: hiliteColor
     */
    buildEl(args) {
        html = sprintf(
            '<li class="%s %s %s" %s>%s%s</li>',
            type,
            levelClass,
            firstClass ? '--first--' : '--rest--',
            me.colorName && !empty(hiliteColor) ? 'style="color:' + hiliteColor + '"' : '',
            me.getIcon(_sc, type),
            me.getContent(element)
        );
    }







    buildWidgetEl(plugin, widget, callback) {
        let me = this,
            source = widget.source,
            dsSource = source.dom.dataset,
            ajaxUrl = 'index.php?route=extension/module/plugin/get_widget',
            widgetInstanceId = widget.instanceId,
            newId = widget.id + '-' + widgetInstanceId;

        $.when(
            $.ajax({
                url: ajaxUrl,
                dataType: 'html',
                method: 'GET',
                data: {
                    user_token: getURLVar('user_token'),
                    plugin: dsSource.plugin,
                    plugin_id: dsSource.pluginId,
                    instance: widgetInstanceId,
                    boxid: dsSource.box,
                    widget_id: dsSource.pluginWidgetId,
                    widgettype: dsSource.widgetType,
                    widget_widget_id: newId
                },
                success: function (response) {
                    let json = JSON.parse(response);
                    let div, responseNodes, modalNode;

                    // widget

                    div = document.createElement('div');
                    div.innerHTML = json.widget.trim();

                    responseNodes = div.firstChild;

                    // this id is set in the twig on the server
                    widget.id = responseNodes.id;
                    widget.dom = responseNodes;
                    widget.domEl = json.widget;

                    // modals

                    div = document.createElement('div');
                    div.innerHTML = json.modal.trim();

                    modalNode = div.firstChild;
                    me.modals.appendChild(modalNode);

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    let target = me.parent.appliedEl;
                    let error = thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText;
                    let parsedError = jQuery.parseHTML(error);
                    target.appendChild(parsedError);
                }
            })
        ).done(callback);
    }

    setData(dom, data) {

        for (let [key, value] of Object.entries(data)) {
            dom.setAttribute('data-' + key, value);
        }

        return dom;
    }

    /**
     * PHP strsplit alternative in JS
     */
    strsplit(string, splitLength = null) {
        let chunks = [], 
        pos = 0, 
        len = string.length;

        if (splitLength === null) {
          splitLength = 1;
        }

        if (string === null || splitLength < 1) {
          return false;
        }
        string += '';
        
        while (pos < len) {
          chunks.push(string.slice(pos, pos += splitLength));
        }

        return chunks;
      }

      /**
       * PHP array_merge alternative in JS
       * @param {*} arr1 
       * @param {*} arr2 
       * @returns 
       */
      array_merge(arr1, arr2) {
        return Array.from(new Set(arr1.concat(arr2).sort((a,b) => (a-b))));
      }

      /**
       * PHP in_array alternative in JS
       */
     in_array(needle, haystack) {
        let length = haystack.length;

        for(var i = 0; i < length; i++) {
            if(haystack[i] == needle) return true;
        }
        
        return false;
    }
}