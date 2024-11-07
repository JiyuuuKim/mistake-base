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
      $W("i$card_",undefined, { multiple: true, like: true }).forEach(function (card) {
         card.local.origin = {
             x : card.get("x"),
             y : card.get("y"),
             w : card.get("w"),
             h : card.get("h"),
             opacity : card.get("opacity"),
         };
      });
    };

    /**
     * @brief Page Run
     */
    var onPageRun = function () {};

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

      target.rotateTo(!target.local.isVisible ? 0 : -45, {
        timing: "linaer 500ms",
      });

      $W("a$click").changeState("Play");
    };

    /**
     * @brief 카드 이전으로
     */
    var onCardPrev = function () {
      var cards = $W("mlc$card");
      var stateNum = cards.get("state").replace("Layer", "");
      var timings = { timing: "linear 100ms" };
      var opacitySettings = [0.2, 1, 0.2, 0.2];
      moveAndResizeCards("prev", stateNum, opacitySettings, timings);
    };

    /**
     * @brief 카드 다음으로
     */
    var onCardNext = function () {
      var cards = $W("mlc$card");
      var stateNum = cards.get("state").replace("Layer", "");
      var timings = { timing: "linear 100ms" };
      var opacitySettings = [0.2, 0.2, 1, 0.2];
      moveAndResizeCards("next", stateNum, opacitySettings, timings);
    };

    /**
     * @brief 카드 이동 및 크기 조정 헬퍼 함수
     * @param {string} direction - 이동 방향 ("prev" 또는 "next")
     * @param {number} stateNum - 현재 상태 번호
     * @param {object} opacitySettings - 각 카드의 불투명도 설정 배열
     * @param {object} timings - 애니메이션 타이밍 설정
     */
    var moveAndResizeCards = function (
      direction,
      stateNum,
      opacitySettings,
      timings
    ) {
      var cards = $W("mlc$card");
      var isNext = direction === "next";

      for (var i = isNext ? 2 : 1; i <= (isNext ? 5 : 4); i++) {
        var mainCard = $W("i$card_" + stateNum + "_" + i);
        var prevCard = $W(
          "i$card_" + stateNum + "_" + (isNext ? i - 1 : i + 1)
        );

        // if ((isNext && i === 4) || (!isNext && i === 2)) {
        //   mainCard.zIndexTo("Top");
        // }

        // Move elements to the position of the previous/next element
        mainCard.moveTo(prevCard.get("x"), prevCard.get("y"), timings);

        // Resize elements to the dimensions of the previous/next element
        mainCard.sizeTo(prevCard.get("w"), prevCard.get("h"), timings);

        // Set opacity with specific values, and add onEnd callback for the last element
        mainCard.opacityTo(opacitySettings[i - (isNext ? 2 : 1)], {
          timing: timings.timing,
          onEnd:
            (isNext && i === 5) || (!isNext && i === 4)
              ? createOnEndCallback(isNext, stateNum, cards)
              : undefined,
        });
      }

      $W("a$click").changeState("Play");
    };

    /**
     * @brief 카드 슬라이드 onEnd 콜백 생성 함수
     * @param {boolean} isNext - 다음으로 이동 여부
     * @param {number} stateNum - 현재 상태 번호
     * @param {object} cards - 카드 객체
     * @returns {function|undefined} - onEnd 콜백 함수 또는 undefined
     */
    var createOnEndCallback = function (isNext, stateNum, cards) {
      return function () {
        var nextState =
          parseInt(stateNum) === (isNext ? 5 : 1)
            ? isNext
              ? 1
              : 5
            : parseInt(stateNum) + (isNext ? 1 : -1);
        cards.changeState("Layer" + nextState);
        $W("i$card_" + stateNum,undefined, { multiple: true, like: true }).forEach(function (card) {
            card.moveTo(card.local.origin.x, card.local.origin.y);
            card.sizeTo(card.local.origin.w, card.local.origin.h);
            card.opacityTo(card.local.origin.opacity);
      });
      };
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
        } else if (label == "i$popup") {
          $W("a$click").changeState("Play");
          $W("mlc$popup").zIndexTo("Top");
          $W("mlc$popup").moveTo(0, 0);
        } else if (label == "i$exit") {
          $W("a$click").changeState("Play");
          $W("mlc$popup").moveTo(1920, 0);
        } else if (label == "ia$prev") {
          onCardPrev();
        } else if (label == "ia$next") {
          onCardNext();
        }
      } else if (Event.type == "Media") {
        if (label == "v$video") {
          if (Event.param == "End") {
            Event.target.changeState("Play");
          }
        }
      }
    }
  }
});
