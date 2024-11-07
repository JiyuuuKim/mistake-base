var popupDir = {
  miniOops: ["R", "R", "R", "R", "L", "L", "L", "L", "L", "L"],
  oops: ["R", "R", "R", "R", "R", "R", "R", "L", "L", "L", "L", "L", "L"],
  megaOops: ["R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
  system: ["L", "L", "R", "R", "R", "L", "R", "R", "L", "L", "R", "R", "L", "R", "R", "R"],
};

apx.addEventListener("pageBubble", function (Event, ctx) {
  with (ctx) {

    /**
     * @brief 페이지 초기화 설정
     */
    var onPageCreate = function () {
      set("$is:playing", false);
      var cursorUrl = "./asset/mouse.png";
      document.body.style.cursor = `url('${cursorUrl}'), auto`;
      $W("", undefined, { multiple: true, like: true }).forEach(function (wgt) {
        if (wgt.get("label").includes("btn")) {
          setTimeout(() => {
            wgt.tag.style.cursor = `url('${cursorUrl}'), auto`;
          }, 1000);
        } else {
          wgt.tag.style.cursor = `url('${cursorUrl}'), auto`;
        }
      });
      $W("Popup", undefined, { multiple: true, like: true }).forEach(function (popup) {
        // [수정] : 팝업 창 크기 변경 (단위 %)
        popup.zoomTo(130, 130);
      });
      if (getQueryParamValue("home") !== null) {
        $W("i$home").set("visibility", "hidden");
      }
    };

    /**
     * @brief 페이지 실행 로직
     */
    var onPageRun = function () {};

    /**
     * @brief 에러 메시지 클릭 이벤트 처리
     */
    var onClickErrorMsg = function () {
      var msg = $W("mlc$errorMsg");
      if (msg.get("visibility") == "hidden") {
        msg.moveTo("", msg.get("y") - 10);
        msg.opacityTo(0);
        msg.opacityTo(1, { timing: "ease-in-out 300ms" });
        msg.moveTo("", msg.get("y") + 10, {
          timing: "ease-in-out 300ms",
          onEnd: function () {
            msg.set("visibility", "visible");
          },
        });
      } else {
        msg.opacityTo(0, { timing: "ease-in-out 300ms" });
        msg.moveTo("", msg.get("y") - 10, {
          timing: "ease-in-out 300ms",
          onEnd: function () {
            msg.set("visibility", "hidden");
            msg.moveTo("", msg.get("y") + 10);
          },
        });
      }
      msg.set("visibility", "visibleEventPass");
      $W("a$click").changeState("Play");
    };

    /**
     * @brief 폴더 클릭 시 팝업 처리
     */
    var onClickFolder = function () {
      onClickBg();
      if (get("$is:playing")) {
        return;
      }
      set("$is:playing", true);

      var target = Event.target;
      var label = target.get("label");
      var popup = $W(label.replace("Folder", "Popup"));
      var title = $W(label.replace("Folder", "Title").replace("mlc", "t"));
      var content = $W(label.replace("Folder", "Content").replace("mlc", "mt"));

      var type = label.replace("Folder", "").replace("mlc$", "").split("_")[0];
      var typeIndex = label.replace("Folder", "").replace("mlc$", "").split("_")[1];
      var flagLR = popupDir[type][typeIndex - 1];

      $W("i$bg").local.playingObjs = {
        folder: target,
        popup: popup,
        title: title,
        content: content,
      };

      target.set("visibility", "visibleEventPass");
      popup.zIndexTo("Top");
      target.zIndexTo("Top");

      // [수정] : 높이 값 위치 변경 (단위 px)
      var topMargin = type !== "system" ? -32 : 50;

      if (flagLR == "R") {
        popup.moveTo(target.get("x"), target.get("y") + topMargin);
      } else {
        popup.moveTo(target.get("x") - popup.get("w") + target.get("w"), target.get("y") + topMargin);
      }

      target.zoomTo(120, 120, {
        timing: "ease-in-out 500ms",
        onEnd: function () {
          // [수정] : 팝업창 간 간격 값 변경 (단위 px)
          popup.moveTo(target.get("x") + (flagLR == "R" ? 220 : -405), target.get("y") + topMargin, {
            timing: "linear 500ms",
            onEnd: function () {
              title.moveTo("", title.get("y") + 10);
              title.set("visibility", "visible");
              title.moveTo("", title.get("y") - 10, {
                timing: "linear 500ms",
                onEnd: function () {
                  content.moveTo("", content.get("y") + 10);
                  content.set("visibility", "visible");
                  content.moveTo("", content.get("y") - 10, {
                    timing: "linear 500ms",
                    onEnd: function () {
                      content.set("visibility", "visible");
                      set("$is:playing", false);
                    },
                  });
                },
              });
            },
          });
          popup.set("visibility", "visible");
        },
      });
      $W("a$click").changeState("Play");
    };

    /**
     * @brief 배경 클릭 시 이벤트 처리
     */
    var onClickBg = function () {
      var target = $W("i$bg");
      if (get("$is:playing") || !target.local.playingObjs || Object.keys(target.local.playingObjs).length === 0) {
        return;
      }

      var playingObjs = target.local.playingObjs;
      playingObjs.folder.set("visibility", "visible");
      playingObjs.folder.zoomTo(100, 100);
      playingObjs.popup.set("visibility", "hidden");
      playingObjs.title.set("visibility", "hidden");
      playingObjs.content.set("visibility", "hidden");
      playingObjs = {};
    };

    /**
     * @brief 스크롤 이벤트 처리
     */
    var onScrollEvent = function () {
      var scrollY = Event.target.getData("scrollY");
      if (scrollY >= 800 && scrollY <= 900) {
        var tape2 = $W("sa$tape_2");
        if (tape2.get("state") == "Stop") {
          tape2.changeState("Play");
        }
      } else if (scrollY >= 2100 && scrollY <= 2200) {
        var tape3 = $W("sa$tape_3");
        if (tape3.get("state") == "Stop") {
          tape3.changeState("Play");
        }
      }
    };

    /**
     * @brief URL 쿼리 파라미터값 가져오기
     * @param {string} paramName - 파라미터 이름
     * @returns {string|null} 파라미터 값
     */
    var getQueryParamValue = function (paramName) {
      const params = new URLSearchParams(window.location.search);
      return params.get(paramName);
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
        if (label == "i$errorMsg") {
          onClickErrorMsg();
        } else if (label.includes("Folder_")) {
          onClickFolder();
        } else if (label == "i$bg") {
          onClickBg();
        } else if (label == "i$home") {
          window.location.href = "../main/index.html";
        }
      } else if (Event.type == "Widget Event") {
        if (label == "sa$scroll") {
          onScrollEvent();
        }
      }
    }
  }
});
