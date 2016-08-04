(function() {
  var lang = {
      success: "操作成功",
      fail: "未选中标定框",
      error: "错误"
    },
    message = document.querySelector(".message");

  var scope = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  };

  function observe(element, eventName, callback) {
    document.querySelector(element).addEventListener(eventName, callback, false);
  }

  // 配置所有标定框样式。
  var calibrationbox = new CalibrationBox('myCanvas', {
    strokeStyle: '#0f0',
    lineWidth: 5
  });

  // 对 CalibrationBox 实例方法的 create()/delete()/clear() 的调用
  observe("#create", 'click', function() {
    calibrationbox.create();
  });
  observe("#delete", 'click', function() {
    var flag = calibrationbox.delete();
    message.innerHTML = lang[(flag && "success" || "fail")];
  });
  observe("#clear", 'click', function() {
    calibrationbox.clear();
  });
  observe("#save", 'click', function() {
    var result = calibrationbox.save();
    console.log(result);
  });

  key('ctrl + c', function() {
    calibrationbox.create();
  });
  key('del, delete, backspace', function() {
    var flag = calibrationbox.delete();
    message.innerHTML = lang[(flag && "success" || "fail")];
  });
  key('ctrl + del, ctrl + delete, ctrl + backspace', function() {
    console.log("clear");
    calibrationbox.clear();
  });
  key('ctrl + s', function() {
    var result = calibrationbox.save();
    console.log(result);
  });


  // 位移
  observe("#left", 'click', function() {
    var flag = calibrationbox.moveTo('left', -10);
    message.innerHTML = lang[(flag && "success" || "fail")];
  });
  observe("#right", 'click', function() {
    var flag = calibrationbox.moveTo('left', 10);
    message.innerHTML = lang[(flag && "success" || "fail")];
  });
  observe("#up", 'click', function() {
    var flag = calibrationbox.moveTo('top', -10);
    message.innerHTML = lang[(flag && "success" || "fail")];
  });
  observe("#down", 'click', function() {
    var flag = calibrationbox.moveTo('top', 10);
    message.innerHTML = lang[(flag && "success" || "fail")];
  });

  key('left', function() {
    var flag = calibrationbox.moveTo('left', -10);
    message.innerHTML = lang[(flag && "success" || "fail")];
  });
  key('right', function() {
    var flag = calibrationbox.moveTo('left', 10);
    message.innerHTML = lang[(flag && "success" || "fail")];
  });
  key('up', function() {
    var flag = calibrationbox.moveTo('top', -10);
    message.innerHTML = lang[(flag && "success" || "fail")];
  });
  key('down', function() {
    var flag = calibrationbox.moveTo('top', 10);
    message.innerHTML = lang[(flag && "success" || "fail")];
  });

  // Todo:
  // observe("#zoomOut", "click", function() {
  //   calibrationbox.ZoomOut();
  // });
  //
  // observe("#zoomIn", "click", function() {
  //   calibrationbox.ZoomIn();
  // });
  //
  // observe("#resetButton", "click", function() {
  //   calibrationbox.resetZoom();
  // });

  /*
   * 高级功能，供扩展适用
   */
  var canvas = calibrationbox.getCanvas();

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
      calibrationbox.create(scope);
    }
  });
})();
