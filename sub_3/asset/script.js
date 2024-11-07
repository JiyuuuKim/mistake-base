apx.addEventListener("pageBubble", function (Event, ctx) {
  with (ctx) {
    /**
     * @brief Page Create
     */
    var onPageCreate = function () {
      var cursorUrl = "./asset/mouse.png";
      document.body.style.cursor = "url('" + cursorUrl + "'), auto";
      $W("", undefined, { multiple: true, like: true }).forEach(function (wgt) {
        if (wgt.get("label").indexOf("b$") > -1) {
          setTimeout(function () {
            wgt.tag.style.cursor = "url('" + cursorUrl + "'), auto";
          }, 100);
        } else {
          wgt.tag.style.cursor = "url('" + cursorUrl + "'), auto";
        }
      });
      set("$cursor:url", cursorUrl);
    };

    /**
     * @brief Page Run
     */
    var onPageRun = function () {};

    /**
     * @brief 카드 숫자 클릭 시
     */
    var onClickTab = function () {
      var target = Event.target;
      $W("mlc$card").changeState("Layer" + target.get("label").split("_")[1]);
      $W("a$click").changeState("Play");
    };

    /**
     * @brief 메뉴 네비게이션 시
     */
    var onClickMenuNav = function () {
      var target = Event.target;
      var targetNum = target.get("label").split("_")[1];
      window.location.href = "../sub_" + targetNum + "/index.html";
    };

    /**
     * @brief 메뉴 버튼 클릭 시
     */
    var onClickMenu = function () {
      var target = Event.target;
      var menu = $W("mlc$menu");

      target.local.isVisible = !target.local.isVisible;

      target.set("visibility", "visibleEventPass");

      menu.moveTo("", !target.local.isVisible ? -1080 : 0, {
        timing: "linear 500ms",
        onEnd: function () {
          target.set("visibility", "visible");
          target.tag.style.cursor = "url('" + get("$cursor:url") + "'), auto";
        },
      });
      target.rotateTo(!target.local.isVisible ? 0 : -45, {timing:"linear 500ms"});
      $W("a$click").changeState("Play");
    };

    if (!Event.target) {
      if (Event.type === "Page Create") {
        onPageCreate();
      } else if (Event.type === "Page Run") {
        onPageRun();
      }
    } else {
      var label = Event.target.get("label");
      if (Event.type == "Tap") {
        if (label.indexOf("ia$tab_") > -1) {
          onClickTab();
        } else if (label.indexOf("b$menuNav_") > -1) {
          onClickMenuNav();
        } else if (label == "b$menu") {
          onClickMenu();
        } else if (label == "ia$home") {
          window.location.href = "../main/index.html";
        } else if(label == "i$popup") {
          $W("mlc$popup").zIndexTo("Top");
          $W("mlc$popup").moveTo(0,0);
          $W("a$click").changeState("Play");
        } else if(label == "i$exit") {
          $W("mlc$popup").moveTo(1920,0);
          $W("a$click").changeState("Play");
        }
      } else if(Event.type == "Media") {
        if(label == "v$video") {
            if(Event.param == "End") {
                Event.target.changeState("Play");
            }
        }
      }
    }
  }
});
