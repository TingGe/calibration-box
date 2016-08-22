/*!
 * calibrationbox.js is a plugin of Fabric.js
 * required Fabric.js
 *
 * Copyright 2016, Kevin<505253293@163.com>
 */
"use strict";

(function(fabric) {
  var global = !!global ? global : window;
  if (!!global.CalibrationBox) {
    return global.CalibrationBox;
  }

  fabric.Object.prototype.transparentCorners = false;

  var tranGif = 'data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAMwAAZgAAmQAAzAAA/wAzAAAzMwAzZgAzmQAzzAAz/wBmAABmMwBmZgBmmQBmzABm/wCZAACZMwCZZgCZmQCZzACZ/wDMAADMMwDMZgDMmQDMzADM/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMzADMzMzMzZjMzmTMzzDMz/zNmADNmMzNmZjNmmTNmzDNm/zOZADOZMzOZZjOZmTOZzDOZ/zPMADPMMzPMZjPMmTPMzDPM/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YzAGYzM2YzZmYzmWYzzGYz/2ZmAGZmM2ZmZmZmmWZmzGZm/2aZAGaZM2aZZmaZmWaZzGaZ/2bMAGbMM2bMZmbMmWbMzGbM/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5kzAJkzM5kzZpkzmZkzzJkz/5lmAJlmM5lmZplmmZlmzJlm/5mZAJmZM5mZZpmZmZmZzJmZ/5nMAJnMM5nMZpnMmZnMzJnM/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wzAMwzM8wzZswzmcwzzMwz/8xmAMxmM8xmZsxmmcxmzMxm/8yZAMyZM8yZZsyZmcyZzMyZ/8zMAMzMM8zMZszMmczMzMzM/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8zAP8zM/8zZv8zmf8zzP8z//9mAP9mM/9mZv9mmf9mzP9m//+ZAP+ZM/+ZZv+Zmf+ZzP+Z///MAP/MM//MZv/Mmf/MzP/M////AP//M///Zv//mf//zP///xISEhgYGB4eHiQkJCoqKjAwMDY2Njw8PEJCQkhISE5OTlRUVFpaWmBgYGZmZmxsbHJycnh4eH5+foSEhIqKipCQkJaWlpycnKKioqioqK6urrS0tLq6usDAwMbGxszMzNLS0tjY2N7e3uTk5Orq6vDw8Pb29vz8/CH5BAEAAAAALAAAAAABAAEARwgEAAEEBAA7',
    SCALE_FACTOR = 1.1,
    scope = {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };

  var setConfig = function(object, config) {
    var configs = {
      strokeStyle: '#0f0',
      lineWidth: 1
    };
    for (var key in configs) {
      object[key] = !!config && config[key] || configs[key];
    }
    return object;
  };

  /**
   * CalibrationBox - 标定框的类
   *
   * @param  {string} id               目标 Canvas 的 id
   * @param {string} backgroundImage   背景图 url
   * @param  {obj} config           可选，配置所有标定框样式
   * @returns {type}
   */
  function CalibrationBox(id, backgroundImage, config) {
    var canvas = this.__canvas = new fabric.Canvas(id);
    canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(canvas), {
      backgroundImageStretch: true
    });

    this.config = config;
    this.count = 0;
    this.canvasScale = 1;
    this.center = canvas.getVpCenter();
    this.MouseEvents();
    return this;
  }

  CalibrationBox.prototype.getCanvas = function() {
    return this.__canvas;
  };

  CalibrationBox.prototype.setOpts = function(opts) {
    var prototypes = {
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      src: tranGif
    };
    for (var key in opts) {
      prototypes[key] = opts[key];
    }
    return prototypes;
  };

  CalibrationBox.prototype.MouseEvents = function() {
    var oThis = this,
      canvas = this.__canvas,
      config = this.config;
    canvas.on('after:render', function() {
      canvas.forEachObject(function(obj) {
        if (obj.active) {
          return false;
        }
        var bound = obj.getBoundingRect();
        canvas.contextContainer.strokeRect(
          bound.left + 0.5,
          bound.top + 0.5,
          bound.width,
          bound.height
        );
      })
      setConfig(canvas.contextContainer, config);
    });

    // 内置行为
    canvas.on('mouse:down', function(evt) {
      scope.left = evt.e.offsetX;
      scope.top = evt.e.offsetY;
    });

    canvas.on('mouse:up', function(evt) {
      var pos = evt.e,
        flag = true,
        width = pos.offsetX - scope.left,
        height = pos.offsetY - scope.top;
      canvas.forEachObject(function(obj) {
        if (obj.active) {
          flag = false;
        }
      })
      if (flag && width > 0 && height > 0) {
        scope.width = width;
        scope.height = height;
        oThis.create(scope);
      }
    });
  };

  CalibrationBox.prototype.createImgShape = function(canvas, opts) {
    fabric.Image.fromURL(opts.src, function(shape) {
      shape.set({
        left: opts.left,
        top: opts.top,
        width: opts.width,
        height: opts.height,
        hasControls: true,
        hasBorders: true,
        hasRotatingPoint: false
      }).setCoords();
      canvas.add(shape).setActiveObject(shape);
      canvas.renderAll();
    });
  };

  CalibrationBox.prototype.create = function(opts) {
    var canvas = this.__canvas;
    opts = this.setOpts(opts);
    this.createImgShape(canvas, opts);
  };

  CalibrationBox.prototype.delete = function() {
    var canvas = this.__canvas,
      flag = false;
    if (canvas.getActiveGroup()) {
      canvas.getActiveGroup().forEachObject(function(o) {
        canvas.remove(o);
      });
      flag = true;
    }
    if (canvas.getActiveObject()) {
      canvas.remove(canvas.getActiveObject());
      flag = true;
    }
    canvas.renderAll();
    return flag;
  };

  CalibrationBox.prototype.clear = function() {
    var canvas = this.__canvas;
    canvas.clear();
  };

  CalibrationBox.prototype.moveTo = function(direction, step) {
    var canvas = this.__canvas,
      flag = false;
    if (canvas.getActiveGroup()) {
      canvas.getActiveGroup().forEachObject(function(o) {
        o[direction] += step;
        o.setCoords();
      });
      flag = true;
    }
    if (canvas.getActiveObject()) {
      canvas.getActiveObject()[direction] += step;
      canvas.getActiveObject().setCoords();
      flag = true;
    }
    canvas.renderAll();
    return flag;
  };

  CalibrationBox.prototype.save = function() {
    var canvas = this.__canvas,
      result = [];
    canvas.forEachObject(function(o) {
      var coord = o.oCoords,
        arr = [coord.tl.x, coord.tl.y, coord.br.x, coord.br.y];
      result.push(arr);
    });
    return result;
  };

  // 设置缩放级别和中心点
  // CalibrationBox.prototype.zoom = function(clicks, evt) {
  //   var canvas = this.__canvas,
  //     canvasScale = this.canvasScale,
  //     count = this.count,
  //     lastX = evt.offsetX,
  //     lastY = evt.offsetY,
  //     percent = 1,
  //     pt = new fabric.Point(lastX, lastY);
  //
  //   if (clicks < 0) {
  //     // zoom out
  //     percent = canvas.getZoom() * 1.25;
  //     count--;
  //   } else {
  //     //zoom in
  //     percent = canvas.getZoom() * 0.8;
  //     count++;
  //   }
  //   canvas.zoomToPoint(pt, percent);
  //   canvas.renderAll();
  // };
  //
  // CalibrationBox.prototype.resetZoom = function() {
  //   // Todo:
  //   var canvas = this.__canvas,
  //     center = canvas.getCenter(),
  //     pt = new fabric.Point(center.left, center.top);
  //   canvas.setZoom(1);
  //   canvas.renderAll();
  // };

  global.CalibrationBox = CalibrationBox;
})(fabric)
