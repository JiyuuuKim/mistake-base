var popupDir = {
    miniOops : ["R","R","R","R","L","L","L","L","L","L"],
    oops : ["R","R","R","R","R","R","R","L","L","L","L","L","L"],
    megaOops : ["R","R","R","R","R","R","R","R","R","R","L","L","L","L","L","L","L","L","L","L"],
    system : ["L","L","R","R","R","L","R","R","L","L","R","R","L","R","R","R"]
};

apx.addEventListener(
  "pageBubble",
  function (Event, ctx) {
    with (ctx) {
        
      /**
       * @brief Page Create
       */
      var onPageCreate = function () {
        set("$is:playing",false);
      };

      /**
       * @brief Page Run
       */
      var onPageRun = function () {
          
      };
    
      // 에러 메시지 클릭 시
      var onClickErrorMsg = function () {
        var msg = $W("mlc$errorMsg");
        if( msg.get("visibility") == "hidden" ) {
            msg.moveTo("", msg.get("y") - 10);    
            msg.opacityTo(0);
            msg.opacityTo(1, { timing : "ease-in-out 300ms"});
            msg.moveTo("", msg.get("y") + 10,{ timing : "ease-in-out 300ms", onEnd: function(){
                msg.set("visibility","visible");    
            }});
        } else {
            msg.opacityTo(0, { timing : "ease-in-out 300ms"});
            msg.moveTo("", msg.get("y") - 10,{ timing : "ease-in-out 300ms", onEnd: function(){
                msg.set("visibility","hidden");    
                msg.moveTo("", msg.get("y") + 10); 
            }}); 
        }
        msg.set("visibility","visibleEventPass");
      };

      // 핑크색 파일 클릭 시
      var onClickFolder = function () {
          
          onClickBg();
          if( get("$is:playing") ) {
              return;
          }
          set("$is:playing",true);
          
          var target = Event.target;
          var label = target.get("label");
          var popup = $W(label.replace("Folder","Popup"));
          var title = $W(label.replace("Folder","Title").replace("mlc","t"));
          var content = $W(label.replace("Folder","Content").replace("mlc","mt"));
          
          var type = label.replace("Folder","").replace("mlc$","").split("_")[0];
          var typeIndex = label.replace("Folder","").replace("mlc$","").split("_")[1];
          var flagLR = popupDir[type][typeIndex-1];
          
          $W("i$bg").local.playingObjs = {
              folder : target,
              popup : popup,
              title : title,
              content : content
          };
          
          target.set("visibility","visibleEventPass");
          popup.zIndexTo("Top");
          target.zIndexTo("Top");
          
          var topMargin = type !== "system" ? -88 : 6;
          
          // 좌
          if( flagLR == "R" ) {
            popup.moveTo(target.get("x"),target.get("y") + topMargin);
          }
          else {
            popup.moveTo(target.get("x") - popup.get("w") + target.get("w"),target.get("y") + topMargin);    
                
          }
          
          target.zoomTo(120, 120,{timing:"ease-in-out 500ms", onEnd:function(){
            popup.moveTo(target.get("x") + (flagLR == "R" ? 170 : - 355) , target.get("y") + topMargin,{timing : "linear 500ms", onEnd :function(){
                // 타이틀 보여짐
                title.moveTo("", title.get("y") + 10);    
                title.set("visibility","visible");
                title.moveTo("", title.get("y") - 10,{ timing : "linear 500ms", onEnd: function(){
                     // 내용 보여짐
                    content.moveTo("", content.get("y") + 10);    
                    content.set("visibility","visible");
                    content.moveTo("", content.get("y") - 10,{ timing : "linear 500ms", onEnd: function(){
                        content.set("visibility","visible");
                        set("$is:playing",false);
                    }});
                }});
            }});
            popup.set("visibility","visible");
          }});
      };

      // 배경 클릭
      var onClickBg = function () {
          var target = $W("i$bg");
          if( get("$is:playing") || !target.local.playingObjs || Object.keys(target.local.playingObjs).length === 0 ) {
              return;
          }
          
          var playingObjs = target.local.playingObjs;
          playingObjs.folder.set("visibility","visible");
          playingObjs.folder.zoomTo(100, 100);
          playingObjs.popup.set("visibility","hidden");
          playingObjs.title.set("visibility","hidden");
          playingObjs.content.set("visibility","hidden");
          playingObjs = {};
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
          } else if(label.indexOf("Folder_") > -1 ) {
            onClickFolder();
          } else if(label == "i$bg") {
            onClickBg();
          } else if(label == "i$home") {
            window.location.href = "../main/index.html";
          }
        }
      }
    }
  }
);
