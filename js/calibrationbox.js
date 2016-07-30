/*!
 * calibrationbox.js is a plugin of Fabric.js
 * required Fabric.js
 *
 * Copyright 2016, Kevin<505253293@163.com>
 */
"use strict";

(function(win, doc, fabric, undef) {
  if (!!win.CalibrationBox) {
    return win.CalibrationBox;
  }

  fabric.Object.prototype.transparentCorners = false;

  var setConfig = function(object, config) {
    var configs = {
      strokeStyle: '#f00',
      lineWidth: 1
    };
    for (var key in configs) {
      if (!!config) {
        configs[key] = config[key];
      }
      object[key] = configs[key];
    }
    return object;
  };

  /**
   * CalibrationBox - 标定框的类
   *
   * @param  {type} id        目标 Canvas 的 id
   * @param  {type} opts      可选，配置当前标定框样式。
   * @param  {type} namespace 可选，配置所有标定框样式的命名空间。多次调用时，以最后传的值为准。默认 '_CalibrationBox_'
   * @returns {type}
   */
  function CalibrationBox(id, opts, namespace) {
    var canvas = this.__canvas = new fabric.Canvas(id);
    this.config = win[namespace] || window['_calibrationbox_'];
    this.opts = opts;
    this.MouseEvents();
  }

  CalibrationBox.prototype.setOpts = function(opts) {
    var prototypes = {
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      svgsrc: './assets/tran.svg'
    };
    for (var key in opts) {
      prototypes[key] = opts[key];
    }
    return prototypes;
  };

  CalibrationBox.prototype.MouseEvents = function() {
    var canvas = this.__canvas;
    //canvas.on('mouse:up', function() {
    // scope.flag = 2;
    // if (scope.width > 0 && scope.height > 0) {
    //   btns.css({
    //     left: scope.offsetX,
    //     top: scope.offsetY,
    //     display: 'block'
    //   });
    // }
    //});
    //
    // canvas.on('mouse:down', function(evt) {
    //   console.log(evt);
    //   shape.set({
    //     left: 0,
    //     top: 0,
    //     width: evt.e.offsetX,
    //     height: evt.e.offsetY
    //   }).setCoords();
    //   canvas.renderAll();
    // });
    //
    // canvas.on('mouse:move', function() {
    //   console.log('mouse:move');
    //   // if (scope.flag == 1) {
    //   //   scope.width = e.offsetX - scope.startX;
    //   //   scope.height = e.offsetY - scope.startY;
    //   //
    //   //   scope.offsetX = e.offsetX;
    //   //   scope.offsetY = e.offsetY;
    //   //   drawContext.clearRect(0, 0, width, height);
    //   //   drawContext.fillRect(scope.startX, scope.startY, scope.width, scope.height);
    //   // }
    // });
    //

    canvas.on('after:render', function() {
      var config = this.config;
      setConfig(canvas.contextContainer, config);
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
    });
  };

  CalibrationBox.prototype.createSVGShape = function(canvas, opts) {
    fabric.loadSVGFromURL(opts.svgsrc, function(objects, option) {
      var shape = fabric.util.groupSVGElements(objects, option);
      canvas.add(shape);
      shape.set({
        left: opts.left,
        top: opts.top,
        width: opts.width,
        height: opts.height,
        hasRotatingPoint: false
      }).setCoords();
      canvas.renderAll();
      canvas.forEachObject(function(obj) {
        var setCoords = obj.setCoords.bind(obj);
        obj.on({
          moving: setCoords,
          scaling: setCoords,
          rotating: setCoords
        });
      })
    });
  };

  CalibrationBox.prototype.create = function() {
    var canvas = this.__canvas,
      opts = this.setOpts(this.opts);
    this.createSVGShape(canvas, opts);
  };

  CalibrationBox.prototype.delete = function() {
    var canvas = this.__canvas;
    if (canvas.getActiveGroup()) {
      canvas.getActiveGroup().forEachObject(function(o) {
        canvas.remove(o);
      });
      canvas.discardActiveGroup().renderAll();
    } else {
      canvas.remove(canvas.getActiveObject());
    }
  };

  CalibrationBox.prototype.clear = function() {
    var canvas = this.__canvas;
    canvas.clear();
  };

  win.CalibrationBox = CalibrationBox;
})(window, document, fabric, undefined)
