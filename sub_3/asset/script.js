apx.addEventListener("pageBubble", function (Event, ctx) {
  with (ctx) {
    /**
     * @brief Page Create
     */
    var onPageCreate = function () {};

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
        
        menu.moveTo("", !target.local.isVisible ? -1080 : 0, {timing:"linear 500ms",onEnd:function(){
            target.set("visibility", "visible");
        }});
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
        }
      }
    }
  }
});
