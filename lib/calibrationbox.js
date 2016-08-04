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

  var canvasScale = 1,
    SCALE_FACTOR = 1.2;

  var setConfig = function(object, config) {
    var configs = {
      strokeStyle: '#f00',
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
   * @param  {type} id               目标 Canvas 的 id
   * @param  {type} backgroundImage  背景图 URL
   * @param  {type} config           可选，配置所有标定框样式
   * @returns {type}
   */
  function CalibrationBox(id, config) {
    var canvas = this.__canvas = new fabric.Canvas(id);
    this.backgroundId = "background" + Math.floor(Math.random() * 100);
    this.config = config;
    this.MouseEvents();
    return this;
  }

  // Todo:
  CalibrationBox.prototype.setBackgroundImg = function() {
    var src = this.backgroundImage,
      backgroundId = this.backgroundId;
    //image
    fabric.util.loadImage(src, function(img) {
      var object = new fabric.Image(img);
      object.set({
        id: backgroundId,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        hasBorders: false
      });
      canvas.add(object);
      canvas.renderAll();
    });
  };

  CalibrationBox.prototype.getCanvas = function() {
    return this.__canvas;
  };

  CalibrationBox.prototype.setOpts = function(opts) {
    var prototypes = {
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      src: './assets/cms.gif'
    };
    for (var key in opts) {
      prototypes[key] = opts[key];
    }
    return prototypes;
  };

  CalibrationBox.prototype.MouseEvents = function() {
    var canvas = this.__canvas,
      config = this.config,
      backgroundId = this.backgroundId;
    setConfig(canvas.contextContainer, config);
    canvas.on('after:render', function() {
      canvas.forEachObject(function(obj) {
        if (obj.active || obj.id === backgroundId) {
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

  CalibrationBox.prototype.createImgShape = function(canvas, opts) {
    fabric.Image.fromURL(opts.src, function(shape) {
      shape.scale(1).set({
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
      result.push(o.oCoords);
    });
    return result;
  };

  // 设置缩放级别和中心点
  // CalibrationBox.prototype.ZoomIn = function() {
  //   var canvas = this.__canvas;
  //   // TODO limit the max canvas zoom in
  //   canvasScale = canvasScale * SCALE_FACTOR;
  //   canvas.setHeight(canvas.getHeight() * SCALE_FACTOR);
  //   canvas.setWidth(canvas.getWidth() * SCALE_FACTOR);
  //   canvas.forEachObject(function(obj) {
  //     obj.set({
  //       scaleX: obj.scaleX * SCALE_FACTOR,
  //       scaleY: obj.scaleY * SCALE_FACTOR,
  //       left: obj.left * SCALE_FACTOR,
  //       top: obj.top * SCALE_FACTOR
  //     }).setCoords();
  //   });
  //   canvas.renderAll();
  // };
  //
  // CalibrationBox.prototype.ZoomOut = function() {
  //   var canvas = this.__canvas;
  //   // TODO limit max cavas zoom out
  //   canvasScale = canvasScale / SCALE_FACTOR;
  //   canvas.setHeight(canvas.getHeight() * (1 / SCALE_FACTOR));
  //   canvas.setWidth(canvas.getWidth() * (1 / SCALE_FACTOR));
  //   canvas.forEachObject(function(obj) {
  //     obj.set({
  //       scaleX: obj.scaleX * (1 / SCALE_FACTOR),
  //       scaleY: obj.scaleY * (1 / SCALE_FACTOR),
  //       left: obj.left * (1 / SCALE_FACTOR),
  //       top: obj.top * (1 / SCALE_FACTOR)
  //     }).setCoords();
  //   });
  //   canvas.renderAll();
  // };
  //
  // CalibrationBox.prototype.resetZoom = function() {
  //   var canvas = this.__canvas;
  //   canvas.setHeight(canvas.getHeight() * (1 / canvasScale));
  //   canvas.setWidth(canvas.getWidth() * (1 / canvasScale));
  //   canvas.forEachObject(function(obj) {
  //     obj.set({
  //       scaleX: obj.scaleX * (1 / canvasScale),
  //       scaleY: obj.scaleY * (1 / canvasScale),
  //       left: obj.left * (1 / canvasScale),
  //       top: obj.top * (1 / canvasScale)
  //     }).setCoords();
  //   });
  //   canvas.renderAll();
  //   canvasScale = 1;
  // };

  global.CalibrationBox = CalibrationBox;
})(fabric)
