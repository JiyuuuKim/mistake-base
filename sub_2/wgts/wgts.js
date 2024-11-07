////////////////////////////////////////////////////////////////////////////////
// edu.wgt.animSprite
/*
	Widget 자체는 'apn.wgt.layerContainer'를 Inherit한 것이며
		- stateChange Event 제거
		- Editing 화면 설정
	을 위해서 Class 분리된 것임
*/

var xa = apn.inheritWidget(apn.widgets['apn.wgt.layerContainer']);
//xa.BLACKBOX_MODEL = true; // Off at 2017/12

xa.editor = xa.editor || {};
xa.editor.iconThumb = 'DB/EDU/imgs/wgts/thumbs/spriteAnimation.png';
xa.editor.states = {play:'Play', loop:'Loop', stop:'Stop'};

xa.scriptInfo = undefined;

xa.properties.state = 'stop';
xa.properties.attrs = {
	apxAnimate:true, cfg:{idStep:''}
}

xa.createAsCanvasObject = function(/*Object*/prj, /*Object*/position, /*Object*/size, /*Object|undefined*/styles, /*Object|undefined*/property)/*Object*/
{
	return apn.IWidget.createCanvasObject(prj, apn.widgets['apn.wgt.layerContainer'], 'apn.CLayerContainer', bx.CCanvasWnd.SHAPE_RECT, position, size, styles, property, {orderedActive:true});
}

xa.exeFireStateEvent = undefined;

xa.exeSetState = function(apx, tag, /*String*/state)
{
	if (state){
		if (state == 'play' || state == 'loop'){
			if (apx.wgtAniCheck(apx.wgtId(tag)) > 1){
				if (apx.wgtAniRun(apx.wgtId(tag), state == 'play' ? 1 : 2)){ // Run(Play) or Loop
					apx.fireEvent('animation', 'Start', tag.apnOID);
				}
			}
		}
		else if (state == 'stop'){
			apx.wgtAniSet(apx.wgtId(tag));
			//apx.fireEvent('animation', 'End', tag.apnOID); // wgtAniSet()에서 Animation 실행 중이면 발생시킴
		}
	}
}

xa.exeOnLoad = function(apx, oId)
{
	//	apxStep I/F
	//	'Slide Area' 위젯을 참조함. 같은 구조이면서 반대 I/F임
	var cfg = apx.wgtGetProperty(oId, 'cfg');

	if (cfg && cfg.idStep && apx.wgtTag(cfg.idStep)){
		function onApxStep(changeWgtId, value)
		{
			if (changeWgtId == cfg.idStep && value){
				var layers = apn.Project.getStateByObjectID(apx.viewer.project, apx.getPageID(), oId);

				if (layers){
					apn.UTIL.sort(layers, 'order', 1, true);

					if (layers[value.current] && layers[value.current].stateID) apx.wgtSetProperty(oId, 'apxLayer', layers[value.current].stateID);
				}
			}
		}
		apx.wgtListenProperty(oId, 'apxStep', onApxStep);
	}
}

//	%%INFO ux.wgt.imgSprite 참조
xa.edtSetupStep = function(apd, oId, tagDlg, cfg)
{
	var page = apd.getScreenData();
	var steps = [{title:apn.CExe.GL({ko:'[없음]',en:'[None]',ja:'[なし]'}), value:''}];

	for(var i in page.objects){
		if (page.objects[i].create && page.objects[i].create.data && page.objects[i].create.data.properties && page.objects[i].create.data.properties.attrs && page.objects[i].create.data.properties.attrs.apxStep){
			steps.push({value:i, title:apd.itrGetObjectTitle(i)});
		}
	}

	eduLib.edtInputAdd(apd, tagDlg, {type:'select', options:steps, title:apn.CExe.GL({ko:'연동할 위젯',en:'Widget to interface with',ja:'連動するウィジェット'}), key:'idStep', value:cfg, join:true});
}


xa.edtOnConfig = function(apd, objID)
{
	var cfg = apd.wgtGetProperty(objID, 'cfg') || {idStep:''};
	var tagDlg;

	function onOK()
	{
		eduLib.edtInputApplyAll(apd, tagDlg);

		apd.wgtSetProperty(objID, 'cfg', cfg);
	}

	if (tagDlg = apd.dlgDoModal(600, 200, onOK)){
		//	Step
		var cssTabDlg = apn.CExe.CSS_SETUP_PANE+'height:'+(tagDlg.clientHeight-40)+'px';

		tagDlg.tagTab = tagDlg.$TAG('div', {style:'position:relative;font-weight:bold;width:100%;height:26px;padding-bottom:14px;'}); //26+14
		tagDlg.tagTab.innerHTML = '<span id="tagTab2" style="'+apn.CExe.CSS_SETUP_TAB+'">'+apn.CExe.GL({ko:'스텝 연동',en:'Step Interface',ja:'ステップ連動'})+'</span>'+apn.CExe.CSS_SETUP_TAB_END;

		//	Step I/F
		tagDlg.tagTab2 = tagDlg.$TAG('div', {style:cssTabDlg});

		this.edtSetupStep(apd, objID, tagDlg.tagTab2, cfg);

		tagDlg.tagTab.$$('tagTab2').style.borderStyle = 'solid solid none solid';
		tagDlg.tagTab.$$('tagBlank').style.width = (tagDlg.clientWidth - tagDlg.tagTab.$$('tagBlank').offsetLeft - 1)+'px';
	}
}

xa.WGTS_SHOW = [
	'edu.wgt.animSprite'
	,'apn.wgt.rect', 'apn.wgt.singleText', 'apn.wgt.roundRect', 'apn.wgt.ellipse', 'apn.wgt.line', 'apn.wgt.image2', 'apn.wgt.polygon'
	,'apn.wgt.video', 'apn.wgt.itrAreaRect', 'apn.wgt.itrAreaEllipse'
	,'ux.wgt.imgSprite', 'ux.wgt.shtSprite'
];

xa.onEdit = function(/*CEditor*/editor, objID)
{
	apn.widgets.utils.editWidget(editor.getObjectByID(objID), editor, 2, true, {wgtsShow:this.WGTS_SHOW, layerTitleFromOrder:true, layerDuration:apx.wgt.spriteDefaultFrameDuration, layerOrdering:true, layerScrollbar:'always'});
}
eduWgtAnimSprite = xa;

////////////////////////////////////////////////////////////////////////////////
// edu.wgt.animScene

xa = apn.inheritWidget(apn.widgets['apn.wgt.sceneContainer']);
//xa.BLACKBOX_MODEL = true; // Off at 2017/12
xa.exeItrNoResize = true;

xa.editor = xa.editor || {};
xa.editor.iconThumb = 'DB/EDU/imgs/wgts/thumbs/sceneAnimation.png';
xa.editor.states = {play:'Play', loop:'Loop', stop:'Stop', stopL:'StopAtLast'};

xa.properties.state = 'stop';
xa.properties.attrs = {
	apxAnimate:true, ver:2, ofl:''
}

xa.exeSetState = function(apx, tag, /*String*/state, prvState)
{
	if (state){
		//	최초에 stopL인 상태는 논리적으로 맞지 않고, 현재 잘 동작하지도 않음. 2018/07
		if (!prvState && state == 'stopL') state = 'stop';

		if (state == 'stopL'){
			function orderByOrder(a, b)
			{
				// undefined이면 뒤로 보냄
				if (a.order === undefined && b.order === undefined) return 0;
				else if (a.order === undefined) return 1;
				else if (b.order === undefined) return -1;
				else return a.order - b.order;
			}

			//	마지막 Frame을 실행함
			var frms = apn.Project.getStateByObjectID(apx.project, apx.getPageID(), tag.apnOID);

			if (frms && frms.length > 0){
				frms.sort(orderByOrder);

				apx.wgtAniSet(apx.wgtId(tag), undefined, frms[frms.length-1].title);
			}
		}
		else{
			eduWgtAnimSprite.exeSetState.call(this, apx, tag, /*String*/state);
		}
	}
}

xa.exeOnLoad = eduWgtAnimSprite.exeOnLoad;

xa.onEdit = function(/*CEditor*/editor, objID)
{
	apn.widgets.utils.editWidget(editor.getObjectByID(objID), editor, 1, true, {layerTitleFromOrder:true, layerDuration:apx.wgt.spriteDefaultFrameDuration, layerOrdering:true, layerScrollbar:'always', wgtsShow:apn.widgets['apn.wgt.sceneContainer'].WGTS_SHOW, editNoGroup:true});
}
eduWgtAnimScene = xa;

////////////////////////////////////////////////////////////////////////////////
// edu.wgt.animHolder %%OLD
// -> edu.wgt.animHolder2가 새버전임. 기존 컨텐츠 보호 목적으로 기존 버전 유지함.

xa = apn.inheritWidget(apn.widgets['apn.wgt.layerContainer']);

xa.editor = xa.editor || {};
xa.editor.iconThumb = 'DB/EDU/imgs/wgts/common/icon_thumb.png';

xa.properties.attrs = {
	apxAnimateHolder:true // Animation을 Holde하고 가속 기능을 제공하는 Container임을 표시함
}

xa.exeSetState = undefined;

xa.onEdit = function(/*CEditor*/editor, objID)
{
	apn.widgets.utils.editWidget(editor.getObjectByID(objID), editor, 2, true, {layerTitlePrefix:'State', layerScrollbar:'always'});
}
eduWgtAnimHolder = xa;

////////////////////////////////////////////////////////////////////////////////
// edu.wgt.animHolder2 : edu.wgt.animHolder
/*
	여러 Animation 상태를 가지는 (예를 들면 게임) Charactor를 제어하기 위한 것임
	현재 Active한 Layer에 속한 모든 Animation은 'Loop'상태가 되고, Deactive한 Layer에 속한 것들을 'Stop'상태가 됨
	(따라서, 만약, 정지 상태를 표시하고 싶으면, Animation이 아닌 정지 Image로 구성된 Layer를 편집하면 됨)

	%%INFO 이 위젯은 Animation memory optimize 기능이 있으므로 가능하면 이 위젯을 사용해야 함.
*/

xa = apn.inheritWidget(eduWgtAnimHolder);

xa.editor = xa.editor || {};
xa.editor.iconThumb = 'DB/EDU/imgs/wgts/thumbs/sceneAnimation.png';

xa.properties.attrs = {
	apxAnimateHolder:true // Animation을 Holde하고 가속 기능을 제공하는 Container임을 표시함
}

xa.exeSetState = function(apx, tag, /*String*/stateID, /*String|undefined*/prvStateID)
{
	var layers = apx.screen.objects[tag.apnOID].layout.layers;

	//%%INFO 비활성 Layer에 있는 Animation를 Stop함. 활성의 경우, Loop상태로
	var ids, j;

	for(i in layers){
		ids = apx.getWidgetsByProperty('apxAnimate', layers[i].id);

		for(j = 0; j < ids.length; j ++){
			if (i != stateID){
				apx.wgtSetProperty(ids[j], 'apxState', 'stop');
			}
			else{
				apx.wgtSetProperty(ids[j], 'apxState', 'loop');
			}
		}
	}

	// State Event
	if (stateID != prvStateID) apx.fireEvent('stateChange', stateID, tag.apnOID);
}

xa.exeOnStart = function(apx, oId)
{
	var _this = this;

	//%%INFO 한 위젯에 대해서, InitState -> onStart가 차례로 호출이 되므로, 이 과정 후에 State를 바꿔야 하므로 setTimeout을 사용함
	setTimeout(function(){
		_this.exeSetState(apx, apx.wgtTag(oId), apx.stateGetActive(oId));
	},0);
}

eduWgtAnimHolder2 = xa;

