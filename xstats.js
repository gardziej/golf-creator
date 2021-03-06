/*!
 * xStats.js
 * Copyright 2011 John-David Dalton <http://allyoucanleet.com/>
 * Based on Stats.js, copyright Ricardo Cabello <http://mrdoob.com/>
 * Available under MIT license <https://github.com/jdalton/xstats.js/raw/master/LICENSE.txt>
 */
;(function(window, document) {

  /** Detect memory object */
  var memoryNS = (memoryNS = window.performance || window.webkitPerformance) &&
    memoryNS.memory && memoryNS,

  /** Internal cached used by various methods */
  cache = {
    'counter': 1,
    'frames': 0,
    'lastSecond': null,
    'lastTime': null,
    'data': { 'fps': new Data, 'ms': new Data, 'mem': new Data }
  },

  /** Math shortcuts */
  floor = Math.floor,
  max   = Math.max,
  min   = Math.min,
  round = Math.round;

  /*--------------------------------------------------------------------------*/

  /**
   * Data object constructor.
   * @private
   * @constructor
   */
  function Data() {
    // add own properties to avoid lookups on the Array.prototype
    return extend([], { 'max': null, 'min': null });
  }

  /**
   * xStats constructor.
   * @constructor
   * @param {Object} [options={}] Options object.
   * @example
   *
   * // basic usage
   * var stats = new xStats;
   *
   * // or using options
   * var stats = new xStats({
   *   'mode': 'ms',
   *   'height': 130,
   *   'width':200,
   *   'padding':10,
   *   'locked': false,
   *   'fps': {
   *     'bg': '#330000',
   *     'fg': '#cc6600'
   *   },
   *   'ms': {
   *     'bg': '#000033',
   *     'fg': '#3366ff'
   *   },
   *   'mem': {
   *     'bg': '#000033',
   *     'fg': '#660099'
   *   }
   * });
   *
   * // insert into document
   * document.body.appendChild(stats.element);
   */
  function xStats(options) {
    var clipped,
        height,
        padding,
        width,
        me = this,
        tmp = { },
        data = cache.data,
        element = document.createElement('div'),
        fps = extend({ }, me.fps),
        ms = extend({ }, me.ms),
        mem = extend({ }, me.mem),
        uid = 'xstats' + cache.counter++;

    // apply options
    extend(me, options || (options = { }));
    me.uid = uid;
    extend(tmp, me);

    fps = me.fps = extend(fps, options.fps);
    ms = me.ms = extend(ms, options.ms);
    mem = me.mem = extend(mem, options.mem);

    // compute dimensions
    padding = me.padding * 2;
    height = me.height - padding;
    width = me.width - padding;
    clipped = max(1, round(width * 0.02));
    width = floor(width / clipped);

    // sweet spot for font-size, height, and width
    tmp.titleHeight = round(height * 0.28);
    tmp.barWidth = clipped + 4;
    tmp.fontSize = (tmp.titleHeight / 22.2).toFixed(2);
    tmp.innerWidth = clipped * width;
    tmp.innerHeight = height - tmp.titleHeight;
    tmp.padding = round((me.width - tmp.innerWidth) / 2);

    // increase shared data if needed
    if (data.ms.length < width) {
      data.fps.length =
      data.ms.length =
      data.mem.length = width;
    }
    // append customized css
    appendCSS(
      interpolate(
        '.#{uid},.#{uid} .bg,.#{uid} .fg{width:#{width}px;height:#{height}px}' +
        '.#{uid} .mi{margin:#{padding}px;width:#{innerWidth}px}' +
        '.#{uid} p{font-size:#{fontSize}em;height:#{titleHeight}px;width:#{innerWidth}px}' +
        '.#{uid} ul{height:#{innerHeight}px;width:#{innerWidth}px}' +
        '.#{uid} li{width:#{barWidth}px}', tmp) +
      interpolate(
        '.#{uid}.fps{color:#{fg}}' +
        '.#{uid}.fps ul{background:#{fg}}' +
        '.#{uid}.fps .bg,.#{uid}.fps li{background:#{bg}}', extend(tmp, fps)) +
      interpolate(
        '.#{uid}.ms{color:#{fg}}' +
        '.#{uid}.ms ul{background:#{fg}}' +
        '.#{uid}.ms .bg,.#{uid}.ms li{background:#{bg}}', extend(tmp, ms)) +
      interpolate(
        '.#{uid}.mem{color:#{fg}}' +
        '.#{uid}.mem ul{background:#{fg}}' +
        '.#{uid}.mem .bg,.#{uid}.mem li{background:#{bg}}', extend(tmp, mem)));

    // build interface
    element.className = 'xstats ' + uid + ' ' + me.mode;
    element.innerHTML = '<div class=bg></div><div class=mi><p>&nbsp;</p><ul>' + repeat('<li></li>', width) + '</ul></div><div class=fg></div>';
    addListener(element, 'click', createSwapMode(me));

    // grab elements
    me.element = element;
    me.canvas = element.getElementsByTagName('ul')[0];
    me.title = element.getElementsByTagName('p')[0].firstChild;

    // keep track of instances to animate
    xStats.subclasses.push(me);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Adds a css class name to an element's className property.
   * @private
   * @param {Object} element The element.
   * @param {String} className The class name.
   */
  function addClass(element, className) {
    element.className += (element.className ? ' ' : '') + className;
  }

  /**
   * Registers an event listener on an element.
   * @private
   * @param {Object} element The element.
   * @param {String} eventName The name of the event to listen to.
   * @param {Function} handler The event handler.
   */
  function addListener(element, eventName, handler) {
    if (typeof element.addEventListener != 'undefined') {
      element.addEventListener(eventName, handler, false);
    } else if (element.attachEvent != 'undefined') {
      element.attachEvent('on' + eventName, handler);
    }
  }

  /**
   * Appends CSS text to a planted style sheet.
   * @private
   * @param {String} cssText The CSS text.
   */
  function appendCSS(cssText) {
    var node,
        prop = 'cssText',
        sheet = cache.sheet;

    if (!sheet) {
      node = document.getElementsByTagName('head')[0];
      sheet = cache.sheet = document.createElement('style');
      sheet.type = 'text/css';
      node.insertBefore(sheet, node.firstChild);
    }
    if (!(node = 'styleSheet' in sheet && sheet.styleSheet)) {
      prop = 'nodeValue';
      node = sheet.firstChild || sheet.appendChild(document.createTextNode(''));
    }
    node[prop] += cssText;
  }

  /**
   * Copies own/inherited properties of a source object to the destination object.
   * @private
   * @param {Object} destination The destination object.
   * @param {Object} [source={}] The source object.
   * @returns {Object} The destination object.
   */
  function extend(destination, source) {
    source || (source = { });
    for (var key in source) {
      destination[key] = source[key];
    }
    return destination;
  }

  /**
   * Modify a string by replacing named tokens with matching object property values.
   * @private
   * @param {String} string The string to modify.
   * @param {Object} object The template object.
   * @returns {String} The modified string.
   */
  function interpolate(string, object) {
    for (var key in object) {
      string = string.replace(RegExp('#\\{' + key + '\\}', 'g'), object[key]);
    }
    return string;
  }

  /**
   * Removes a css class name from an element's className property.
   * @private
   * @param {Object} element The element.
   * @param {String} className The class name.
   */
  function removeClass(element, className) {
    var cn,
        classNames = element.className.split(' '),
        filtered = [];

    while ((cn = classNames.pop())) {
      if (className != cn) {
        filtered.push(cn);
      }
    }
    element.className = filtered.join(' ');
  }

  /**
   * Repeat a string a given number of times using the `Exponentiation by squaring` algorithm.
   * @private
   * @param {String} string The string to repeat.
   * @param {Number} count The number of times to repeat the string.
   * @returns {String} The repeated string.
   * @see http://www.merlyn.demon.co.uk/js-misc0.htm#MLS
   */
  function repeat(string, count) {
    if (count < 1) return '';
    if (count % 2) return repeat(string, count - 1) + string;
    var half = repeat(string, count / 2);
    return half + half;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates the click event handler that controls swaping modes and redrawing the display.
   * @private
   * @param {Object} me The xStats instance.
   * @returns {Function} The event handler.
   */
  function createSwapMode(me) {
    return function() {
      if (!me.locked) {
        var mode = me.mode == 'fps' ? 'ms' : me.mode == 'ms' ? (memoryNS ? 'mem' : 'fps') : 'fps',
            element = me.element,
            nodes = me.canvas.childNodes,
            data = cache.data[mode],
            entry = data[0],
            pad = nodes.length,
            length = pad--;

        me.mode = mode;
        setTitle(me, entry && entry.value);
        while (length--) {
          entry = data[pad - length];
          setBar(me, nodes[length], entry && entry.percent);
        }
        removeClass(element, 'fps');
        removeClass(element, 'ms');
        removeClass(element, 'mem');
        addClass(element, mode);
      }
    };
  }

  /**
   * Records a value for the given mode.
   * @private
   * @param {String} mode The mode to record.
   * @param {Mixed} value The value recorded.
   */
  function record(mode, value) {
    var data = cache.data[mode],
        percent = min(100, 100 * (value / (mode == 'fps' ? 80 : mode == 'ms' ? 1e3 : 128)));

    value = mode == 'mem' ? value.toFixed(2) : round(value);
    data.length = [data.length, data.unshift({ 'value': value, 'percent': percent })][0];

    value = floor(value);
    data.min = min(data.min != null ? data.min : value, value);
    data.max = max(data.max != null ? data.max : value, value);
  }

  /**
   * Sets the LI element's height based on the given value.
   * @private
   * @param {Object} me The xStats instance.
   * @param {Object} node The LI element.
   * @param {Number} percent The bar height as a percentage.
   */
  function setBar(me, node, percent) {
    var height = 100,
        base = (height / 16) * 15,
        portion = (base / 100) * percent,
        value = percent != null ? (base - portion).toFixed(2) : height;

    node.style.height = value + '%';
  }

  /**
   * Sets a chart's title based on the given value.
   * @private
   * @param {Object} me The xStats instance.
   * @param {Number} value The value.
   */
  function setTitle(me, value) {
    var mode = me.mode,
        unit = mode == 'mem' ? 'MB' : mode.toUpperCase(),
        data = cache.data[mode];

    me.title.nodeValue = value == null ? ' ' :
      value + unit + ' (' + data.min + '-' + data.max + ')';
  }

  /**
   * Updates chart data and display of all xStats instances.
   * @private
   */
  function update() {
    var canvas,
        entry,
        me,
        mode,
        data = cache.data,
        now = new Date,
        secValue = now - cache.lastSecond,
        subclasses = xStats.subclasses,
        length = subclasses.length;

    // skip first call
    if (cache.lastTime != null) {
      // record data
      cache.frames++;
      record('ms', max(1e3 / 60, now - cache.lastTime));
      if (secValue > 999) {
        record('fps', min(60, 1e3 / (secValue / cache.frames)));
        memoryNS && record('mem', memoryNS.memory.usedJSHeapSize / 1048576);
        cache.frames = 0;
        cache.lastSecond = now;
      }
      // render instances
      while (length--) {
        me = subclasses[length];
        mode = me.mode;
        entry = data[mode][0];
        if (entry && (mode == 'ms' || !cache.frames)) {
          canvas = me.canvas;
          setTitle(me, entry.value);
          setBar(me, canvas.insertBefore(canvas.lastChild, canvas.firstChild), entry.percent);
        }
      }
    } else {
      cache.lastSecond = now;
    }
    cache.lastTime = now;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * An array of xStat instances.
   * @static
   * @member xStats
   * @type Array
   */
  xStats.subclasses = [];

  xStats.prototype = {

    /**
     * The height of the chart (px).
     * @member xStats
     * @type Number
     */
    'height': 48,

    /**
     * The width of the chart (px).
     * @member xStats
     * @type Number
     */
    'width': 94,

    /**
     * The inner padding of the chart that doesn't affect dimensions (px).
     * @member xStats
     * @type Number
     */
    'padding': 3,

    /**
     * A flag to indicate if the chart is locked at its current display mode.
     * @member xStats
     * @type Boolean
     */
    'locked': false,

    /**
     * The charts current display mode (fps, ms, mem).
     * @member xStats
     * @type String
     */
    'mode': 'fps',

    /**
     * The "frames per second" display mode options object.
     * @member xStats
     * @type Object
     */
    'fps': {

      /**
       * The background color of the chart for the display mode.
       * @member xStats#fps
       * @type String
       */
      'bg': '#282845',

      /**
       * The foreground color of the chart for the display mode.
       * @member xStats#fps
       * @type String
       */
      'fg': '#1affff'
    },

    /**
     * The "millisecond" display mode options object.
     * @member xStats
     * @type Object
     */
    'ms':  {

      /**
       * The background color of the chart for the display mode.
       * @member xStats#ms
       * @type String
       */
      'bg': '#284528',

      /**
       * The foreground color of the chart for the display mode.
       * @member xStats#ms
       * @type String
       */
      'fg': '#1aff1a'
    },

    /**
     * The "memory" display mode options object.
     * @member xStats
     * @type Object
     */
    'mem': {

      /**
       * The background color of the chart for the display mode.
       * @member xStats#mem
       * @type String
       */
      'bg': '#452831',

      /**
       * The foreground color of the chart for the display mode.
       * @member xStats#mem
       * @type String
       */
      'fg': '#ff1a8d'
    }
  };

  /*--------------------------------------------------------------------------*/

  // expose
  window.xStats = xStats;

  // ensure we can read memory info
  memoryNS = memoryNS && !!memoryNS.memory.usedJSHeapSize && memoryNS;

  // start recording
  setInterval(update, 1e3 / 60);

  // shared css
  appendCSS(
    '.xstats div{position:absolute;overflow:hidden}' +
    '.xstats p{margin:0;overflow:hidden;font-family:sans-serif;-webkit-text-size-adjust:100%}' +
    '.xstats ul{margin:0;padding:0;list-style:none;overflow:hidden}' +
    '.xstats li{float:right;height:100%;margin-left:-4px}' +
    '.xstats .bg{opacity:.5;filter:alpha(opacity=50)}' +
    '.xstats{cursor:pointer;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-o-user-select:none;user-select:none}');

}(this, this.document));
