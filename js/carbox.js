(function() {
  var lang = {
      success: "操作成功",
      fail: "未选中标定框",
      error: "错误"
    },
    message = document.querySelector(".message");

  function observe(element, eventName, callback) {
    document.querySelector(element).addEventListener(eventName, callback, false);
  }

  // 配置所有标定框样式。
  var calibrationbox = new CalibrationBox('myCanvas', '/assets/car-bbox.jpg');

  // 对 CalibrationBox 实例方法 create()/delete()/clear() 的调用
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
    var flag = calibrationbox.moveTo('left', -1);
    if (!flag) {
      message.innerHTML = lang["fail"];
    }
  });
  observe("#right", 'click', function() {
    var flag = calibrationbox.moveTo('left', 1);
    if (!flag) {
      message.innerHTML = lang["fail"];
    }
  });
  observe("#up", 'click', function() {
    var flag = calibrationbox.moveTo('top', -1);
    if (!flag) {
      message.innerHTML = lang["fail"];
    }
  });
  observe("#down", 'click', function() {
    var flag = calibrationbox.moveTo('top', 1);
    if (!flag) {
      message.innerHTML = lang["fail"];
    }
  });

  key('left', function() {
    var flag = calibrationbox.moveTo('left', -1);
    if (!flag) {
      message.innerHTML = lang["fail"];
    }
  });
  key('right', function() {
    var flag = calibrationbox.moveTo('left', 1);
    if (!flag) {
      message.innerHTML = lang["fail"];
    }
  });
  key('up', function() {
    var flag = calibrationbox.moveTo('top', -1);
    if (!flag) {
      message.innerHTML = lang["fail"];
    }
  });
  key('down', function() {
    var flag = calibrationbox.moveTo('top', 1);
    if (!flag) {
      message.innerHTML = lang["fail"];
    }
  });

  // Todo:
  // observe("#resetButton", "click", function() {
  //   calibrationbox.resetZoom();
  // });

  /*
   * 高级功能，供扩展适用
   */
  var canvas = calibrationbox.getCanvas();
  // Note:
  // 1.已内置 mouse:down mouse:up 创建标定框
  // var handleScroll = function(evt) {
  //   var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
  //   if (delta) {
  //     calibrationbox.zoom(delta, evt);
  //   };
  //   return evt.preventDefault() && false;
  // };
  // observe(".upper-canvas", 'DOMMouseScroll', handleScroll);
  // observe(".upper-canvas", 'mousewheel', handleScroll);
})();
