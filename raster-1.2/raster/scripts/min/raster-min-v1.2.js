/******************************************************************************
 * This file is part of the Raster UI Library.
 * http://www.lopezworks.info/raster
 *
 * Copyright (C) 2010 Edwin R. Lopez
 *
 * This source code is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation LGPL v2.1
 * (http://www.gnu.org/licenses/).
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301  USA.
 *****************************************************************************/

 
var RasterStrings={toString:function(arg,sep)
{if(arg==null||typeof(arg)!="object")
return arg+"";else if(arg.tagName)
return"["+arg.tagName+" element]";else if(arg.altKey!=null&&arg.shiftKey!=null)
return"["+arg.type+" event]";else if(arg.IID_CONTROL)
return"[RasterControl object]";sep=sep==null?",\r\n":sep;var buf=new Array();var isArray=Raster.isArray(arg);for(var i in arg)
{var propName=isArray?"":i+": ";if(typeof(arg[i])=="object")
buf.push(propName+RasterStrings.toString(arg[i],sep.replace(/\n/g,"\n    ")));else if(typeof(arg[i])=="string")
buf.push(propName+"\""+arg[i]+"\"");else if(typeof(arg[i])!="function")
buf.push(propName+arg[i]);}
if(isArray)
return"[ "+buf.join(sep)+" ]";else
return"{ "+buf.join(sep)+" }";},trim:function(text)
{if(text==null)
return"";text+="";return text.replace(/(^ +| +$)/g,"");},isEmpty:function(text)
{return this.trim(text)=="";},formatDate:function(date)
{if(date==null)
return"";else if(typeof(date)=="object"&&date.getFullYear)
return((date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1))+"/"+
(date.getDate()<10?"0"+date.getDate():date.getDate())+"/"+
date.getFullYear();else
return date;}};var Raster={isIE:navigator.userAgent.indexOf('MSIE')>=0,isIE6:navigator.appVersion.indexOf("MSIE 6")>=0,isIE7:navigator.appVersion.indexOf("MSIE 7")>=0,isIE8:navigator.appVersion.indexOf("MSIE 8")>=0,isIE9:navigator.appVersion.indexOf("MSIE 9")>=0,isIE10:navigator.appVersion.indexOf("MSIE 10")>=0,isCSSCompliant:navigator.appVersion.indexOf("MSIE 6")<0&&navigator.appVersion.indexOf("MSIE 7")<0&&navigator.appVersion.indexOf("MSIE 8")<0,isIEQuirks:navigator.userAgent.indexOf('MSIE')>=0&&/^<!DOCTYPE.*/i.test(document.all[0].data),isFF:navigator.userAgent.indexOf("Firefox")>=0||navigator.userAgent.indexOf("Mozilla")>=0||navigator.userAgent.indexOf("Gecko")>=0,isOp:navigator.userAgent.indexOf("Opera")>=0,isArray:function(x)
{return x&&!x.propertyIsEnumerable('length')&&typeof(x)=='object'&&typeof(x.length)=='number';},toRect:function(x1,y1,x2,y2)
{return{x:Math.min(x1,x2),y:Math.min(y1,y2),width:Math.abs(x1-x2),height:Math.abs(y1-y2)};},clip:function(value,min,max)
{return Math.max(min,Math.min(value,max));},disableDocumentSelections:function()
{if(Raster.isIE)
{Raster.addListener(document,"selectstart",function(event)
{return"SELECT,INPUT,TEXTAREA".indexOf(window.event.srcElement.tagName)>=0;});}
else
Raster.addClass(document.body,"rasterUnselectable");},setCookie:function(name,value,expireDays)
{var exdate=new Date();exdate.setDate(exdate.getDate()+expireDays);document.cookie=name+"="+escape(value)+((expireDays==null)?"":";expires="+exdate.toUTCString());},getCookie:function(name)
{if(document.cookie.length>0)
{var start=document.cookie.indexOf(name+"=");if(start!=-1)
{start=start+name.length+1;var end=document.cookie.indexOf(";",start);if(end==-1)
end=document.cookie.length;return unescape(document.cookie.substring(start,end));}}
return null;},deleteCookie:function(name)
{document.cookie=name+"=0;expires=Thu, 03-Mar-1972 00:00:01 GMT";},implementIID:function(subClass,superClass)
{if(subClass==superClass||Raster.implementsIID(subClass,superClass))
return;for(var prop in superClass.prototype)
if(/^IID_.*/.test(prop)||(typeof(superClass.prototype[prop])=="function"&&(subClass.prototype[prop]==null||prop==="toString")))
subClass.prototype[prop]=superClass.prototype[prop];subClass[superClass]=true;},implementsIID:function(subClass,superClass)
{return subClass[superClass]===true;},setParent:function(element,parent,replace)
{element=Raster.resolve(element);parent=Raster.resolve(parent);if(replace===true)
while(parent.firstChild!=null)
parent.removeChild(parent.firstChild);if(element.parentNode!=null)
element.parentNode.removeChild(element);parent.appendChild(element);},setSibling:function(element,sibling,after)
{element=Raster.resolve(element);sibling=Raster.resolve(sibling);if(element.parentNode!=null)
element.parentNode.removeChild(element);if(after===true)
{if(sibling.nextSibling!=null)
sibling.parentNode.insertBefore(element,sibling.nextSibling);else
sibling.parentNode.appendChild(element);}
else
sibling.parentNode.insertBefore(element,sibling);},resolve:function(element)
{if(element.IID_CONTROL!=null)
return element.getContentElement();else if(typeof(element)=="string")
return document.getElementById(element);return element;},fixPointIE:function(_x,_y)
{if(Raster.isIEQuirks)
{_x-=document.body.clientLeft;_y-=document.body.clientTop;}
else if(Raster.isIE7)
{_x-=document.documentElement.clientLeft||2;_y-=document.documentElement.clientTop||2;}
else if(Raster.isIE6)
{_x-=document.documentElement.clientLeft;_y-=document.documentElement.clientTop;}
return{x:_x,y:_y};},getBounds:function(element,relParent)
{var rect=element.getBoundingClientRect();var dx=rect.left;var dy=rect.top;if(relParent!=null)
{var rect2=relParent.getBoundingClientRect();dx-=rect2.left;dy-=rect2.top;}
var scroll=Raster.getElementScrolling(document.body);dx+=scroll.x;dy+=scroll.y;if(Raster.isIE)
{var fixed=Raster.fixPointIE(dx,dy);dx=fixed.x;dy=fixed.y;}
return{x:dx,y:dy,width:Math.round(element.offsetWidth),height:Math.round(element.offsetHeight)};},getElementScrolling:function(element)
{var dx=0;var dy=0;do
{dx+=element.scrollLeft||0;dy+=element.scrollTop||0;}while(element=element.parentNode)
return{x:dx,y:dy};},pointToElement:function(element,pageX,pageY)
{if(element==document.body)
return{x:pageX,y:pageY};var bounds=Raster.getBounds(element);return{x:pageX-bounds.x,y:pageY-bounds.y};},pointToPage:function(element,elementX,elementY)
{var bounds=Raster.getBounds(element);var scroll=Raster.getElementScrolling(element);return{x:elementX+bounds.x-scroll.x,y:elementY+bounds.y-scroll.y};},getWindowBounds:function()
{if(Raster.isIE)
{if(Raster.isIEQuirks)
return{width:document.body.clientWidth,height:document.body.clientHeight};else
return{width:document.body.parentNode.clientWidth,height:document.body.parentNode.clientHeight};}
else
return{width:window.innerWidth,height:window.innerHeight};},findParentWithClass:function(element,className)
{if(element==null)
return null;do{if(Raster.hasClass(element,className))
return element;element=element.parentNode;}while(element!=null);return null;},findParentWithExpando:function(element,expandoName)
{if(element==null)
return null;do{if(element[expandoName]!=null)
return element;element=element.parentNode;}while(element!=null);return null;},findParentExpando:function(element,expandoName,all)
{if(element==null)
return null;var matches=(all===true)?new Array():null;do{if(element[expandoName]!=null)
if(matches==null)
return element[expandoName];else
matches.push(element[expandoName]);element=element.parentNode;}while(element!=null);return matches;},findParentWithAttr:function(element,attrName)
{if(element==null)
return null;do{if(element.getAttribute!=null&&element.getAttribute(attrName)!=null)
return element;element=element.parentNode;}while(element!=null);return null;},indexOf:function(element)
{if(element==null)
return-1;var n=0;while((element=element.previousSibling)!=null)
n++;return n;},repaint:function(element)
{var save=element.style.display;element.style.display="none";element.offsetHeight+0;element.style.display=save;},setOpacity:function(element,percent)
{if(Raster.isIE6||Raster.isIE7)
element.style.filter=percent==100?"":"alpha(opacity="+percent+")";else if(Raster.isIE8)
element.style.filter=percent==100?"":"progid:DXImageTransform.Microsoft.Alpha(opacity="+percent+")";else
element.style.opacity=percent/100;},hasClass:function(element,className)
{return element.className&&element.className.indexOf(className)>=0;},addClass:function(element,className)
{if(element==null)
return;if(element.className!=null)
element.className+=" "+className;else
element.className=className;},removeClass:function(element,className)
{if(element==null||element.className==null)
return;var tokens=element.className.split(" ");var buf=[];for(var k=0;k<tokens.length;k++)
if(tokens[k]!=className)
buf.push(tokens[k]);element.className=buf.join(' ');},addListener:function(element,eventName,eventHandler)
{if(Raster.isIE)
element.attachEvent("on"+eventName,eventHandler);else
element.addEventListener(eventName,eventHandler,false);},removeListener:function(element,eventName,eventHandler)
{if(Raster.isIE)
element.detachEvent("on"+eventName,eventHandler);else
element.removeEventListener(eventName,eventHandler,false);},getInputState:function(event)
{var mouse={};mouse.x=0;mouse.y=0;mouse.ctrl=false;mouse.alt=false;mouse.shift=false;if(window.event)
{mouse.x=window.event.clientX+document.documentElement.scrollLeft+document.body.scrollLeft;mouse.y=window.event.clientY+document.documentElement.scrollTop+document.body.scrollTop;mouse.alt=window.event.altKey;mouse.ctrl=window.event.ctrlKey;mouse.shift=window.event.shiftKey;if(event)
mouse.button=event.button==0?1:(event.button==1?3:2);else
mouse.button=window.event.button==4?3:window.event.button;var fixed=Raster.fixPointIE(mouse.x,mouse.y);mouse.x=fixed.x;mouse.y=fixed.y;}
else
{mouse.x=event.clientX+window.scrollX;mouse.y=event.clientY+window.scrollY;mouse.alt=event.altKey;mouse.ctrl=event.ctrlKey;mouse.shift=event.shiftKey;mouse.button=event.button==0?1:(event.button==1?3:2);}
mouse.asString=mouse.x+", "+mouse.y+"{alt="+mouse.alt+"; ctrl="+mouse.ctrl+"; shift="+mouse.shift+"; button="+mouse.button+"}";return mouse;},keyCode:function(event)
{return Raster.isIE?window.event.keyCode:event.keyCode;},srcElement:function(event)
{return Raster.isIE?window.event.srcElement:event.target;},stopEvent:function(event)
{if(Raster.isIE)
{window.event.cancelBubble=true;window.event.returnValue=false;}
else if(event)
{event.preventDefault();event.stopPropagation();}
return false;},idSequence:0,RASTER_HOME:"raster",THEME:"modern",IMG_URL:"raster/images",CSS_IMG_URL:"raster/themes/modern/images",config:function(RASTER_HOME,theme)
{Raster.THEME=theme||Raster.THEME;Raster.RASTER_HOME=(RASTER_HOME||".").replace(/\/+$/,"");Raster.IMG_URL=Raster.RASTER_HOME+"/images";Raster.CSS_IMG_URL=Raster.RASTER_HOME+"/themes/"+Raster.THEME+"/images";},toImgUrl:function(url)
{if(url==null||url.length<4)
return url;if(url.substring(0,4).toUpperCase()=="IMG:")
return Raster.IMG_URL+"/"+(url.length>4?url.substring(4):"");else if(url.substring(0,4).toUpperCase()=="CSS:")
return Raster.CSS_IMG_URL+"/"+(url.length>4?url.substring(4):"");else
return url;},setActiveMenu:function(menuOrToolbar)
{try
{if(top.rasterActiveMenu!=null&&top.rasterActiveMenu!=menuOrToolbar)
{if(top.rasterActiveMenu.IID_MENU)
top.rasterActiveMenu.hide();else
top.rasterActiveMenu.showItemMenu(null);}
top.rasterActiveMenu=menuOrToolbar;}
catch(e)
{if(Raster.rasterActiveMenu!=null&&rasterActiveMenu!=menuOrToolbar)
{if(Raster.rasterActiveMenu.IID_MENU)
Raster.rasterActiveMenu.hide();else
Raster.rasterActiveMenu.showItemMenu(null);}
Raster.rasterActiveMenu=menuOrToolbar;}
if(menuOrToolbar==null)
Raster.removeClass(document.body,"suspendCommandItemHover");else
Raster.addClass(document.body,"suspendCommandItemHover");},getActiveMenu:function()
{try
{return top.rasterActiveMenu;}
catch(e)
{return Raster.rasterActiveMenu;}},doLayout:function()
{if(window.RasterToolbar)RasterToolbar.doLayout();if(window.RasterTabbar)RasterTabbar.doLayout();if(window.RasterSplitter)RasterSplitter.doLayout();if(window.RasterDialog)RasterDialog.doLayout();if(window.RasterList)RasterList.doLayout();}};Raster.addListener(window,"load",function(event)
{try
{if(Raster.isIE6)
document.execCommand('BackgroundImageCache',false,true);}
catch(e)
{}
if(window.main)
window.main();});Raster.addListener(window,"resize",function(event)
{Raster.setActiveMenu(null);Raster.doLayout();});Raster.addListener(document,"keydown",function(event)
{if(Raster.keyCode(event)!=27)
return;Raster.setActiveMenu(null);RasterMouse.cancelDrag(event);});Raster.addListener(document,"mousedown",function(event)
{Raster.setActiveMenu(null);});if(!window.out)
{window.out=function(o)
{if(window.console)
console.log(typeof(o)=="object"?RasterStrings.toString(o):o);}}
function RasterControl(parent,containerTag)
{this.containerTag=(containerTag||"div").toLowerCase();this.isVisible=true;this.isDisplayable=true;this.isFixed=false;this._x=0;this._y=0;this.controlBox=document.createElement(this.containerTag);this.controlBox.rasterControl=this;this.controlBox.oncontextmenu=Raster.stopEvent;this.dropHandler=null;if(Raster.isIE)
{this.controlBox.ondragstart=Raster.stopEvent;this.controlBox.onselectstart=Raster.stopEvent;}
if(parent!=null)
this.setParent(parent);this.iframeBackground=null;}
RasterControl.prototype.IID_CONTROL=true;RasterControl.prototype.dispose=function()
{if(this.scrollHandler)
Raster.removeListener(window,"scroll",this.scrollHandler);this.scrollHandler=null;this.controlBox.parentNode.removeChild(this.controlBox);this.controlBox.rasterControl=null;this.dropHandler=null;this.controlBox=null;this.iframeBackground=null;};RasterControl.prototype.getContentElement=function()
{return this.controlBox;};RasterControl.prototype.setClass=function(cssClass)
{this.controlBox.className=cssClass;return this;};RasterControl.prototype.setInnerHTML=function(innerHTML)
{this.getContentElement().innerHTML=innerHTML;return this;};RasterControl.prototype.setContent=function(src,replace)
{var contentElement=this.getContentElement();replace=replace==null?true:replace;Raster.setParent(src,contentElement,replace);return this;};RasterControl.prototype.setParent=function(parent,replace)
{Raster.setParent(this.controlBox,parent,replace);return this;};RasterControl.prototype.setSibling=function(sibling,after)
{Raster.setSibling(this.controlBox,sibling,after);return this;};RasterControl.prototype.setSize=function(width,height)
{this.controlBox.style.width=(width!=null)?(typeof(width)=="number"?width+"px":width):"";this.controlBox.style.height=(height!=null)?(typeof(height)=="number"?height+"px":height):"";if(Raster.isOp)
Raster.repaint(this.controlBox);return this;};RasterControl.prototype.moveTo=function(x,y)
{this._x=x;this._y=y;if(Raster.isIEQuirks||Raster.isIE6)
{if(this.isFixed)
{if(this.scrollHandler==null)
{var control=this;this.scrollHandler=function()
{control.controlBox.style.left=(document.documentElement.scrollLeft+document.body.scrollLeft+control._x)+"px";control.controlBox.style.top=(document.documentElement.scrollTop+document.body.scrollTop+control._y)+"px";};Raster.addListener(window,"scroll",this.scrollHandler);}
else
{this.controlBox.style.left=(document.body.scrollLeft+this._x)+"px";this.controlBox.style.top=(document.body.scrollTop+this._y)+"px";}}
else
{if(this.scrollHandler)
Raster.removeListener(window,"scroll",this.scrollHandler);this.scrollHandler=null;this.controlBox.style.left=(x!=null)?x+"px":"";this.controlBox.style.top=(y!=null)?y+"px":"";}}
else
{this.controlBox.style.left=(x!=null)?x+"px":"";this.controlBox.style.top=(y!=null)?y+"px":"";}
return this;};RasterControl.prototype.getBounds=function()
{return Raster.getBounds(this.controlBox);};RasterControl.prototype.setBounds=function(x,y,width,height)
{this.moveTo(x,y);this.setSize(width,height);return this;};RasterControl.prototype.createIE6IframeBackdrop=function(parent)
{if(Raster.isIE6&&this.iframeBackground==null)
{this.iframeBackground=document.createElement("IFRAME");this.iframeBackground.src="javascript: ' '";this.iframeBackground.className="rasterControlIframeBackdrop";(parent||this.controlBox).appendChild(this.iframeBackground);}
return this;};RasterControl.prototype.setDisplay=function(isDisplayable)
{this.isDisplayable=isDisplayable;this.controlBox.style.display=isDisplayable?"":"none";return this;};RasterControl.prototype.setVisible=function(isVisible)
{this.isVisible=isVisible;this.controlBox.style.visibility=isVisible?"":"hidden";return this;};RasterControl.prototype.setOpacity=function(percent)
{Raster.setOpacity(this.controlBox,percent);return this;};RasterControl.prototype.setFixed=function(isFixed)
{this.isFixed=(isFixed===true);if(Raster.isIEQuirks||Raster.isIE6)
this.moveTo(this._x,this._y);else
this.controlBox.style.position=isFixed?"fixed":"";return this;};RasterControl.prototype.setDropHandler=function(dropHandler)
{this.dropHandler=dropHandler;return this;};function RasterEvent()
{this.isCancelled=false;this.acceptPosition=null;}
RasterEvent.prototype.IID_RASTER_EVENT=true;RasterEvent.prototype.cancel=function()
{this.isCancelled=true;};RasterEvent.prototype.accept=function(position)
{this.acceptPosition=position||this.position;};RasterEvent.prototype.toString=function()
{return RasterStrings.toString(this);};var RasterListEvent={};RasterEvent.mkListEvent=function(event,type,list,item,colIdx,index,newColWidth,newColIdx,dataIdx,dragValue,position)
{var e=new RasterEvent();e.event=event;e.type=type;e.list=list;e.item=item;e.colIdx=colIdx;e.index=index;e.newColWidth=newColWidth;e.newColIdx=newColIdx;e.dataIdx=dataIdx;e.dragValue=dragValue;e.position=position;return e;};var RasterTreeEvent={};RasterEvent.mkTreeEvent=function(event,type,tree,item,dragValue,position)
{var e=new RasterEvent();e.event=event;e.type=type;e.tree=tree;e.item=item;e.dragValue=dragValue;e.position=position;return e;};var RasterDialogEvent={};RasterEvent.mkDialogEvent=function(event,type,dialog,bounds)
{var e=new RasterEvent();e.event=event;e.type=type;e.dialog=dialog;e.bounds=bounds;return e;};var RasterTabbarEvent={};RasterEvent.mkTabEvent=function(event,type,tabbar,item,dragValue,position)
{var e=new RasterEvent();e.event=event;e.type=type;e.tabbar=tabbar;e.item=item;e.dragValue=dragValue;e.position=position;return e;};var RasterSplitterEvent={};RasterEvent.mkSplitterEvent=function(event,type,splitter,size)
{var e=new RasterEvent();e.event=event;e.type=type;e.splitter=splitter;e.size=size;return e;};var RasterMouseEvent={};RasterEvent.mkMouseEvent=function(event,type,value,data)
{var e=new RasterEvent();e.event=event;e.type=type;e.value=value;e.data=data;e.control=null;e.context={};e.initial=Raster.getInputState(event);e.x=e.initial.x;e.y=e.initial.y;e.ctrl=e.initial.ctrl;e.alt=e.initial.alt;e.shift=e.initial.shift;e.button=e.initial.button;return e;};function RasterSprite(image,width,height)
{RasterControl.call(this,null,"span");this.controlBox.innerHTML="<span class='spritesContainer'><img src='' style='border:0' /></span>";this.spritesContainer=this.controlBox.firstChild;this.imageTag=this.spritesContainer.firstChild;this.setClass("rasterSprite");this.setSize(width,height);this.setImage(image);}
RasterSprite.prototype.IID_SPRITE=true;Raster.implementIID(RasterSprite,RasterControl);RasterSprite.prototype.dispose=function()
{this.spritesContainer=null;this.imageTag=null;RasterControl.prototype.dispose.call(this);};RasterSprite.prototype.setImage=function(image,resize)
{this.setDisplay(image!=null);if(image==null)
return this;this.path=Raster.toImgUrl(image.IID_SPRITEINFO?image.filename:image);this.isPNG=/.*\.png$/i.test(this.path);var dx=0,dy=0;if(image.IID_SPRITEINFO)
{dx=image.x;dy=image.y;if(resize===true)
this.setSize(image.w,image.h);}
if(Raster.isIE6)
if(this.isPNG)
{this.spritesContainer.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+this.path+"')";this.imageTag.style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity=0)";}
else
{this.spritesContainer.style.filter="";this.imageTag.style.filter="";}
this.imageTag.src=this.path;this.spritesContainer.style.left=dx==0?"0":"-"+dx+"px";this.spritesContainer.style.top=dy==0?"0":"-"+dy+"px";return this;};RasterSprite.prototype.setOpacity=function(percent)
{if(this.isPNG&&!Raster.isCSSCompliant)
{this.spritesContainer.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+this.path+"') "+"progid:DXImageTransform.Microsoft.Alpha(opacity="+percent+"); ";this.imageTag.style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity=0)";}
else
Raster.setOpacity(this.spritesContainer,percent);return this;};RasterSprite.asHtml=function(image,width,height,opacity)
{var display=image==null?"display:none;":"";image=image||"";width=width||"0";height=height||"0";var left=image.IID_SPRITEINFO?"-"+image.x+"px":"0";var top=image.IID_SPRITEINFO?"-"+image.y+"px":"0";var path=Raster.toImgUrl(image.IID_SPRITEINFO?image.filename:image);var isPNG=/.*\.png$/i.test(path);var useAlphaLdr=(isPNG&&Raster.isIE6)||(isPNG&&Raster.isIE&&opacity<90);var ifilter=useAlphaLdr?" filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0); ":"";var sfilter=useAlphaLdr?" filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+path+") ":"";if(opacity!=null&&opacity<90)
sfilter+=(isPNG&&Raster.isIE)?" progid:DXImageTransform.Microsoft.Alpha(opacity="+opacity+"); ":" opacity:"+(opacity/100)+";";return"<span class='rasterSprite' style='"+display+"width:"+width+"px; height:"+height+"px'>"+"<span class='spritesContainer' style='left:"+left+"; top:"+top+";"+sfilter+"'>"+"<img src='"+path+"' style='border:0;"+ifilter+"' />"+"</span>"+"</span>";};RasterSprite.setImage=function(span,image,width,height)
{span.style.display=image==null?"none":"";if(image==null)
return;var spritesContainer=span.firstChild;var imageTag=spritesContainer.firstChild;var path=Raster.toImgUrl(image.IID_SPRITEINFO?image.filename:image);var isPNG=/.*\.png$/i.test(path);if(Raster.isIE6)
if(isPNG)
{spritesContainer.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+path+"')";imageTag.style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity=0)";}
else
{spritesContainer.style.filter="";imageTag.style.filter="";}
imageTag.src=path;spritesContainer.style.left=image.IID_SPRITEINFO?"-"+image.x+"px":"0";spritesContainer.style.top=image.IID_SPRITEINFO?"-"+image.y+"px":"0";};RasterSprite.setOpacity=function(span,opacity)
{var spritesContainer=span.firstChild;var imageTag=spritesContainer.firstChild;var path=imageTag.src;var isPNG=/.*\.png$/i.test(path);if(isPNG&&!Raster.isCSSCompliant)
{spritesContainer.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+path+"') "+"progid:DXImageTransform.Microsoft.Alpha(opacity="+opacity+"); ";imageTag.style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity=0)";}
else
Raster.setOpacity(spritesContainer,opacity);};function RasterToolbar(parent,size)
{size=(size||'s').toString().toLowerCase().charAt(0);RasterControl.call(this,parent);this.controlBox.innerHTML="<div class='items'></div><div class='chevron'></div>";this.itemsDiv=this.controlBox.firstChild;this.chevronDiv=this.controlBox.lastChild;this.isThick=size==='m';this.isXLarge=size==='l';this.setClass(this.isXLarge?"rasterXLbar":(this.isThick?"rasterThickbar":"rasterThinbar"));this.items={};this.activeCommandItem=null;this.autoOpenMenu=false;this.chevronItem=this.add(RasterCommand.CHEVRON).showText(false);delete this.items[this.chevronItem.command.id];this.chevronItem.sprite.setImage(GLYPHS.CHEVRON_RIGHT);this.chevronItem.sprite.setSize(9,16);this.chevronItem.setParent(this.chevronDiv);this.chevronDiv.style.display="none";this.controlBox.onmousedown=RasterToolbar.mousedownHandler;this.controlBox.onmouseover=RasterToolbar.mouseoverHandler;this.controlBox.onmouseup=this.controlBox.onmouseout=RasterToolbar.mouseupHandler;this.id="toolbar"+(Raster.idSequence++);RasterToolbar.all[this.id]=this;}
RasterToolbar.all={};RasterToolbar.prototype.IID_TOOLBAR=true;Raster.implementIID(RasterToolbar,RasterControl);RasterToolbar.doLayout=function()
{for(var id in RasterToolbar.all)
RasterToolbar.all[id].doLayout();};RasterToolbar.mouseupHandler=function(event)
{var el=Raster.srcElement(event);var commandItem=Raster.findParentExpando(el,"commandItem");if(commandItem==null)
return;if(commandItem.menu==null)
commandItem.setDown(false);};RasterToolbar.mousedownHandler=function(event)
{var el=Raster.srcElement(event);var commandItem=Raster.findParentExpando(el,"commandItem");if(commandItem==null)
return;var toolbar=commandItem.parentControl;if(commandItem.isEnabled)
if(commandItem.menu!=null)
{if(toolbar.activeCommandItem==commandItem)
{toolbar.showItemMenu(null);Raster.setActiveMenu(null);}
else
toolbar.showItemMenu(commandItem);}
else
{Raster.setActiveMenu(null);toolbar.autoOpenMenu=false;commandItem.command.click(event);if(commandItem.menu==null)
commandItem.setDown(true);}
Raster.stopEvent(event);};RasterToolbar.mouseoverHandler=function(event)
{var el=Raster.srcElement(event);var commandItem=Raster.findParentExpando(el,"commandItem");if(commandItem==null)
return;var toolbar=commandItem.parentControl;if(commandItem.isEnabled&&toolbar.autoOpenMenu&&commandItem.menu!=null)
toolbar.showItemMenu(commandItem);};RasterToolbar.prototype.doLayout=function()
{var node=null;for(var i=0;i<this.itemsDiv.childNodes.length;i++)
{var tmp=this.itemsDiv.childNodes[i];if(tmp.className!="sep"&&tmp.offsetTop>5)
{node=tmp;break;}}
if(node==null)
{this.chevronDiv.style.display="none";return this;}
this.chevronDiv.style.display="block";if(this.chevronMenu==null)
{this.chevronMenu=new RasterMenu(document.body);this.chevronMenu.controlBox.style.zIndex=90;this.chevronItem.setMenu(this.chevronMenu).showArrow(false);}
this.chevronMenu.removeAll();do{if(node.className!="sep")
{var item=node.firstChild.commandItem;this.chevronMenu.add(item.command,item.menu);}
else
{this.chevronMenu.addseparator();}
node=node.nextSibling;}while(node!=null);return this;};RasterToolbar.prototype.showItemMenu=function(commandItem)
{if(this.activeCommandItem==commandItem)
return;if(this.activeCommandItem!=null)
{this.autoOpenMenu=false;this.activeCommandItem.showMenu(false);}
this.activeCommandItem=null;this.autoOpenMenu=false;if(commandItem==null)
return;if(commandItem.menu!=null)
{Raster.setActiveMenu(this);commandItem.showMenu(true);this.activeCommandItem=commandItem;this.autoOpenMenu=true;}};RasterToolbar.prototype.dispose=function()
{this.chevronItem.dispose();this.itemsDiv=null;this.chevronDiv=null;this.controlBox.onmousedown=null;this.controlBox.onmouseover=null;if(this.chevronMenu)
{this.chevronMenu.dispose();this.chevronMenu=null;}
delete RasterToolbar.all[this.id];for(var commandId in this.items)
this.items[commandId].dispose();RasterControl.prototype.dispose.call(this);};RasterToolbar.prototype.removeAll=function()
{for(var commandId in this.items)
this.items[commandId].dispose();this.cleanSeparators();this.items=[];this.doLayout();return this;};RasterToolbar.prototype.getContentElement=function()
{return this.itemsDiv;};RasterToolbar.prototype.add=function(newCommand,menu,refCommand,after)
{if(this.items[newCommand.id]!=null)
return this.items[newCommand.id];var item=new RasterCommandItem(this,newCommand);this.items[newCommand.id]=item;item.setMenu(menu);if(refCommand!=null)
{if(refCommand.IID_COMMAND)
refCommand=refCommand.id;else if(refCommand.IID_COMMANDITEM)
refCommand=refCommand.command.id;if(this.items[refCommand]!=null)
Raster.setSibling(item,this.items[refCommand],after==null?true:after);}
this.doLayout();return item;};RasterToolbar.prototype.addseparator=function(refCommand,after)
{if(refCommand!=null)
{if(refCommand.IID_COMMAND)
refCommand=refCommand.id;else if(refCommand.IID_COMMANDITEM)
refCommand=refCommand.command.id;}
var sep=document.createElement("SPAN");sep.className="sep";if(this.items[refCommand]==null)
this.itemsDiv.appendChild(sep);else
{Raster.setSibling(sep,this.items[refCommand],after==null?true:after);this.doLayout();}
return this;};RasterToolbar.prototype.cleanSeparators=function()
{var hasPrevSep=true;var node=this.itemsDiv.firstChild;while(node!=null)
{if(node.className=="sep")
{var sep=node;node=node.nextSibling;if(hasPrevSep)
this.itemsDiv.removeChild(sep);hasPrevSep=true;}
else
{hasPrevSep=false;node=node.nextSibling;}}
if(this.itemsDiv.lastChild!=null&&this.itemsDiv.lastChild.className=="sep")
this.itemsDiv.removeChild(this.itemsDiv.lastChild);return this;};RasterToolbar.prototype.remove=function(command)
{if(command.IID_COMMAND)
command=command.id;else if(command.IID_COMMANDITEM)
command=command.command.id;if(this.items[command]==null)
return this;this.items[command].dispose();delete this.items[command];this.cleanSeparators();this.doLayout();return this;};RasterToolbar.prototype.showBackground=function(isVisible)
{this.controlBox.style.background=isVisible?"":"none";return this;};function RasterMenu(parent)
{RasterControl.call(this,parent||document.body);this.controlBox.innerHTML='<div class="items"></div>'+'<div class="rasterShadowBox'+
(Raster.isIEQuirks?" rasterShadowBoxQuirks":"")+'">'+'<div class="rasterShadowBox0"></div>'+'<div class="rasterShadowBox1"></div>'+'<div class="rasterShadowBox2"></div>'+'<div class="rasterShadowBox3"></div>'+'</div>'+'<div class="hatch"></div>';this.controlBox.menu=this;this.setClass("rasterPopupMenu");this.itemsDiv=this.controlBox.firstChild;this.shadowDiv=this.controlBox.childNodes[1];this.hatchDiv=this.controlBox.lastChild;this.minWidth=50;this.items={};this.activeCommandItem=null;this.hide();this.showHatch(false);this.createIE6IframeBackdrop();this.controlBox.onmousedown=RasterMenu.mousedownHandler;this.controlBox.onmouseover=RasterMenu.mouseoverHandler;if(Raster.isIE)
this.controlBox.onmouseout=RasterMenu.mouseoutHandler;}
RasterMenu.SHADOW_SIZE=6;RasterMenu.prototype.IID_MENU=true;Raster.implementIID(RasterMenu,RasterControl);RasterMenu.mousedownHandler=function(event)
{var el=Raster.srcElement(event);var commandItem=Raster.findParentExpando(el,"commandItem");Raster.stopEvent(event);if(commandItem==null)
return;if(commandItem.menu==null&&commandItem.isEnabled)
{Raster.setActiveMenu(null);commandItem.command.click(event);if(Raster.isIE)
commandItem.setDown(false);}};RasterMenu.mouseoverHandler=function(event)
{var el=Raster.srcElement(event);var commandItem=Raster.findParentExpando(el,"commandItem");if(commandItem==null)
return;var menu=commandItem.parentControl;if(commandItem.menu!=null&&commandItem.isEnabled)
menu.showItemMenu(commandItem);else
{menu.showItemMenu(null);if(Raster.isIE)
commandItem.setDown(true);}};RasterMenu.mouseoutHandler=function(event)
{var el=Raster.srcElement(event);var commandItem=Raster.findParentExpando(el,"commandItem");if(commandItem==null)
return;if(commandItem.menu==null)
commandItem.setDown(false);};RasterMenu.prototype.showItemMenu=function(commandItem)
{if(this.activeCommandItem==commandItem)
return;if(this.activeCommandItem!=null)
this.activeCommandItem.showMenu(false);this.activeCommandItem=null;if(commandItem==null)
return;if(commandItem.menu!=null)
{commandItem.showMenu(true);this.activeCommandItem=commandItem;}};RasterMenu.prototype.refreshWidth=function()
{var width=this.minWidth;for(var commandId in this.items)
width=Math.max(width,this.items[commandId].getMenuOptimalWidth());this.itemsDiv.style.width=width+"px";this.shadowDiv.style.width=(this.controlBox.offsetWidth+RasterMenu.SHADOW_SIZE)+"px";this.shadowDiv.style.height=(this.controlBox.offsetHeight+RasterMenu.SHADOW_SIZE)+"px";if(Raster.isOp)
Raster.repaint(this.controlBox);};RasterMenu.prototype.showHatch=function(isVisible,atTop,x,width)
{this.hatchDiv.style.display=isVisible?"block":"none";if(!isVisible)
return;this.hatchDiv.style.left=x+"px";this.hatchDiv.style.width=width+"px";if(atTop)
{this.hatchDiv.style.top="0";this.hatchDiv.style.bottom="";}
else
{this.hatchDiv.style.top="";this.hatchDiv.style.bottom="0";}};RasterMenu.prototype.dispose=function()
{this.itemsDiv=null;this.hatchDiv=null;this.shadowDiv=null;this.controlBox.onmousedown=null;this.controlBox.onmouseover=null;this.controlBox.menu=null;for(var commandId in this.items)
this.items[commandId].dispose();RasterControl.prototype.dispose.call(this);};RasterMenu.prototype.removeAll=function()
{for(var commandId in this.items)
this.items[commandId].dispose();this.cleanSeparators();this.items=[];};RasterMenu.prototype.getContentElement=function()
{return this.itemsDiv;};RasterMenu.prototype.showShadow=function(isVisible)
{this.shadowDiv.style.display=isVisible?"":"none";return this;};RasterMenu.prototype.showAt=function(x,y,adjustToFit)
{Raster.setActiveMenu(this);if(adjustToFit===true)
{var win=Raster.getWindowBounds();var scroll=Raster.getElementScrolling(document.body);var menubox=this.getBounds();if(x+menubox.width>(win.width+scroll.x-20))
x=Math.max(scroll.x,x-menubox.width);if(y+menubox.height>(win.height+scroll.y-20))
y=Math.max(scroll.y,y-menubox.height);}
this.moveTo(x,y);this.setVisible(true);return this;};RasterMenu.prototype.showNextTo=function(element,ofsX,ofsY)
{element=Raster.resolve(element);var elementBox=Raster.getBounds(element);var win=Raster.getWindowBounds();var scroll=Raster.getElementScrolling(document.body);var menubox=this.getBounds();var x=elementBox.x+elementBox.width+(ofsX||0);var y=elementBox.y+(ofsY||0);var adjusted=false;if(elementBox.x+elementBox.width+menubox.width>win.width)
{x=Math.max(scroll.x,elementBox.x-menubox.width);}
if(elementBox.y+menubox.height>(win.height+scroll.y))
{y=Math.max(scroll.y,(win.height+scroll.y)-menubox.height);}
this.showAt(x,y);return this;};RasterMenu.prototype.showBelowOf=function(element,ofsX,ofsY)
{element=Raster.resolve(element);var elementBox=Raster.getBounds(element);var win=Raster.getWindowBounds();var scroll=Raster.getElementScrolling(document.body);var menubox=this.getBounds();var x=elementBox.x+(ofsX||0);var y=elementBox.y+elementBox.height+(ofsY||0);var adjusted=false;if(elementBox.x+menubox.width>win.width||elementBox.x<scroll.x)
{x=Math.max(scroll.x,(elementBox.x+Math.min(elementBox.width,menubox.width))-menubox.width);}
if(y+menubox.height>(win.height+scroll.y))
{y=Math.max(scroll.y,elementBox.y-menubox.height);}
this.showAt(x,y);return this;};RasterMenu.prototype.hide=function()
{this.showItemMenu(null);this.setVisible(false);this.showHatch(false);return this;};RasterMenu.prototype.add=function(newCommand,menu,refCommand,after)
{if(this.items[newCommand.id]!=null)
return this.items[newCommand.id];var item=new RasterCommandItem(this,newCommand);this.items[newCommand.id]=item;item.setMenu(menu);if(refCommand!=null)
{if(refCommand.IID_COMMAND)
refCommand=refCommand.id;else if(refCommand.IID_COMMANDITEM)
refCommand=refCommand.command.id;if(this.items[refCommand]!=null)
Raster.setSibling(item,this.items[refCommand],after==null?true:after);}
this.refreshWidth();return item;};RasterMenu.prototype.addseparator=function(refCommand,after)
{if(refCommand!=null)
{if(refCommand.IID_COMMAND)
refCommand=refCommand.id;else if(refCommand.IID_COMMANDITEM)
refCommand=refCommand.command.id;}
var sep=document.createElement("SPAN");sep.className="sep";if(this.items[refCommand]==null)
this.itemsDiv.appendChild(sep);else
Raster.setSibling(sep,this.items[refCommand],after==null?true:after);this.refreshWidth();return this;};RasterMenu.prototype.cleanSeparators=function()
{var hasPrevSep=true;var node=this.itemsDiv.firstChild;while(node!=null)
{if(node.className=="sep")
{var sep=node;node=node.nextSibling;if(hasPrevSep)
this.itemsDiv.removeChild(sep);hasPrevSep=true;}
else
{hasPrevSep=false;node=node.nextSibling;}}
if(this.itemsDiv.lastChild!=null&&this.itemsDiv.lastChild.className=="sep")
this.itemsDiv.removeChild(this.itemsDiv.lastChild);return this;};RasterMenu.prototype.remove=function(command)
{if(command.IID_COMMAND)
command=command.id;else if(command.IID_COMMANDITEM)
command=command.command.id;if(this.items[command]==null)
return this;this.items[command].dispose();delete this.items[command];this.refreshWidth();this.cleanSeparators();return this;};RasterMenu.prototype.setMinWidth=function(minWidth)
{this.minWidth=minWidth==null?50:minWidth;this.refreshWidth();return this;};function RasterCommand(id,icon,icon32,text,toolText,tooltip,keys,eventHandler)
{this.id=id;this.icon=icon;this.icon32=icon32;this.text=text;this.toolText=toolText!=null?toolText:text;this.keys=keys;this.tooltip=tooltip;this.event=null;this.isSelected=false;this.isEnabled=true;this.eventHandler=eventHandler;this.items={};if(!/^tabitem.\d*$/.test(id))
RasterCommand.all[id]=this;}
RasterCommand.all={};RasterCommand.CHEVRON=new RasterCommand("RasterCommand.CHEVRON","");RasterCommand.prototype.IID_COMMAND=true;RasterCommand.prototype.createGroup=RasterCommand.createGroup=function(eventHandler)
{var commands={};var group=function(id)
{return commands[id];};group.add=function(id,icon,icon32,text,toolText,tooltip,keys)
{return commands[id]=new RasterCommand(id,icon,icon32,text,toolText,tooltip,keys,eventHandler);};return group;};RasterCommand.prototype.click=function(event)
{if(this.eventHandler!=null)
{this.event=event;this.eventHandler(this);this.event=null;}
return this;};RasterCommand.prototype.setSelected=function(selected)
{this.isSelected=selected;for(var id in this.items)
this.items[id].setSelected(selected);return this;};RasterCommand.prototype.setEnabled=function(enabled)
{this.isEnabled=enabled;for(var id in this.items)
this.items[id].setEnabled(enabled);return this;};function RasterCommandItem(parentControl,command)
{RasterControl.call(this,parentControl,"span");this.command=command;this.parentControl=parentControl;this.isThick=parentControl.IID_TOOLBAR&&parentControl.isThick===true;this.isXLarge=parentControl.IID_TOOLBAR&&parentControl.isXLarge===true;this.isMenu=parentControl.IID_MENU;this.setClass(this.isMenu?"rasterPopupMenuItem":(this.isXLarge?"rasterXLbarItem":(this.isThick?"rasterThickbarItem":"rasterThinbarItem")));this.iconLink=document.createElement("A");this.iconLink.href="#";this.iconLink.onclick=Raster.stopEvent;this.iconLink.commandItem=this;if(command.tooltip)
this.iconLink.title=command.tooltip;this.controlBox.appendChild(this.iconLink);this.iconLink.innerHTML="<span class='bkleft'></span>"+"<span class='bkright'></span>"+"<span class='bkicon'></span>"+"<span class='cmdIco'></span>"+"<br class='cmdCRLF'>"+"<span class='cmdTxt'></span>"+"<br class='cmdCRLF'>"+"<span class='cmdKey'></span>"+"<span class='cmdArrow' style='display:none'></span>";this.iconSpan=this.iconLink.childNodes[3];this.textSpan=this.iconLink.childNodes[5];this.keysSpan=this.iconLink.childNodes[7];this.arrowSpan=this.iconLink.childNodes[8];if(this.isXLarge)
{if(command.icon32!=null)
{this.sprite=new RasterSprite(command.icon32,32,32);this.sprite.setParent(this.iconSpan);}
else if(command.icon!=null)
{this.sprite=new RasterSprite(command.icon,16,16);this.sprite.controlBox.style.margin="8px 0";this.sprite.setParent(this.iconSpan);}
else
this.iconSpan.innerHTML="<span style='display:inline-block; height:32px'></span>";}
else if(command.icon!=null)
{this.sprite=new RasterSprite(command.icon,16,16);this.sprite.setParent(this.iconSpan);}
else if(this.isMenu||this.isThick)
{this.iconSpan.innerHTML="<span style='display:inline-block; width:16px; height:16px'></span>";}
else
this.iconSpan.style.display="none";this.textSpan.innerHTML=parentControl.IID_TOOLBAR?command.toolText:command.text;this.keysSpan.innerHTML=command.keys||"";this.menu=null;this.isEnabled=true;this.isSelected=false;this.isDown=false;this.arrowOn=false;this.updateStyle();this.setSelected(command.isSelected);this.setEnabled(command.isEnabled);this.id="cmdItem"+(Raster.idSequence++);this.command.items[this.id]=this;}
RasterCommandItem.prototype.IID_COMMANDITEM=true;Raster.implementIID(RasterCommandItem,RasterControl);RasterCommandItem.prototype.dispose=function()
{this.iconLink.commandItem=null;this.iconLink.onmousedown=null;this.iconLink=null;this.iconSpan=null;this.textSpan=null;this.keysSpan=null;this.menu=null;if(this.sprite!=null)
this.sprite.dispose();delete this.command.items[this.id];RasterControl.prototype.dispose.call(this);};RasterCommandItem.prototype.showMenu=function(isVisible)
{if(this.menu==null)
return;if(isVisible===false)
{this.menu.hide();this.setDown(false);return;}
this.setDown(true);var linkbox=Raster.getBounds(this.iconLink);var win=Raster.getWindowBounds();var scroll=Raster.getElementScrolling(document.body);var menubox=this.menu.getBounds();var x,y;if(Raster.isOp)
linkbox.height=this.iconLink.clientHeight;if(this.isMenu)
{x=linkbox.x+linkbox.width-3;y=linkbox.y-3;if(linkbox.x+linkbox.width+menubox.width>win.width)
x=Math.max(scroll.x,linkbox.x-menubox.width+3);if(linkbox.y-3+menubox.height>(win.height+scroll.y))
y=Math.max(scroll.y,(win.height+scroll.y)-menubox.height);}
else
{x=linkbox.x;y=linkbox.y+linkbox.height-3;if(linkbox.x+menubox.width>win.width||linkbox.x<scroll.x)
x=Math.max(scroll.x,(linkbox.x+Math.min(linkbox.width,menubox.width))-menubox.width);this.menu.showHatch(true,true,linkbox.x-x+1,linkbox.width-2);if(y+menubox.height>(win.height+scroll.y))
{y=Math.max(scroll.y,linkbox.y-menubox.height+3);this.menu.showHatch(false);}}
this.menu.moveTo(x,y);this.menu.setVisible(true);};RasterCommandItem.prototype.getMenuOptimalWidth=function()
{return this.iconSpan.offsetWidth+
this.textSpan.offsetWidth+
this.keysSpan.offsetWidth+2;};RasterCommandItem.prototype.setEnabled=function(isEnabled)
{if(this.sprite!=null)
this.sprite.setOpacity(isEnabled?100:33);Raster.setOpacity(this.arrowSpan,isEnabled?100:33);this.isEnabled=isEnabled;this.updateStyle();return this;};RasterCommandItem.prototype.setDown=function(isDown)
{this.isDown=isDown;this.updateStyle();return this;};RasterCommandItem.prototype.setSelected=function(isSelected)
{this.isSelected=isSelected;this.updateStyle();return this;};RasterCommandItem.prototype.updateStyle=function()
{var ieMenu=Raster.isIE&&this.isMenu;if(!this.isEnabled)
this.iconLink.className="rasterCommandItemDisabled";else if(this.isDown)
this.iconLink.className=ieMenu?"rasterCommandItemDownIE"+(this.isSelected?" rasterCommandItemSelectedIE":""):"rasterCommandItemDown";else if(this.isSelected)
this.iconLink.className=ieMenu?"rasterCommandItemSelectedIE":"rasterCommandItemSelected";else
this.iconLink.className=ieMenu?"rasterCommandItemNormalIE":"rasterCommandItemNormal";};RasterCommandItem.prototype.remove=function()
{this.parentControl.remove(this);return this;};RasterCommandItem.prototype.showText=function(isVisible)
{this.textSpan.style.display=isVisible?"":"none";if(this.parentControl.IID_TOOLBAR)
this.parentControl.doLayout();return this;};RasterCommandItem.prototype.showIcon=function(isVisible)
{this.iconSpan.style.display=isVisible?"":"none";if(this.parentControl.IID_TOOLBAR)
this.parentControl.doLayout();return this;};RasterCommandItem.prototype.setMenu=function(menu)
{this.menu=menu;this.showArrow(menu!=null);return this;};RasterCommandItem.prototype.showArrow=function(isVisible)
{if(this.isThick||this.isXLarge)
{if(isVisible)
this.iconLink.style.paddingRight=((parseInt(this.iconLink.style.paddingRight)+15)||15)+"px";else if(this.arrowOn)
this.iconLink.style.paddingRight=((parseInt(this.iconLink.style.paddingRight)-15)||0)+"px";}
else if(this.isMenu)
{this.keysSpan.style.visibility=isVisible?"hidden":"";}
this.arrowOn=isVisible;this.arrowSpan.style.display=isVisible?"":"none";if(this.parentControl.IID_TOOLBAR)
this.parentControl.doLayout();return this;};function RasterTabbar(parent,alignTop)
{RasterControl.call(this,parent);this.controlBox.innerHTML="<div class='items'></div><div class='chevron'></div><div class='baseline'></div>";this.itemsDiv=this.controlBox.firstChild;this.chevronDiv=this.controlBox.childNodes[1];this.alignTop=alignTop===true;this.setClass(this.alignTop?"rasterTabbar rasterTabbarFlip":"rasterTabbar");this.items={};this.isDnD=false;this.selectedTab=null;this.eventHandler=null;this.chevronMenu=null;this.chevronItem=this.add("");delete this.items[this.chevronItem.id];this.chevronItem.isChevron=true;this.chevronItem.sprite.setImage(GLYPHS.CHEVRON_RIGHT);this.chevronItem.sprite.setSize(9,16);this.chevronItem.setParent(this.chevronDiv);this.chevronDiv.style.display="none";this.controlBox.onmousedown=RasterTabbar.mousedownHandler;this.id="tabbar"+(Raster.idSequence++);RasterTabbar.all[this.id]=this;}
RasterTabbar.all={};RasterTabbar.prototype.IID_TABBAR=true;Raster.implementIID(RasterTabbar,RasterControl);RasterTabbar.doLayout=function()
{for(var id in RasterTabbar.all)
RasterTabbar.all[id].doLayout();};RasterTabbar.mousedownHandler=function(event)
{var el=Raster.srcElement(event);var tabItem=Raster.findParentExpando(el,"tabItem");Raster.stopEvent(event);Raster.setActiveMenu(null);if(tabItem==null)
return;var tabbar=tabItem.parentControl;if(tabItem==tabbar.chevronItem)
{tabbar.chevronMenu.showBelowOf(tabItem.iconLink);}
else
{var mouse=Raster.getInputState(event);if(tabbar.isDnD&&mouse.button==1)
{RasterMouse.setCursor(CURSORS.DRAG);RasterMouse.startDrag(event,tabItem);}
if(tabbar.selectedTab!=tabItem)
{var tabEvent=null;if(tabbar.eventHandler!=null)
{tabEvent=RasterEvent.mkTabEvent(event,mouse.button==1?"click":"context",tabbar,tabItem);tabbar.eventHandler(tabEvent);}
if(tabItem.isEnabled&&(tabEvent==null||!tabEvent.isCancelled))
tabbar.selectTab(tabItem);}}};RasterTabbar.prototype.doLayout=function()
{var node=null;for(var i=0;i<this.itemsDiv.childNodes.length;i++)
{var tmp=this.itemsDiv.childNodes[i];if(tmp.offsetTop>5)
{node=tmp;break;}}
if(node==null)
{this.chevronDiv.style.display="none";return;}
this.chevronDiv.style.display="block";if(this.chevronMenu==null)
{this.chevronMenu=new RasterMenu(document.body);this.chevronMenu.controlBox.style.zIndex=90;}
this.chevronMenu.removeAll();do
{var item=node.firstChild.tabItem;var cmd=new RasterCommand(item.id,item.icon,null,item.text||"...",null,null,null,RasterTabbar.chevronMenuHandler);cmd.tabItem=item;this.chevronMenu.add(cmd);node=node.nextSibling;}while(node!=null);};RasterTabbar.chevronMenuHandler=function(cmd,event)
{cmd.tabItem.select();};RasterTabbar.prototype.getContentElement=function()
{return this.itemsDiv;};RasterTabbar.prototype.setDragDrop=function(isDnD)
{this.isDnD=isDnD;return this;};RasterTabbar.prototype.dispose=function()
{this.chevronItem.dispose();this.itemsDiv=null;this.chevronDiv=null;this.controlBox.onmousedown=null;if(this.chevronMenu)
{this.chevronMenu.dispose();this.chevronMenu=null;}
delete RasterTabbar.all[this.id];for(var tabId in this.items)
this.items[tabId].dispose();RasterControl.prototype.dispose.call(this);};RasterTabbar.prototype.removeAll=function()
{var all=this.getTabs();for(var i=0;i<all.length;i++)
this.removeTab(all[i]);this.items={};this.doLayout();return this;};RasterTabbar.prototype.add=function(icon,text,containerId,value)
{var item=new RasterTabItem(this,icon,text,containerId,value);this.items[item.id]=item;this.doLayout();return item;};RasterTabbar.prototype.selectTabByIndex=function(index)
{return this.selectTab(this.getTabByIndex(index));};RasterTabbar.prototype.selectTab=function(item)
{if(this.selectedTab!=null)
this.selectedTab.markSelected(false);this.selectedTab=null;if(item==null||!item.IID_TABITEM)
item=this.getTabByValue(item);if(item!=null)
{item.markSelected(true);this.selectedTab=item;}
return this;};RasterTabbar.prototype.getSelectedTab=function(item)
{return this.selectedTab;};RasterTabbar.prototype.getTabByValue=function(value)
{for(var id in this.items)
if(this.items[id].value==value)
return this.items[id];return null;};RasterTabbar.prototype.getTabByIndex=function(index)
{var childs=this.itemsDiv.childNodes;if(index<childs.length)
return childs[index].rasterControl;else
return null;};RasterTabbar.prototype.getTabCount=function()
{return this.itemsDiv.childNodes.length;};RasterTabbar.prototype.getTabs=function()
{var temp=[];var childs=this.itemsDiv.childNodes;for(var i=0;i<childs.length;i++)
temp.push(childs[i].rasterControl);return temp;};RasterTabbar.prototype.removeTab=function(item)
{if(!item.IID_TABITEM)
item=this.getTabByValue(item);if(item==null||this.items[item.id]==null)
return this;if(this.selectedTab==item)
this.selectTab(null);delete this.items[item.id];item.dispose();this.doLayout();return this;};RasterTabbar.prototype.showBackground=function(isVisible)
{this.controlBox.style.background=isVisible?"":"none";return this;};RasterTabbar.prototype.setEventHandler=function(eventHandler)
{this.eventHandler=eventHandler;return this;};function RasterTabItem(parentControl,icon,text,containerId,value)
{RasterControl.call(this,parentControl,"span");this.setClass("rasterTabbarItem");this.parentControl=parentControl;this.iconLink=document.createElement("A");this.iconLink.onclick=Raster.stopEvent;this.iconLink.tabItem=this;this.controlBox.appendChild(this.iconLink);this.iconLink.innerHTML="<span class='bkleft'></span>"+"<span class='bkright'></span>"+"<span class='tabIco'></span>"+"<span class='tabTxt'></span>";this.iconSpan=this.iconLink.childNodes[2];this.textSpan=this.iconLink.childNodes[3];this.text=text;this.icon=icon;this.value=value;this.isEnabled=true;this.isSelected=false;this.updateStyle();this.setDropHandler(RasterTabItem.dragDropHandler);this.id="tabitem"+(Raster.idSequence++);this.containerId=containerId;this.setText(text);this.setIcon(icon);}
RasterTabItem.prototype.IID_TABITEM=true;Raster.implementIID(RasterTabItem,RasterControl);RasterTabbar.prototype.getDragContext=function(mouseEvt)
{var dragContext=mouseEvt.context[this.id];if(!dragContext)
{dragContext=mouseEvt.context[this.id]={};dragContext.isBeforeDrag=true;}
return dragContext;};RasterTabItem.dragDropHandler=function(mouseEvt)
{var tabItem=mouseEvt.control;var dragValue=mouseEvt.value;var evtType=mouseEvt.type=="enter"?"over":mouseEvt.type;var tabbar=tabItem.parentControl;if(!tabbar.isDnD||evtType=="cancel"||evtType=="out"||dragValue==null||tabItem.isChevron)
return;var isLocal=dragValue.IID_TABITEM&&(dragValue.parentControl==tabbar);var ctx=tabbar.getDragContext(mouseEvt);var tabEvent;if(isLocal&&ctx.isBeforeDrag)
{ctx.isBeforeDrag=false;if(tabbar.eventHandler!=null)
{tabEvent=RasterEvent.mkTabEvent(mouseEvt.event,"beforedrag",tabbar,dragValue,dragValue,null);tabbar.eventHandler(tabEvent);}
if(tabEvent!=null&&tabEvent.isCancelled)
{RasterMouse.cancelDrag();return;}}
RasterMouse.showDropBorderOver(null);RasterMouse.showDropLine(null);if(dragValue==tabItem)
return;var b=tabItem.getBounds();var edge=RasterMouse.getNearestEdgeH(tabItem.controlBox,mouseEvt.event,b.width/3);var position=edge==3?"after":(edge==7?"before":"over");tabEvent=null;if(tabbar.eventHandler!=null&&(evtType=="over"||(evtType=="drop"&&ctx.position!=null)))
{tabEvent=RasterEvent.mkTabEvent(mouseEvt.event,evtType,tabbar,tabItem,dragValue,(evtType=="over"?position:ctx.position));tabbar.eventHandler(tabEvent);}
if(evtType=="over"&&tabEvent&&tabEvent.acceptPosition)
{position=ctx.position=tabEvent.acceptPosition;if(position=="after")
RasterMouse.showDropLine(b.x+b.width,b.y-6,true,b.height+12);else if(position=="before")
RasterMouse.showDropLine(b.x,b.y-6,true,b.height+12);else
RasterMouse.showDropBorderOver(tabItem.iconLink);}
else if(evtType!="drop")
{ctx.position=null;}
if(evtType=="drop"&&isLocal&&ctx.position&&(tabEvent&&!tabEvent.isCancelled))
dragValue.setSibling(tabItem.controlBox,ctx.position=="after");};RasterTabItem.prototype.toString=function()
{return this.text;};RasterTabItem.prototype.markSelected=function(isSelected)
{this.isSelected=isSelected;this.updateStyle();if(this.containerId!=null)
{var el=document.getElementById(this.containerId);if(el!=null)
el.style.display=isSelected?"block":"none";}
return this;};RasterTabItem.prototype.updateStyle=function()
{if(!this.isEnabled)
this.iconLink.className="rasterTabItemDisabled";else if(this.isSelected)
this.iconLink.className="rasterTabItemSelected";else
this.iconLink.className="";};RasterTabItem.prototype.dispose=function()
{this.iconLink.tabItem=null;this.iconLink.onmousedown=null;this.iconLink=null;this.iconSpan=null;this.textSpan=null;if(this.sprite)
this.sprite.dispose();delete this.parentControl.items[this.id];RasterControl.prototype.dispose.call(this);};RasterTabItem.prototype.remove=function()
{this.parentControl.removeTab(this);return this;};RasterTabItem.prototype.select=function()
{this.parentControl.selectTab(this);return this;};RasterTabItem.prototype.setEnabled=function(isEnabled)
{if(!isEnabled&&this.isSelected)
this.parentControl.selectTab(null);if(this.sprite!=null)
this.sprite.setOpacity(isEnabled?100:33);this.isEnabled=isEnabled;this.updateStyle();return this;};RasterTabItem.prototype.setText=function(text)
{this.text=text;this.textSpan.innerHTML=text||"";this.textSpan.style.display=(text!=null)?"":"none";this.parentControl.doLayout();return this;};RasterTabItem.prototype.setIcon=function(icon)
{this.icon=icon;if(icon!=null)
if(this.sprite==null)
{this.sprite=new RasterSprite(icon,16,16);this.sprite.setParent(this.iconSpan);}
else
this.sprite.setImage(icon);this.iconSpan.style.display=(icon!=null)?"":"none";this.parentControl.doLayout();return this;};RasterTabItem.prototype.getIndex=function()
{return Raster.indexOf(this.controlBox);};var RasterMouse={setup:function()
{if(RasterMouse.allSet)
return;RasterMouse.dropBorder=new RasterBorderBox(document.body);RasterMouse.insertionLine=new RasterInsertLine(document.body);RasterMouse.shadeBox=new RasterShadeBox(document.body);RasterMouse.cursorSprite=new RasterSprite("",16,16,false);RasterMouse.cursorSprite.setParent(document.body);RasterMouse.cursorSprite.setClass("rasterCursorSprite");RasterMouse.cursorSprite.setDisplay(false);Raster.addListener(document,"mouseup",RasterMouse.mouseup);Raster.addListener(window,"blur",RasterMouse.cancelDrag);if(Raster.isIE)
Raster.addListener(window,"losecapture",RasterMouse.cancelDrag);RasterMouse.allSet=true;},startDrag:function(event,value,data,mouseListener,disableIECapture)
{RasterMouse.setup();RasterMouse.timer=null;RasterMouse.event=RasterEvent.mkMouseEvent(event,"",value,data);RasterMouse.mouseListener=mouseListener;RasterMouse.startCursor=RasterMouse.currentCursor;Raster.stopEvent(event);Raster.addListener(document,"mousemove",RasterMouse.mousemove);if(Raster.isIE)
{if(disableIECapture!==true)
document.body.setCapture();else
Raster.addListener(document.body,"mouseleave",RasterMouse.cancelDrag);}
return RasterMouse.event;},cancelDrag:function()
{if(Raster.isIE)
{document.body.releaseCapture();Raster.removeListener(document.body,"mouseleave",RasterMouse.cancelDrag);}
if(RasterMouse.event)
{var evt=RasterMouse.event;evt.type="cancel";if(RasterMouse.currentControl!=null&&RasterMouse.currentControl.dropHandler!=null)
{evt.control=RasterMouse.currentControl;RasterMouse.currentControl.dropHandler(evt);}
if(RasterMouse.mouseListener!=null)
{evt.control=null;RasterMouse.mouseListener(evt);evt.type="end";RasterMouse.mouseListener(evt);}}
Raster.removeListener(document,"mousemove",RasterMouse.mousemove);if(RasterMouse.timer!=null)
clearInterval(RasterMouse.timer);RasterMouse.timer=null;RasterMouse.event=null;RasterMouse.currentElement=null;RasterMouse.currentControl=null;RasterMouse.mouseListener=null;RasterMouse.startCursor=null;RasterMouse.setCursor(null);RasterMouse.dropBorder.hide();RasterMouse.insertionLine.hide();RasterMouse.shadeBox.hide();},mousemove:function(event)
{var evt=RasterMouse.event;var mouse=Raster.getInputState(event);evt.event=event;evt.x=mouse.x;evt.y=mouse.y;evt.ctrl=mouse.ctrl;evt.alt=mouse.alt;evt.shift=mouse.shift;evt.button=mouse.button;if(RasterMouse.currentCursor!=null)
RasterMouse.cursorSprite.moveTo(mouse.x+12,mouse.y+17);if(RasterMouse.mouseListener)
{evt.type="move";RasterMouse.mouseListener(evt);return;}
var el=Raster.srcElement(event);var rasterControl=Raster.findParentExpando(el,"rasterControl");var isIgnoredControl=rasterControl!=null&&(rasterControl.IID_BORDERBOX===true||rasterControl.IID_SHADEBOX===true||rasterControl.IID_INSERTIONLINE===true);if(!isIgnoredControl)
while(rasterControl!=null&&rasterControl.dropHandler==null)
rasterControl=Raster.findParentExpando(rasterControl.controlBox.parentNode,"rasterControl");var mouseLeft=RasterMouse.currentElement!=el&&!isIgnoredControl;if(mouseLeft)
{if(RasterMouse.currentControl!=null&&RasterMouse.currentControl.dropHandler!=null)
{evt.type="out";evt.control=RasterMouse.currentControl;RasterMouse.currentControl.dropHandler(evt);}
RasterMouse.currentElement=el;RasterMouse.currentControl=rasterControl;RasterMouse.dropBorder.hide();RasterMouse.insertionLine.hide();RasterMouse.shadeBox.hide();if(RasterMouse.currentCursor!=RasterMouse.startCursor)
RasterMouse.setCursor(RasterMouse.startCursor);}
if(RasterMouse.currentControl!=null&&RasterMouse.currentControl.dropHandler!=null)
{evt.type=mouseLeft?"enter":"over";evt.control=RasterMouse.currentControl;RasterMouse.currentControl.dropHandler(evt);}},mouseup:function(event)
{if(!RasterMouse.event)
return;var evt=RasterMouse.event;var mouse=Raster.getInputState(event);evt.event=event;evt.x=mouse.x;evt.y=mouse.y;evt.ctrl=mouse.ctrl;evt.alt=mouse.alt;evt.shift=mouse.shift;evt.button=mouse.button;if(RasterMouse.currentControl!=null&&RasterMouse.currentControl.dropHandler!=null)
{evt.type="drop";evt.control=RasterMouse.currentControl;RasterMouse.currentControl.dropHandler(evt);}
if(RasterMouse.mouseListener!=null)
{evt.type="up";evt.control=null;RasterMouse.mouseListener(evt);evt.type="end";RasterMouse.mouseListener(evt);}
RasterMouse.currentControl=null;RasterMouse.mouseListener=null;RasterMouse.cancelDrag();},addTimerListener:function(callback,arg)
{if(RasterMouse.event==null)
return;if(!RasterMouse.event.callbacks)
{RasterMouse.event.callbacks=[];RasterMouse.timer=setInterval(RasterMouse.timerHandler,100);}
RasterMouse.event.callbacks.push({callback:callback,arg:arg});},timerHandler:function(callback,arg)
{RasterMouse.event.type="timer";var arr=RasterMouse.event.callbacks;for(var i=0;i<arr.length;i++)
arr[i].callback(RasterMouse.event,arr[i].arg);},setCursor:function(cursor)
{RasterMouse.setup();RasterMouse.currentCursor=cursor;if(cursor==null)
{RasterMouse.cursorSprite.moveTo(0,-1600);}
else if(cursor.IID_SPRITEINFO)
{RasterMouse.cursorSprite.setImage(cursor,true);RasterMouse.cursorSprite.setDisplay(true);}},restoreCursor:function()
{RasterMouse.setCursor(RasterMouse.startCursor);},setDropBorderCursor:function(cssCursor)
{RasterMouse.setup();RasterMouse.dropBorder.controlBox.style.cursor=cssCursor||"default";},showDropBorderOver:function(element,borders,cssCursor)
{RasterMouse.setup();if(element==null)
{RasterMouse.dropBorder.hide();return;}
if(cssCursor!=null)
RasterMouse.setDropBorderCursor(cssCursor);RasterMouse.dropBorder.setBorders(borders);RasterMouse.dropBorder.showOver(element);},showDropBorder:function(x,y,width,height,cssCursor)
{RasterMouse.setup();if(x==null)
{RasterMouse.dropBorder.hide();return;}
if(cssCursor!=null)
RasterMouse.setDropBorderCursor(cssCursor);RasterMouse.dropBorder.setSize(width,height);RasterMouse.dropBorder.moveTo(x,y);},setShadeBoxCursor:function(cssCursor)
{RasterMouse.setup();RasterMouse.shadeBox.controlBox.style.cursor=cssCursor||"default";},showShadeBox:function(x,y,width,height,cssCursor)
{RasterMouse.setup();if(x==null)
{RasterMouse.shadeBox.hide();return;}
if(cssCursor!=null)
RasterMouse.setShadeBoxCursor(cssCursor);RasterMouse.shadeBox.setSize(width,height);RasterMouse.shadeBox.moveTo(x,y);},showDropLine:function(x,y,isVertical,length)
{RasterMouse.setup();if(x==null)
{RasterMouse.insertionLine.hide();return;}
RasterMouse.insertionLine.setOrientation(isVertical,length);RasterMouse.insertionLine.moveTo(x,y);},RESIZE_CURSORS:["nw-resize","n-resize","ne-resize","e-resize","se-resize","s-resize","sw-resize","w-resize","default"],getNearestEdge:function(element,event,borderWidth)
{var mouse=Raster.getInputState(event);var point=Raster.pointToElement(element,mouse.x,mouse.y);var box=Raster.getBounds(element);borderWidth=borderWidth||5;if(point.x>(box.width-borderWidth))
{if(point.y<borderWidth)
return 2;else if(point.y>(box.height-borderWidth))
return 4;else
return 3;}
else if(point.x<borderWidth)
{if(point.y<borderWidth)
return 0;else if(point.y>(box.height-borderWidth))
return 6;else
return 7;}
else if(point.y<borderWidth)
return 1;else if(point.y>(box.height-borderWidth))
return 5;return 8;},getNearestEdgeH:function(element,event,borderWidth)
{var mouse=Raster.getInputState(event);var point=Raster.pointToElement(element,mouse.x,mouse.y);var box=Raster.getBounds(element);borderWidth=borderWidth||box.width/3;if(point.x>box.width-borderWidth)
return 3;else if(point.x<borderWidth)
return 7;return 8;},getNearestEdgeV:function(element,event,borderWidth)
{var mouse=Raster.getInputState(event);var point=Raster.pointToElement(element,mouse.x,mouse.y);var box=Raster.getBounds(element);borderWidth=borderWidth||box.height/3;if(point.y>box.height-borderWidth)
return 5;else if(point.y<borderWidth)
return 1;return 8;}};function RasterShadowBox(parent)
{RasterControl.call(this,parent||document.body);this.controlBox.innerHTML='<div class="rasterShadowBox0"></div>'+'<div class="rasterShadowBox1"></div>'+'<div class="rasterShadowBox2"></div>'+'<div class="rasterShadowBox3"></div>';this.setClass("rasterShadowBox");this.setBounds(0,-2600,100,100);}
RasterShadowBox.prototype.IID_SHADOWBOX=true;Raster.implementIID(RasterShadowBox,RasterControl);RasterShadowBox.prototype.dispose=function()
{RasterControl.prototype.dispose.call(this);};function RasterBorderBox(parent)
{RasterControl.call(this,parent||document.body);this.controlBox.innerHTML='<div class="t"></div><div class="r"></div>'+'<div class="b"></div><div class="l"></div>';this.border={};this.border.t=this.controlBox.childNodes[0];this.border.r=this.controlBox.childNodes[1];this.border.b=this.controlBox.childNodes[2];this.border.l=this.controlBox.childNodes[3];this.setClass("rasterBorderBox");this.setBounds(0,-2600,100,100);}
RasterBorderBox.prototype.IID_BORDERBOX=true;Raster.implementIID(RasterBorderBox,RasterControl);RasterBorderBox.prototype.dispose=function()
{this.border.n=this.border.e=this.border.s=this.border.w=null;RasterControl.prototype.dispose.call(this);};RasterBorderBox.prototype.setBorders=function(borders)
{borders=borders||'tblr';this.border.t.style.display=borders.indexOf('t')>=0?"block":"none";this.border.b.style.display=borders.indexOf('b')>=0?"block":"none";this.border.l.style.display=borders.indexOf('l')>=0?"block":"none";this.border.r.style.display=borders.indexOf('r')>=0?"block":"none";};RasterBorderBox.prototype.setSize=function(width,height)
{RasterControl.prototype.setSize.call(this,width,height);this.border.r.style.backgroundPosition=width%2!=0?"0 0":"-1px 0";this.border.b.style.backgroundPosition=height%2!=0?"0 0":"0 -1px";};RasterBorderBox.prototype.showOver=function(element)
{var rect=Raster.getBounds(element);this.setBounds(rect.x,rect.y,rect.width,rect.height);};RasterBorderBox.prototype.hide=function()
{this.setBounds(0,-1600,50,50);};function RasterShadeBox(parent)
{RasterControl.call(this,parent||document.body);this.setClass("rasterShadeBox");this.setBounds(0,-1600,100,100);}
RasterShadeBox.prototype.IID_SHADEBOX=true;Raster.implementIID(RasterShadeBox,RasterControl);RasterShadeBox.prototype.dispose=function()
{RasterControl.prototype.dispose.call(this);};RasterShadeBox.prototype.showOver=function(element)
{var rect=Raster.getBounds(element);this.setBounds(rect.x,rect.y,rect.width,rect.height);};RasterShadeBox.prototype.hide=function()
{this.moveTo(0,-2600);};function RasterInsertLine(parent,isVertical)
{RasterControl.call(this,parent||document.body);this.controlBox.innerHTML='<div class="a"></div><div class="b"></div>';this.setLength(50);this.setOrientation(isVertical!==false);this.moveTo(0,-2600);}
RasterInsertLine.prototype.IID_INSERTIONLINE=true;Raster.implementIID(RasterInsertLine,RasterControl);RasterInsertLine.prototype.dispose=function()
{RasterControl.prototype.dispose.call(this);};RasterInsertLine.prototype.setOrientation=function(isVertical,length)
{this.isVertical=isVertical;this.setClass(isVertical?"rasterInsertionLineV":"rasterInsertionLineH");this.setLength(length==null?this.length:length);};RasterInsertLine.prototype.setLength=function(length)
{this.length=length;if(this.isVertical)
this.setSize(2,length);else
this.setSize(length,2);};RasterInsertLine.prototype.hide=function()
{this.moveTo(0,-2600);};function RasterConsole(parent)
{RasterControl.call(this,parent);this.controlBox.style.width="100%";this.controlBox.style.height="100%";if(!Raster.isIEQuirks&&(Raster.isIE6||Raster.isIE7))
{var name="console"+(Raster.idSequence++);var s="<html><body style='border:0;margin:0;overflow:hidden;'>"+"<textarea style='width:100%;height:100%;border:0;position:absolute;top:0;left:0;overflow:auto;font-size:8pt'>"+"</textarea></body></html>";var iframe=document.createElement("IFRAME");iframe.style.width="100%";iframe.style.height="100%";iframe.style.borderWidth="0";iframe.setAttribute("src",'javascript: ""');iframe.setAttribute("id",name);document.body.appendChild(iframe);frames[name].document.open();frames[name].document.write(s);frames[name].document.close();this.textarea=frames[name].document.body.firstChild;Raster.setParent(iframe,this.controlBox);}
else
{this.controlBox.innerHTML="<textarea style='width:100%;height:100%;resize: none;"+"margin:0;padding:0;border:none; overflow:auto;font-size:8pt'></textarea>";this.textarea=this.controlBox.firstChild;}}
RasterConsole.prototype.IID_CONSOLE=true;Raster.implementIID(RasterConsole,RasterControl);RasterConsole.prototype.dispose=function()
{this.textarea=null;RasterControl.prototype.dispose.call(this);};RasterConsole.prototype.println=function(text)
{this.print(text+"\n");};RasterConsole.prototype.print=function(text)
{this.textarea.value+=text;this.textarea.scrollTop=this.textarea.scrollHeight;};RasterConsole.prototype.clear=function()
{this.textarea.value="";};RasterConsole.prototype.getText=function()
{return this.textarea.value;};RasterConsole.prototype.setText=function(text)
{this.textarea.value=text;};function RasterSplitter(parent,alignment,size)
{RasterControl.call(this,parent);this.controlBox.innerHTML='<div class="rasterSplitterPane2">'+'<div style="position:absolute;width:100%;height:100%"></div>'+'</div>'+'<div></div>';this.content1=this.controlBox.childNodes[1];this.content2Box=this.controlBox.childNodes[0];this.content2=this.content2Box.firstChild;this.size=null;this.alignment=null;this.isResizable=true;this.eventHandler=null;this.domLevel=0;this.isVertical=false;this.gripOffset=0;if(Raster.isIE)
{this.controlBox.ondragstart=null;this.controlBox.onselectstart=null;}
this.controlBox.onmousedown=RasterSplitter.mousedownHandler;this.setAlignment(alignment);this.setSize(size);if(Raster.isIE)
this.controlBox.onmouseover=RasterSplitter.mouseoverHandler;this.id="splitter"+(Raster.idSequence++);RasterSplitter.all[this.id]=this;}
RasterSplitter.all={};RasterSplitter.THICKNESS=5;RasterSplitter.prototype.IID_SPLITTER=true;Raster.implementIID(RasterSplitter,RasterControl);RasterSplitter.doLayout=function()
{var arr=new Array();for(var id in RasterSplitter.all)
{RasterSplitter.all[id].updateDomLevel();arr.push(RasterSplitter.all[id]);}
arr.sort(function(a,b){return a.domLevel-b.domLevel;});for(var i=0;i<arr.length;i++)
arr[i].doLayout();};RasterSplitter.mouseoverHandler=function(event)
{var el=Raster.srcElement();var c=Raster.findParentExpando(el,"rasterControl");if(c!=null&&c.IID_SPLITTER&&c.isResizable)
RasterMouse.setShadeBoxCursor(c.isVertical?"w-resize":"n-resize");};RasterSplitter.mousedownHandler=function(event)
{var el=Raster.srcElement(event);if(el.rasterControl==null||!el.rasterControl.IID_SPLITTER)
return;var splitter=el.rasterControl;if(!splitter.isResizable)
return;var mouse=Raster.getInputState(event);var point=Raster.pointToElement(splitter.controlBox,mouse.x,mouse.y);var data=el.rasterControl.getBounds();data.splitter=splitter;data.mouseOffset=(splitter.isVertical?point.x:point.y)-splitter.computeGripOffset();var evt=RasterMouse.startDrag(event,null,data,RasterSplitter.mousemoveHandler);evt.type="move";RasterSplitter.mousemoveHandler(evt);};RasterSplitter.mousemoveHandler=function(evt)
{var bounds=evt.data;var splitter=evt.data.splitter;var mouse=Raster.getInputState(evt.event);var point=Raster.pointToElement(splitter.controlBox,mouse.x,mouse.y);var dx=Math.min(bounds.width-RasterSplitter.THICKNESS,Math.max(0,point.x-bounds.mouseOffset));var dy=Math.min(bounds.height-RasterSplitter.THICKNESS,Math.max(0,point.y-bounds.mouseOffset));if(splitter.isVertical)
RasterMouse.showShadeBox(bounds.x+dx,bounds.y,RasterSplitter.THICKNESS,bounds.height,"w-resize");else
RasterMouse.showShadeBox(bounds.x,bounds.y+dy,bounds.width,RasterSplitter.THICKNESS,"n-resize");if(evt.type=="up")
{var size=dx;switch(splitter.alignment)
{case'T':size=dy;break;case'R':size=bounds.width-(dx+RasterSplitter.THICKNESS);break;case'B':size=bounds.height-(dy+RasterSplitter.THICKNESS);break;}
var spEvent=null;if(splitter.eventHandler)
{spEvent=RasterEvent.mkSplitterEvent(evt.event,"resize",splitter,size);splitter.eventHandler(spEvent);size=spEvent.size;}
if(spEvent==null||!spEvent.isCancelled)
splitter.setSize(size);}};RasterSplitter.prototype.computeGripOffset=function()
{var b=this.getBounds();switch(this.alignment)
{case'T':return Math.max(0,Math.min(this.size,b.height-RasterSplitter.THICKNESS));case'R':return b.width-RasterSplitter.THICKNESS-Math.max(0,Math.min(this.size,b.width-RasterSplitter.THICKNESS));case'B':return b.height-RasterSplitter.THICKNESS-Math.max(0,Math.min(this.size,b.height-RasterSplitter.THICKNESS));default:return Math.max(0,Math.min(this.size,b.width-RasterSplitter.THICKNESS));}};RasterSplitter.prototype.doLayout=function()
{var b=this.getBounds();switch(this.alignment)
{case'T':case'B':if(this.size>b.height-RasterSplitter.THICKNESS)
this.applySize(b.height-RasterSplitter.THICKNESS);break;default:if(this.size>b.width-RasterSplitter.THICKNESS)
this.applySize(b.width-RasterSplitter.THICKNESS);}};RasterSplitter.prototype.updateDomLevel=function()
{var n=0;var node=this.controlBox;while((node=node.parentNode)!=null)
n++;this.domLevel=n;};RasterSplitter.prototype.dispose=function()
{this.controlBox.onmousedown=null;this.content1=null;this.content2Box=null;this.content2=null;delete RasterSplitter.all[this.id];RasterControl.prototype.dispose.call(this);};RasterSplitter.prototype.setResizable=function(isResizable)
{this.isResizable=isResizable;this.controlBox.style.cursor=isResizable?"":"default";return this;};RasterSplitter.prototype.setEventHandler=function(eventHandler)
{this.eventHandler=eventHandler;return this;};RasterSplitter.prototype.setContent=function(panelNo,content)
{var target=panelNo===1?this.content1:this.content2;if(content==null)
{if(target.firstChild!=null)
target.removeChild(target.firstChild);return this;}
var element=Raster.resolve(content);if(element!=null)
Raster.setParent(element,target,true);return this;};RasterSplitter.prototype.split=function(srcPanelNo,destPanelNo,alignment,size)
{var target=srcPanelNo===1?this.content1:this.content2;var content=target.firstChild;var splitter=new RasterSplitter(null,alignment);splitter.setParent(target,true);splitter.setSize(size);if(content!=null)
splitter.setContent(destPanelNo,content);return splitter;};RasterSplitter.prototype.splitTop=function(panelNo,size,newContent)
{var s=this.split(panelNo,2,'T',size);s.setContent(1,newContent);return s;};RasterSplitter.prototype.splitBottom=function(panelNo,size,newContent)
{var s=this.split(panelNo,2,'B',size);s.setContent(1,newContent);return s;};RasterSplitter.prototype.splitLeft=function(panelNo,size,newContent)
{var s=this.split(panelNo,2,'L',size);s.setContent(1,newContent);return s;};RasterSplitter.prototype.splitRight=function(panelNo,size,newContent)
{var s=this.split(panelNo,2,'R',size);s.setContent(1,newContent);return s;};RasterSplitter.prototype.setAlignment=function(alignment)
{alignment=(alignment||'L').toString().toUpperCase().charAt(0);this.alignment=/^[TRLB]$/i.test(alignment)?alignment.toUpperCase():'L';this.isVertical=false;switch(this.alignment)
{case'T':this.setClass("rasterSplitterT");this.content1.className="rasterSplitterPane1T";break;case'R':this.setClass("rasterSplitterR");this.isVertical=true;this.content1.className="rasterSplitterPane1R";break;case'B':this.setClass("rasterSplitterB");this.content1.className="rasterSplitterPane1B";break;default:this.setClass("rasterSplitterL");this.content1.className="rasterSplitterPane1L";this.isVertical=true;}
if(Raster.isIEQuirks&&!Raster.isIE6)
Raster.addClass(this.controlBox,"rasterSplitterQuirks");this.setSize(this.size);return this;};RasterSplitter.prototype.setSize=function(size)
{this.applySize(size,true);Raster.doLayout();return this;};RasterSplitter.prototype.applySize=function(size)
{var b=this.getBounds();this.size=size=Math.max(0,size||0);switch(this.alignment)
{case'T':size=Math.max(0,Math.min(size,b.height-RasterSplitter.THICKNESS));this.content1.style.height=size+"px";this.content2Box.style.marginTop=(size+RasterSplitter.THICKNESS)+"px";break;case'R':size=Math.max(0,Math.min(size,b.width-RasterSplitter.THICKNESS));this.content1.style.width=size+"px";this.content2Box.style.marginRight=(size+RasterSplitter.THICKNESS)+"px";break;case'B':size=Math.max(0,Math.min(size,b.height-RasterSplitter.THICKNESS));this.content1.style.height=size+"px";this.content2Box.style.marginBottom=(size+RasterSplitter.THICKNESS)+"px";break;default:size=Math.max(0,Math.min(size,b.width-RasterSplitter.THICKNESS));this.content1.style.width=size+"px";this.content2Box.style.marginLeft=(size+RasterSplitter.THICKNESS)+"px";}
if(Raster.isOp)
Raster.repaint(this.controlBox);};function RasterDialog(parent,icon,title,useIFrameBackdrop)
{RasterControl.call(this,parent||document.body);this.controlBox.innerHTML='<div class="rdModal"></div>'+'<div class="rasterShadowBox'+
(Raster.isIEQuirks?" rasterShadowBoxQuirks":"")+'">'+'<div class="rasterShadowBox0"></div>'+'<div class="rasterShadowBox1"></div>'+'<div class="rasterShadowBox2"></div>'+'<div class="rasterShadowBox3"></div>'+'</div>'+'<div class="rdCorner3"></div><div class="rdCorner4"></div>'+'<div class="rdCorner1"></div><div class="rdCorner2"></div>'+'<div class="rdClipBox">'+'<div class="rdContent"></div>'+'<div class="rdTitlebar">'+'<span class="rdIco"></span>'+'<span class="rdTitle"></span>'+'</div>'+'<div class="rdButtonbar">'+'<a href="#" onclick="return RasterDialog.buttonHandler(0,this,event)" class="rdMin"></a>'+'<a href="#" onclick="return RasterDialog.buttonHandler(1,this,event)" class="rdWin"></a>'+'<a href="#" onclick="return RasterDialog.buttonHandler(2,this,event)" class="rdMax"></a>'+'<a href="#" onclick="return RasterDialog.buttonHandler(3,this,event)" class="rdClose"></a>'+'</div>'+'</div>'+(!useIFrameBackdrop?"":'<iframe src="javascript: \'\'" style="position: absolute; width:100%; height:100%; margin:0; z-index:-1;" frameborder="0"></iframe>');this.setClass(Raster.isIEQuirks?"rasterDialog rasterDialogQuirks":"rasterDialog");this.isAutoCenter=false;this.canBeMoved=true;this.canBeResized=false;this.isModal=false;this.minWidth=null;this.minHeight=null;this.maxWidth=null;this.maxHeight=null;this.modalDiv=this.controlBox.childNodes[0];this.shadowDiv=this.controlBox.childNodes[1];this.contentDiv=this.controlBox.childNodes[6].childNodes[0];this.titlebar=this.controlBox.childNodes[6].childNodes[1];this.buttonbar=this.controlBox.childNodes[6].childNodes[2];this.iconSpan=this.titlebar.childNodes[0];this.titleSpan=this.titlebar.childNodes[1];this.minLink=this.buttonbar.childNodes[0];this.winLink=this.buttonbar.childNodes[1];this.maxLink=this.buttonbar.childNodes[2];this.closeLink=this.buttonbar.childNodes[3];this.controlBox.rasterDialog=this;var proxy={isProxy:true,instance:this};this.contentDiv.rasterDialog=proxy;this.buttonbar.rasterDialog=proxy;this.shadowDiv.rasterDialog=proxy;this.modalDiv.rasterDialog=proxy;this.controlBox.onmousedown=RasterDialog.mousedownHandler;this.controlBox.onmousemove=RasterDialog.mousemoveHandler;if(Raster.isIE)
{this.contentDiv.allowIESelection=true;this.controlBox.ondragstart=RasterDialog.ieSelectionHandler;this.controlBox.onselectstart=RasterDialog.ieSelectionHandler;}
this.eventHandler=null;this.setSize(100,100,true);this.moveTo(0,0);this.hide();this.setTitle(title);this.setIcon(icon);this.shadowDiv.style.left=(-RasterDialog.SHADOW_SIZE)+"px";this.shadowDiv.style.top=(-RasterDialog.SHADOW_SIZE)+"px";if(RasterDialog.dw==null)
this.computeContentSizeDifference();Raster.setOpacity(this.modalDiv,33);this.createIE6IframeBackdrop();this.id="dialog"+(Raster.idSequence++);RasterDialog.all[this.id]=this;this.zIndex=0;this.bringToFront();}
RasterDialog.SHADOW_SIZE=5;RasterDialog.all={};RasterDialog.buttons=["minimize","window","maximize","close"];RasterDialog.prototype.IID_DIALOG=true;Raster.implementIID(RasterDialog,RasterControl);RasterDialog.Z_INDEX=200;RasterDialog.doLayout=function()
{for(var id in RasterDialog.all)
RasterDialog.all[id].doLayout();};RasterDialog.buttonHandler=function(buttonNo,link,event)
{var el=Raster.srcElement(event);var dialog=Raster.findParentExpando(el,"rasterControl");link.blur();var dgEvent=null;if(dialog.eventHandler)
{dgEvent=RasterEvent.mkDialogEvent(event,RasterDialog.buttons[buttonNo],dialog,null);dialog.eventHandler(dgEvent);}
if(buttonNo==3&&(dgEvent==null||!dgEvent.isCancelled))
dialog.hide();return false;};RasterDialog.mousemoveHandler=function(event)
{var el=Raster.srcElement(event);var dialog=Raster.findParentExpando(el,"rasterDialog");if(dialog==null||dialog.isProxy)
return;var edge=RasterMouse.getNearestEdge(dialog.controlBox,event,6);if((edge==8&&!dialog.canBeMoved)||(edge!=8&&!dialog.canBeResized))
{dialog.controlBox.style.cursor="";return;}
RasterMouse.setDropBorderCursor(RasterMouse.RESIZE_CURSORS[edge]);dialog.controlBox.style.cursor=RasterMouse.RESIZE_CURSORS[edge];};RasterDialog.ieSelectionHandler=function(event)
{var el=Raster.srcElement(event);var allowIESelection=Raster.findParentExpando(el,"allowIESelection");return allowIESelection===true;};RasterDialog.mousedownHandler=function(event)
{var el=Raster.srcElement(event);var dialogs=Raster.findParentExpando(el,"rasterDialog",true);for(var i=0;i<dialogs.length;i++)
if(!dialogs[i].isProxy)
dialogs[i].bringToFront();var dialog=dialogs[0];if(dialog==null||dialog.isProxy)
{if(dialog!=null&&el==dialog.instance.modalDiv&&dialog.instance.eventHandler!=null)
{dialog.instance.eventHandler(RasterEvent.mkDialogEvent(event,"modal",dialog.instance,null));Raster.stopEvent(event);Raster.setActiveMenu(null);}
return;}
var mouse=Raster.getInputState(event);if(mouse.button!=1)
return;var edge=RasterMouse.getNearestEdge(dialog.controlBox,event,6);if(!dialog.canBeResized&&edge==1)
edge=8;Raster.stopEvent(event);Raster.setActiveMenu(null);if((edge==8&&!dialog.canBeMoved)||(edge!=8&&!dialog.canBeResized))
return;var bounds=dialog.getBounds();bounds.dialog=dialog;bounds.edge=edge;bounds.right=bounds.x+bounds.width;bounds.bottom=bounds.y+bounds.height;bounds.offsetX=mouse.x-bounds.x;bounds.offsetY=mouse.y-bounds.y;bounds.minWidth=dialog.minWidth||0;bounds.minHeight=dialog.minHeight||0;bounds.maxWidth=dialog.maxWidth||screen.width;bounds.maxHeight=dialog.maxHeight||screen.height;if(dialog.controlBox.parentNode==document.body)
{bounds.clip=Raster.getWindowBounds();bounds.clip.x=0;bounds.clip.y=0;bounds.clip.bottom=bounds.clip.height;bounds.clip.right=bounds.clip.width;}
else
{bounds.clip=Raster.getBounds(dialog.controlBox.parentNode);bounds.clip.bottom=bounds.clip.y+bounds.clip.height;bounds.clip.right=bounds.clip.x+bounds.clip.width;}
var evt=RasterMouse.startDrag(event,null,bounds,RasterDialog.dragHandler);if(edge!=8)
{evt.type="move";RasterDialog.dragHandler(evt);}
bounds.moved=false;};RasterDialog.dragHandler=function(evt)
{var bounds=evt.data;var clip=bounds.clip;var dialog=evt.data.dialog;var edge=evt.data.edge;var mouse=Raster.getInputState(evt.event);var box=bounds;switch(edge)
{case 8:box={x:Raster.clip(mouse.x-bounds.offsetX,clip.x-bounds.width+40,clip.right-50),y:Raster.clip(mouse.y-bounds.offsetY,clip.y-10,clip.bottom-30),width:bounds.width,height:bounds.height};break;case 0:mouse.x=Math.max(bounds.right-bounds.maxWidth,Math.min(Math.min(mouse.x,clip.right-50),bounds.right-bounds.minWidth));mouse.y=Math.max(bounds.bottom-bounds.maxHeight,Math.min(Raster.clip(mouse.y,clip.y,clip.bottom-30),bounds.bottom-bounds.minHeight));box=Raster.toRect(mouse.x-bounds.offsetX,mouse.y-bounds.offsetY,bounds.right,bounds.bottom);break;case 1:mouse.y=Math.max(bounds.bottom-bounds.maxHeight,Math.min(Raster.clip(mouse.y,clip.y,clip.bottom-30),bounds.bottom-bounds.minHeight));box=Raster.toRect(bounds.x,mouse.y-bounds.offsetY,bounds.right,bounds.bottom);break;case 2:mouse.x=Math.min(bounds.x+bounds.maxWidth,Math.max(Math.max(mouse.x,clip.x+30),bounds.x+bounds.minWidth));mouse.y=Math.max(bounds.bottom-bounds.maxHeight,Math.min(Raster.clip(mouse.y,clip.y,clip.bottom-30),bounds.bottom-bounds.minHeight));box=Raster.toRect(mouse.x-bounds.offsetX+bounds.width,mouse.y-bounds.offsetY,bounds.x,bounds.bottom);break;case 3:mouse.x=Math.min(bounds.x+bounds.maxWidth,Math.max(Math.max(mouse.x,clip.x+30),bounds.x+bounds.minWidth));box=Raster.toRect(mouse.x-bounds.offsetX+bounds.width,bounds.y,bounds.x,bounds.bottom);break;case 4:mouse.x=Math.min(bounds.x+bounds.maxWidth,Math.max(Math.max(mouse.x,clip.x+30),bounds.x+bounds.minWidth));mouse.y=Math.min(bounds.y+bounds.maxHeight,Math.max(mouse.y,bounds.y+bounds.minHeight));box=Raster.toRect(bounds.x,bounds.y,mouse.x-bounds.offsetX+bounds.width,mouse.y-bounds.offsetY+bounds.height);break;case 5:mouse.y=Math.min(bounds.y+bounds.maxHeight,Math.max(mouse.y,bounds.y+bounds.minHeight));box=Raster.toRect(bounds.x,bounds.y,bounds.right,mouse.y-bounds.offsetY+bounds.height);break;case 6:mouse.x=Math.max(bounds.right-bounds.maxWidth,Math.min(Math.min(mouse.x,clip.right-50),bounds.right-bounds.minWidth));mouse.y=Math.min(bounds.y+bounds.maxHeight,Math.max(mouse.y,bounds.y+bounds.minHeight));box=Raster.toRect(bounds.right,bounds.y,mouse.x-bounds.offsetX,mouse.y-bounds.offsetY+bounds.height);break;case 7:mouse.x=Math.max(bounds.right-bounds.maxWidth,Math.min(Math.min(mouse.x,clip.right-50),bounds.right-bounds.minWidth));box=Raster.toRect(mouse.x-bounds.offsetX,bounds.y,bounds.right,bounds.bottom);break;}
if(evt.type=="move")
bounds.moved=true;RasterMouse.showDropBorder(box.x,box.y,box.width,box.height);if(evt.type=="up"&&bounds.moved===true)
{var dgEvent=null;if(dialog.eventHandler)
{dgEvent=RasterEvent.mkDialogEvent(evt.event,edge==8?"move":"resize",dialog,box);dialog.eventHandler(dgEvent);}
if(dgEvent==null||!dgEvent.isCancelled)
{var local=Raster.pointToElement(dialog.controlBox.parentNode,box.x,box.y);dialog.moveTo(local.x,local.y);dialog.setSize(box.width,box.height,true);}
Raster.doLayout();}};RasterDialog.prototype.bringToFront=function()
{if(this.zIndex==RasterDialog.Z_INDEX)
return;var temp=[];for(var id in RasterDialog.all)
{var dialog=RasterDialog.all[id];if(this.controlBox.parentNode==dialog.controlBox.parentNode)
{dialog.zIndex--;temp.push(dialog);}}
this.zIndex=RasterDialog.Z_INDEX;temp.sort(function(d1,d2){return d2.zIndex-d1.zIndex;});for(var i=0;i<temp.length;i++)
{temp[i].zIndex=RasterDialog.Z_INDEX-i;temp[i].controlBox.style.zIndex=temp[i].zIndex;}};RasterDialog.prototype.doLayout=function()
{if(this.isAutoCenter)
this.center();if(this.isModal)
{this.setModal(true);if(Raster.isIE&&this.controlBox.parentNode==document.body)
{this.setModal(false);var dialog=this;setTimeout(function(){dialog.setModal(true);},10);}}};RasterDialog.prototype.computeContentSizeDifference=function()
{var rect=this.getBounds();RasterDialog.dw=rect.width-this.contentDiv.clientWidth;RasterDialog.dh=rect.height-this.contentDiv.clientHeight;};RasterDialog.prototype.dispose=function()
{this.controlBox.rasterDialog=null;this.contentDiv.rasterDialog=null;this.buttonbar.rasterDialog=null;this.shadowDiv.rasterDialog=null;this.modalDiv.rasterDialog=null;this.contentDiv=null;this.titlebar=null;this.buttonbar=null;this.shadowDiv=null;this.modalDiv=null;this.iconSpan=null;this.titleSpan=null;this.minLink=null;this.winLink=null;this.maxLink=null;this.closeLink=null;this.eventHandler=null;this.controlBox.onmousedown=null;this.controlBox.onmousemove=null;if(this.sprite)
this.sprite.dispose();delete RasterDialog.all[this.id];RasterControl.prototype.dispose.call(this);};RasterDialog.prototype.getContentElement=function()
{return this.contentDiv;};RasterDialog.prototype.setModal=function(isModal)
{this.isModal=isModal;if(isModal)
{this.modalDiv.style.display="none";if(this.iframeBackground!=null)
{this.iframeBackground.style.display="none";this.shadowDiv.style.display="none";}
var w,h;if(this.controlBox.parentNode==document.body)
{var win=Raster.getWindowBounds();w=Math.max(document.documentElement.scrollWidth,Math.max(document.body.scrollWidth,Raster.isOp?win.width:0));h=Math.max(document.documentElement.scrollHeight,Math.max(document.body.scrollHeight,Raster.isOp?win.height:0));if(Raster.isIEQuirks)
{w=Math.max(document.body.scrollWidth,win.width);h=Math.max(document.body.scrollHeight,win.height);}}
else
{w=this.controlBox.parentNode.scrollWidth;h=this.controlBox.parentNode.scrollHeight;}
this.modalDiv.style.left=(-this._x)+"px";this.modalDiv.style.top=(-this._y)+"px";this.modalDiv.style.width=w+"px";this.modalDiv.style.height=h+"px";this.modalDiv.style.display="block";if(this.iframeBackground!=null)
{this.iframeBackground.style.left=(-this._x)+"px";this.iframeBackground.style.top=(-this._y)+"px";this.iframeBackground.style.width=w+"px";this.iframeBackground.style.height=h+"px";this.iframeBackground.style.display="block";}}
else
{this.modalDiv.style.left="";this.modalDiv.style.top="";this.modalDiv.style.width="";this.modalDiv.style.height="";if(this.iframeBackground!=null)
{this.iframeBackground.style.left="";this.iframeBackground.style.top="";this.iframeBackground.style.width="";this.iframeBackground.style.height="";this.shadowDiv.style.display="block";}}
return this;};RasterDialog.prototype.moveTo=function(x,y)
{RasterControl.prototype.moveTo.call(this,x,y);if(this.isModal)
this.setModal(true);return this;};RasterDialog.prototype.setSize=function(width,height,isOuterSize)
{if(isOuterSize!==true)
{width+=RasterDialog.dw;height+=RasterDialog.dh;}
RasterControl.prototype.setSize.call(this,width,height);this.shadowDiv.style.width=(width+RasterDialog.SHADOW_SIZE*2)+"px";this.shadowDiv.style.height=(height+RasterDialog.SHADOW_SIZE*2)+"px";return this;};RasterDialog.prototype.setMinSize=function(width,height,isOuterSize)
{if(isOuterSize!==true)
{width+=RasterDialog.dw;height+=RasterDialog.dh;}
this.minHeight=height;this.minWidth=width;return this;};RasterDialog.prototype.setMaxSize=function(width,height,isOuterSize)
{if(isOuterSize!==true)
{width+=RasterDialog.dw;height+=RasterDialog.dh;}
this.maxHeight=height;this.maxWidth=width;return this;};RasterDialog.prototype.setAutoCenter=function(isAutoCenter)
{this.isAutoCenter=isAutoCenter||false;return this;};RasterDialog.prototype.setMovable=function(canBeMoved)
{this.canBeMoved=canBeMoved;return this;};RasterDialog.prototype.setResizable=function(canBeResized)
{this.canBeResized=canBeResized;return this;};RasterDialog.prototype.center=function()
{var win=Raster.getWindowBounds();var b=this.getBounds();var x=Math.max(0,(win.width-b.width)/2);var y=Math.max(0,(win.height-b.height)/2);this.moveTo(x,y);return this;};RasterDialog.prototype.show=function()
{this.setVisible(true);this.bringToFront();if(this.isAutoCenter)
this.center();return this;};RasterDialog.prototype.showAt=function(x,y)
{this.moveTo(x,y);this.show();return this;};RasterDialog.prototype.hide=function()
{this.setVisible(false);return this;};RasterDialog.prototype.setTitle=function(title)
{this.title=title;this.titleSpan.innerHTML=title||"";this.titleSpan.style.display=(title!=null)?"":"none";return this;};RasterDialog.prototype.setButtons=function(min,win,max,close)
{this.minLink.style.display=min?"":"none";this.winLink.style.display=win?"":"none";this.maxLink.style.display=max?"":"none";this.closeLink.style.display=close?"":"none";return this;};RasterDialog.prototype.setIcon=function(icon)
{this.icon=icon;if(icon!=null)
if(this.sprite==null)
{this.sprite=new RasterSprite(icon,16,16);this.sprite.setParent(this.iconSpan);}
else
this.sprite.setImage(icon);this.iconSpan.style.display=(icon!=null)?"":"none";return this;};RasterDialog.prototype.showBackground=function(isVisible)
{if(isVisible)
Raster.removeClass(this.contentDiv,"rdContentNoBgBorder");else
Raster.addClass(this.contentDiv,"rdContentNoBgBorder");return this;};RasterDialog.prototype.showShadow=function(isVisible)
{this.shadowDiv.style.display=isVisible?"":"none";return this;};RasterDialog.prototype.setEventHandler=function(eventHandler)
{this.eventHandler=eventHandler;return this;};function RasterTreeItem(parentItem,icon,text,value,isRoot)
{this.id="ti"+(Raster.idSequence++);this.isRoot=isRoot===true;this.parentItem=this.isRoot?null:parentItem;this.tree=this.isRoot?parentItem:parentItem.tree;this.level=this.isRoot?0:this.parentItem.level+1;this.isEnabled=true;this.isSelectable=true;this.isAutoToggle=false;this.isCollapsable=true;this.isSelected=false;this.isExpanded=false;this.isHeader=false;this.text=text;this.icon=icon;this.altIcon=null;this.value=value;this.items={};RasterControl.call(this,this.isRoot?parentItem.rootContainer:parentItem.childrenDiv);this.setClass("rasterTreeItem");this.controlBox.treeItem=this;this.controlBox.innerHTML="<div class='rasterTreeItemVline'></div>"+"<div class='rasterTreeItemLabel' onmousedown='RasterTree.clickHandler(event)' "+"onmouseup='RasterTree.upHandler(event)' ondblclick='RasterTree.dblclickHandler(event)'>"+"<span class='rasterTreeItemLabelToggle'>"+"<span class='rasterTreeItemLabelDash'></span>"+"</span>"+"<span class='rasterTreeItemLabelIco'></span>"+"<a href='#'>"+"<span class='rasterBkleft'></span>"+"<span class='rasterBkright'></span>"+"<span class='rasterItemTxt'></span>"+"</a>"+"</div>"+"<div class='rasterTreeItemChildren'></div>";this.vlineDiv=this.controlBox.firstChild;this.labelDiv=this.controlBox.childNodes[1];this.toggleSpan=this.labelDiv.childNodes[0];this.toggleIcoSpan=this.toggleSpan.firstChild;this.iconSpan=this.labelDiv.childNodes[1];this.iconLink=this.labelDiv.childNodes[2];this.childrenDiv=this.controlBox.lastChild;this.iconLink.onclick=Raster.stopEvent;this.textSpan=this.iconLink.lastChild;this.eventHandler=null;this.setDropHandler(RasterTree.dragDropHandler);if(!this.isRoot)
{this.parentItem.items[this.id]=this;this.tree.allItems[this.id]=this;}
this.setText(text);this.setIcon(icon);this.updateStyle();this.updateLevel();}
RasterTreeItem.prototype.IID_TREEITEM=true;Raster.implementIID(RasterTreeItem,RasterControl);RasterTreeItem.prototype.toString=function()
{return this.text;};RasterTreeItem.prototype.indent=function(isIndented)
{this.childrenDiv.style.paddingLeft=isIndented?"":"5px";this.toggleSpan.style.display=isIndented?"":"none";this.vlineDiv.style.left=isIndented?"":"10px";};RasterTreeItem.prototype.showRoot=function(isRootVisible)
{this.isRootVisible=isRootVisible;this.labelDiv.style.display=isRootVisible?"":"none";this.childrenDiv.style.paddingLeft=isRootVisible?"5px":"0";this.vlineDiv.style.display=isRootVisible?"":"none";for(var id in this.items)
this.items[id].indent(isRootVisible);if(isRootVisible)
this.updateStyle();};RasterTreeItem.prototype.updateLevel=function()
{this.level=this.isRoot?0:this.parentItem.level+1;for(var id in this.items)
this.items[id].updateLevel();this.indent(this.level>1||(this.level==1&&this.tree.isRootVisible));};RasterTreeItem.prototype.updateStyle=function(heightChanged)
{if(!this.isEnabled)
this.iconLink.className="rasterTreeItemDisabled";else if(this.isSelected)
this.iconLink.className="rasterTreeItemSelected";else
this.iconLink.className="";if(this.isHeader)
this.iconLink.className+=" rasterTreeItemHeader";if(!this.hasChildren())
{this.toggleIcoSpan.className="rasterTreeItemLabelDash";this.vlineDiv.style.display="none";this.childrenDiv.style.display="none";}
else if(this.isExpanded)
{this.toggleIcoSpan.className=this.isCollapsable?"rasterTreeItemLabelMinus":"rasterTreeItemLabelDash";if(!this.isRoot||(this.isRoot&&this.isRootVisible))
this.vlineDiv.style.display="block";this.childrenDiv.style.display="block";this.vlineDiv.style.height=Math.max(0,this.childrenDiv.lastChild.offsetTop-10)+"px";}
else
{this.toggleIcoSpan.className=this.isCollapsable?"rasterTreeItemLabelPlus":"rasterTreeItemLabelDash";this.vlineDiv.style.display="none";this.childrenDiv.style.display="none";}
if(heightChanged===true&&this.parentItem!=null)
this.parentItem.updateStyle(true);};RasterTreeItem.prototype.markSelected=function(isSelected)
{this.isSelected=isSelected;this.updateStyle();return this;};RasterTreeItem.prototype.dispose=function()
{this.removeAll();if(this.isSelected)
this.tree.unselectItem(this);if(!this.isRoot)
{delete this.parentItem.items[this.id];delete this.tree.allItems[this.id];}
this.items=null;this.controlBox.treeItem=null;this.vlineDiv=null;this.toggleSpan=null;this.toggleIcoSpan=null;this.iconSpan=null;this.iconLink.onclick=null;this.iconLink=null;this.childrenDiv=null;this.textSpan=null;this.labelDiv=null;this.eventHandler=null;if(this.sprite)
this.sprite.dispose();RasterControl.prototype.dispose.call(this);};RasterTreeItem.prototype.remove=function()
{this.dispose();if(this.parentItem!=null)
this.parentItem.updateStyle(true);return this;};RasterTreeItem.prototype.removeAll=function()
{var temp=new Array();for(var id in this.items)
temp.push(this.items[id]);for(var i=0;i<temp.length;i++)
temp[i].dispose();this.updateStyle(this.isExpanded);return this;};RasterTreeItem.prototype.getChildren=function()
{var temp=new Array();for(var i=0;i<this.childrenDiv.childNodes.length;i++)
temp.push(this.childrenDiv.childNodes[i].treeItem);return temp;};RasterTreeItem.prototype.getItems=function(temp)
{if(temp!=null)
temp.push(this);else
temp=[];var childs=this.childrenDiv.childNodes;for(var i=0;i<childs.length;i++)
if(childs[i].treeItem.hasChildren())
childs[i].treeItem.getItems(temp);else
temp.push(childs[i].treeItem);return temp;};RasterTreeItem.prototype.scrollIntoView=function()
{var item=this;while((item=item.parentItem)!=null)
item.setExpanded(true);this.controlBox.scrollIntoView();return this;};RasterTreeItem.prototype.isAncestorOf=function(item)
{if(item.level>this.level)
while((item=item.parentItem)!=null)
if(item==this)
return true;return false;};RasterTreeItem.prototype.isFirst=function()
{return this.controlBox.previousSibling!=null;};RasterTreeItem.prototype.isLast=function()
{return this.controlBox.nextSibling!=null;};RasterTreeItem.prototype.getPreviousItem=function()
{return this.controlBox.previousSibling!=null?this.controlBox.previousSibling.rasterControl:null;};RasterTreeItem.prototype.getNextItem=function()
{return this.controlBox.nextSibling!=null?this.controlBox.nextSibling.rasterControl:null;};RasterTreeItem.prototype.moveUp=function()
{var sibling=this.getPreviousItem();if(sibling!=null)
{var sy=this.tree.rootContainer.scrollTop;this.tree.setDisplay(false);Raster.setSibling(this.controlBox,sibling,false);this.tree.setDisplay(true);this.tree.rootContainer.scrollTop=sy;}
this.parentItem.updateStyle(true);return this;};RasterTreeItem.prototype.moveDown=function()
{var sibling=this.getNextItem();if(sibling!=null)
{var sy=this.tree.rootContainer.scrollTop;this.tree.setDisplay(false);Raster.setSibling(this.controlBox,sibling,true);this.tree.setDisplay(true);this.tree.rootContainer.scrollTop=sy;}
this.parentItem.updateStyle(true);return this;};RasterTreeItem.prototype.setSiblingItem=function(sibling,after)
{if(this.isAncestorOf(sibling)||sibling.tree!=this.tree)
return this;var oldParent=this.parentItem;delete oldParent.items[this.id];sibling.parentItem.items[this.id]=this;this.parentItem=sibling.parentItem;var sy=this.tree.rootContainer.scrollTop;this.tree.setDisplay(false);Raster.setSibling(this.controlBox,sibling.controlBox,after);this.tree.setDisplay(true);this.tree.rootContainer.scrollTop=sy;this.updateLevel();sibling.parentItem.updateStyle(sibling.parentItem.isExpanded);oldParent.updateStyle(oldParent.isExpanded);return this;};RasterTreeItem.prototype.setParentItem=function(parent)
{if(this.isAncestorOf(parent)||parent.tree!=this.tree)
return this;var oldParent=this.parentItem;delete oldParent.items[this.id];parent.items[this.id]=this;this.parentItem=parent;var sy=this.tree.rootContainer.scrollTop;this.tree.setDisplay(false);Raster.setParent(this.controlBox,parent.childrenDiv);this.tree.setDisplay(true);this.tree.rootContainer.scrollTop=sy;this.updateLevel();parent.updateStyle(parent.isExpanded||Raster.isIE6||Raster.isIEQuirks);oldParent.updateStyle(oldParent.isExpanded);return this;};RasterTreeItem.prototype.hasChildren=function()
{return this.childrenDiv.childNodes.length>0;};RasterTreeItem.prototype.setAutoToggle=function(isAutoToggle)
{this.isAutoToggle=isAutoToggle;return this;};RasterTreeItem.prototype.setSelectable=function(isSelectable)
{if(this.isSelected&&!isSelectable)
this.tree.unselectItem(this);this.isSelectable=isSelectable;return this;};RasterTreeItem.prototype.setCollapsable=function(isCollapsable)
{this.isCollapsable=isCollapsable;if(this.isExpanded)
this.updateStyle();else
this.expand();return this;};RasterTreeItem.prototype.setHeader=function(isHeader)
{this.isHeader=isHeader;this.updateStyle();return this;};RasterTreeItem.prototype.applyClass=function(cssClass)
{this.textSpan.className=cssClass||"";return this;};RasterTreeItem.prototype.setEnabled=function(isEnabled)
{if(this.isSelected)
this.tree.unselectItem(this);this.isEnabled=isEnabled;if(this.icon!=null)
this.sprite.setOpacity(isEnabled?100:33);this.updateStyle();return this;};RasterTreeItem.prototype.setExpanded=function(isExpanded)
{if(this.isExpanded==isExpanded)
return this;this.isExpanded=isExpanded;if(this.icon!=null&&this.altIcon!=null)
this.sprite.setImage(this.isExpanded?this.altIcon:this.icon);this.updateStyle(true);return this;};RasterTreeItem.prototype.expand=function()
{this.setExpanded(true);return this;};RasterTreeItem.prototype.collapse=function()
{this.setExpanded(false);return this;};RasterTreeItem.prototype.toggle=function()
{this.setExpanded(!this.isExpanded);return this;};RasterTreeItem.prototype.setText=function(text)
{this.text=text;this.textSpan.innerHTML=text||"&nbsp;";return this;};RasterTreeItem.prototype.setAltIcon=function(altIcon)
{this.altIcon=altIcon;if(this.icon!=null&&this.isExpanded)
this.sprite.setImage(altIcon||this.icon);return this;};RasterTreeItem.prototype.setIcon=function(icon)
{this.icon=icon;if(icon!=null)
if(this.sprite==null)
{this.sprite=new RasterSprite(icon,16,16);this.sprite.setParent(this.iconSpan);}
else
this.sprite.setImage(icon);this.iconSpan.style.display=(icon!=null)?"":"none";return this;};RasterTreeItem.prototype.select=function(add,range)
{this.tree.selectItem(this,add,range);return this;};RasterTreeItem.prototype.unselect=function()
{this.tree.unselectItem(this);return this;};RasterTreeItem.prototype.add=function(icon,text,value)
{var item=new RasterTreeItem(this,icon,text,value);this.updateStyle(this.isExpanded);return item;};function RasterTree(parent,icon,text)
{this.rootContainer=document.createElement("DIV");this.rootContainer.className=Raster.isIEQuirks?"rasterTree rasterTreeQuirks":"rasterTree";Raster.setParent(this.rootContainer,parent,true);this.allItems={};this.selectedItems=new Array();this.isDnD=false;this.isMultiSelect=false;this.isRootVisible=true;this.linesVisible=true;this.eventHandler=null;RasterTreeItem.call(this,this,icon,text,"rastreeroot"+(Raster.idSequence++),true);this.setExpanded(true);this.setHeader(true);this.indent(false);}
RasterTree.prototype.IID_TREE=true;Raster.implementIID(RasterTree,RasterTreeItem);RasterTree.dblclickHandler=function(event)
{RasterTree.clickHandler(event,true);};RasterTree.upHandler=function(event)
{var el=Raster.srcElement(event);var treeItem=Raster.findParentExpando(el,"treeItem");if(treeItem==null)
return;var tree=treeItem.tree;if(tree.mousedownItem==treeItem&&treeItem.isEnabled&&treeItem.isSelectable)
treeItem.select();};RasterTree.prototype.getDragContext=function(mouseEvt)
{var dragContext=mouseEvt.context[this.id];if(!dragContext)
{dragContext={ticker:0,ticksOverItem:0,lastHoverItem:null,bounds:Raster.getBounds(this.rootContainer),isBeforeDrag:true,tree:this};mouseEvt.context[this.id]=dragContext;}
return dragContext;};RasterTree.clickHandler=function(event,isDblClick)
{var el=Raster.srcElement(event);var treeItem=Raster.findParentExpando(el,"treeItem");Raster.stopEvent(event);Raster.setActiveMenu(null);if(treeItem==null)
return;var mouse=Raster.getInputState(event);var isToggle=(el==treeItem.toggleSpan||el==treeItem.toggleIcoSpan);var tree=treeItem.tree;tree.mousedownItem=null;if(isToggle&&(!treeItem.isCollapsable||!treeItem.hasChildren()))
return;var treeEvent=null;if(tree.eventHandler!=null)
{var type=isToggle?(treeItem.isExpanded?"collapse":"expand"):(isDblClick===true?"dblclick":(mouse.button==1?"click":"context"));treeEvent=RasterEvent.mkTreeEvent(event,type,tree,treeItem,null);tree.eventHandler(treeEvent);}
if(isDblClick===true||(treeEvent&&treeEvent.isCancelled))
return;if(treeItem.isCollapsable&&(isToggle||treeItem.isAutoToggle))
treeItem.toggle();if(!isToggle&&treeItem.isEnabled&&treeItem.isSelectable)
{if(treeItem.isSelected&&!mouse.ctrl&&!mouse.shift)
tree.mousedownItem=treeItem;else
treeItem.select(mouse.ctrl,mouse.shift);}
if(tree.isDnD&&mouse.button==1&&treeItem.isSelectable&&treeItem.isEnabled)
{RasterMouse.setCursor(CURSORS.DRAG);RasterMouse.startDrag(event,treeItem,null,null,true);}};RasterTree.dragDropHandler=function(mouseEvt)
{var treeItem=mouseEvt.control;var dragValue=mouseEvt.value;var evtType=mouseEvt.type;var tree=treeItem.tree;if(!tree.isDnD||evtType=="cancel"||dragValue==null)
return;var bounds=Raster.getBounds(treeItem.iconLink);var data=tree.getDragContext(mouseEvt);var isLocal=dragValue.IID_TREEITEM&&(dragValue.tree==tree);var treeEvent=null;if(evtType=="enter")
{data.ticksOverItem=0;data.lastHoverItem=treeItem;evtType="over";}
else if(evtType=="out")
{data.lastHoverItem=null;return;}
if(data.isBeforeDrag)
{data.isBeforeDrag=false;if(isLocal&&tree.eventHandler!=null)
{treeEvent=RasterEvent.mkTreeEvent(mouseEvt.event,"beforemove",tree,dragValue,dragValue,null);tree.eventHandler(treeEvent);}
if(treeEvent!=null&&treeEvent.isCancelled)
{RasterMouse.cancelDrag();return;}
tree.rootContainer.scrollLeft=0;RasterMouse.addTimerListener(RasterTree.dragAutoScrollExpandHandler,data);}
RasterMouse.showDropBorderOver(null);RasterMouse.showDropLine(null);if(dragValue==treeItem)
return;var edge=treeItem.isRoot?8:RasterMouse.getNearestEdgeV(treeItem.labelDiv,mouseEvt.event,bounds.height/3);var position=edge==5?"after":(edge==1?"before":"over");treeEvent=null;if(tree.eventHandler!=null&&(evtType=="over"||(evtType=="drop"&&data.position!=null)))
{treeEvent=RasterEvent.mkTreeEvent(mouseEvt.event,evtType,tree,treeItem,dragValue,(evtType=="over"?position:data.position));tree.eventHandler(treeEvent);}
if(evtType=="over"&&treeEvent&&treeEvent.acceptPosition)
{position=data.position=treeEvent.acceptPosition;var width=Math.min(Math.abs(data.bounds.x+data.bounds.width-bounds.x),data.bounds.width-20);var x=Math.max(data.bounds.x,bounds.x-20);if(position=="after")
RasterMouse.showDropLine(x,bounds.y+bounds.height,false,width);else if(position=="before")
RasterMouse.showDropLine(x,bounds.y,false,width);else
{var box=Raster.toRect(bounds.x,Math.max(bounds.y,data.bounds.y),Math.min(bounds.x+bounds.width,data.bounds.x+data.bounds.width-20),Math.min(bounds.y+bounds.height,data.bounds.y+data.bounds.height));RasterMouse.showDropBorder(box.x,box.y,box.width,box.height);}}
else if(evtType!="drop")
{data.position=null;}
if(evtType=="drop"&&isLocal&&data.position&&(treeEvent&&!treeEvent.isCancelled))
{if(data.position=="before")
tree.moveItemsBefore(tree.selectedItems,treeItem);else if(data.position=="after")
tree.moveItemsAfter(tree.selectedItems,treeItem);else
tree.moveItemsTo(tree.selectedItems,treeItem);}};RasterTree.dragAutoScrollExpandHandler=function(mouseEvt,data)
{var container=data.tree.rootContainer;var bounds=data.bounds;var scrollmax=Math.max(0,container.scrollHeight-container.clientHeight);var scrollTop=container.scrollTop;if(container.scrollHeight>bounds.height)
{if(Math.abs(mouseEvt.y-bounds.y)<=20&&container.scrollTop>0)
container.scrollTop=Math.max(0,container.scrollTop-20);else if(Math.abs(bounds.y+bounds.height-mouseEvt.y)<=20)
container.scrollTop=Math.min(scrollmax,container.scrollTop+20);}
if(scrollTop!=container.scrollTop)
{RasterMouse.showDropBorder(null);RasterMouse.showDropLine(null);return;}
data.ticksOverItem++;if(data.ticksOverItem==3&&data.lastHoverItem!=null&&data.lastHoverItem.isEnabled&&data.lastHoverItem.hasChildren()&&!data.lastHoverItem.isExpanded)
data.lastHoverItem.expand();};RasterTree.prototype.dispose=function()
{RasterTreeItem.prototype.dispose.call(this);if(this.rootContainer.parentNode)
this.rootContainer.parentNode.removeChild(this.rootContainer);this.rootContainer=null;};RasterTree.prototype.remove=function()
{return this;};RasterTree.prototype.showLines=function(linesVisible)
{this.linesVisible=linesVisible;if(linesVisible)
Raster.removeClass(this.rootContainer,"rasterTreeNolines");else
Raster.addClass(this.rootContainer,"rasterTreeNolines");return this;};RasterTree.prototype.setDragDrop=function(isDnD)
{this.isDnD=isDnD;return this;};RasterTree.prototype.setMultiSelect=function(isMultiSelect)
{this.isMultiSelect=isMultiSelect;return this;};RasterTree.prototype.clear=function()
{for(var i=0;i<this.tree.selectedItems.length;i++)
this.selectedItems[i].markSelected(false);this.selectedItems.splice(0,this.selectedItems.length);return this;};RasterTree.prototype.expandAll=function()
{for(var id in this.allItems)
if(this.allItems[id].hasChildren())
this.allItems[id].expand();return this;};RasterTree.prototype.collapseAll=function()
{for(var id in this.allItems)
if(this.allItems[id].hasChildren())
this.allItems[id].collapse();return this;};RasterTree.prototype.getItemByValue=function(value)
{for(var id in this.allItems)
if(this.allItems[id].value==value)
return this.allItems[id];return null;};RasterTree.prototype.unselectItem=function(item)
{if(item==null||!item.IID_TREEITEM)
item=this.getItemByValue(item);if(item!=null)
for(var i=0;i<this.tree.selectedItems.length;i++)
if(item==this.selectedItems[i])
{this.selectedItems.splice(i,1);item.markSelected(false);break;}
return this;};RasterTree.prototype.selectItem=function(item,add,range)
{if(!this.isMultiSelect)
add=range=null;if(item==null||!item.IID_TREEITEM)
item=this.getItemByValue(item);if(add!==true)
this.clear();if(item!=null&&item.isEnabled&&item.isSelectable)
{if(add===true&&item.isSelected)
item.unselect();else
{item.markSelected(true);this.selectedItems.push(item);}}
return this;};RasterTree.prototype.getSelectedItems=function()
{return this.selectedItems.slice(0);};RasterTree.prototype.getSelectedItem=function()
{return this.selectedItems.length==0?null:this.selectedItems[this.selectedItems.length-1];};RasterTree.prototype.hasSelection=function()
{return this.selectedItems.length>0;};RasterTree.prototype.removeSelectedItems=function()
{this.removeItems(this.getSelectedItems());return this;};RasterTree.prototype.removeItems=function(items)
{if(items.IID_TREEITEM)
items.remove();else
{var arr=items.slice(0);arr.sort(function(a,b){return b.level-a.level;});for(var i=0;i<arr.length;i++)
arr[i].remove();}
return this;};RasterTree.prototype.setEventHandler=function(eventHandler)
{this.eventHandler=eventHandler;return this;};RasterTree.prototype.moveItemsBefore=function(items,sibling)
{this.moveItems(items,sibling,'b');return this;};RasterTree.prototype.moveItemsAfter=function(items,sibling)
{this.moveItems(items,sibling,'a');return this;};RasterTree.prototype.moveItemsTo=function(items,parent)
{this.moveItems(items,parent,'c');return this;};RasterTree.prototype.moveItems=function(items,refItem,chHow)
{if(items==refItem)
return;if(items.IID_TREEITEM)
items=[items];var i;if(chHow=='c')
{for(i=0;i<items.length;i++)
items[i].setParentItem(refItem);}
else
{var isAfter=(chHow=='a');for(i=0;i<items.length;i++)
{items[i].setSiblingItem(refItem,isAfter);refItem=items[i];isAfter=true;}}};function RasterListItem(listControl,index,icon,icon32,thumbnail,data,value)
{this.index=index;this.listControl=listControl;this.data=Raster.isArray(data)?data.slice(0):[data];this.text=this.data[0];this.icon=icon;this.icon32=icon32;this.thumbnail=thumbnail;this.value=value;this.isEnabled=true;this.isSelected=false;}
RasterListItem.prototype.IID_LISTITEM=true;RasterListItem.prototype.getItemElement=function()
{if(this.listControl.isTable)
return this.listControl.dataBody.rows[this.index];else
return this.listControl.contentDiv.childNodes[this.index];};RasterListItem.prototype.updateStyle=function()
{var container=this.getItemElement();if(container==null)
return;var cssClass=!this.isEnabled?"rasterListItemDisabled":(this.isSelected?"rasterListItemSelected":"");var list=this.listControl;if(list.isList)
container.childNodes[1].className=cssClass;else if(list.isGrid)
container.firstChild.className=cssClass;else if(list.isThumbs)
container.firstChild.className=cssClass;else if(list.isTable)
{container.className=(this.listControl.isAltRows&&this.index%2==0?"rasterTableListAltRow ":"")+cssClass;if(Raster.isOp)
Raster.repaint(container);}};RasterListItem.prototype.markSelected=function(isSelected)
{this.isSelected=isSelected;this.updateStyle();return this;};RasterListItem.prototype.setEnabled=function(isEnabled)
{if(!isEnabled&&this.isSelected)
this.listControl.unselectItem(this);this.isEnabled=isEnabled;this.updateStyle();this.updateIcon();return this;};RasterListItem.prototype.select=function(replace,inRange)
{this.listControl.selectItem(this,replace,inRange);return this;};RasterListItem.prototype.unselect=function()
{this.listControl.unselectItem(this);return this;};RasterListItem.prototype.setText=function(text)
{this.text=text;this.setData(0,text);return this;};RasterListItem.prototype.setData=function(dataIdx,value)
{this.data[dataIdx]=value;var container=this.getItemElement();if(container==null)
return this;var list=this.listControl;value=RasterStrings.formatDate(value||"&nbsp;");if(list.isList&&dataIdx==0)
container.childNodes[1].lastChild.innerHTML=value+"";else if(list.isGrid&&dataIdx==0)
container.firstChild.lastChild.innerHTML=value+"";else if(list.isThumbs&&dataIdx==0)
container.firstChild.lastChild.innerHTML=value+"";else if(list.isTable&&list.data2Col&&list.data2Col[dataIdx]<container.cells.length)
{var colno=list.data2Col[dataIdx];var cellContent=Raster.isIE?container.cells[colno].firstChild:container.cells[colno];if(colno==0)
cellContent.lastChild.innerHTML=value+"";else
cellContent.innerHTML=value+"";}
return this;};RasterListItem.prototype.updateIcon=function()
{var el=this.getItemElement();if(el==null)
return this;var list=this.listControl;if(list.isList)
el.innerHTML=this.listItemHtml(true);else if(list.isGrid)
el.innerHTML=this.gridItemHtml(true);else if(list.isThumbs)
el.innerHTML=this.thumbItemHtml(true);else if(list.isTable&&list.columns&&list.columns.length>0)
{var sprite=Raster.isIE?el.cells[0].firstChild.firstChild.firstChild:el.cells[0].firstChild.firstChild;RasterSprite.setImage(sprite,this.icon,16,16);RasterSprite.setOpacity(sprite,this.isEnabled?100:33);}
return this;};RasterListItem.prototype.setIcon=function(icon)
{this.icon=icon;this.updateIcon();return this;};RasterListItem.prototype.setIcon32=function(icon32)
{this.icon32=icon32;this.updateIcon();return this;};RasterListItem.prototype.setThumbnail=function(thumbnail)
{this.thumbnail=thumbnail;this.updateIcon();return this;};RasterListItem.prototype.listItemHtml=function(innerHtmlOnly)
{var selStyle=!this.isEnabled?"rasterListItemDisabled":(this.isSelected?"rasterListItemSelected":"");var text=RasterStrings.formatDate(this.text||"&nbsp;");var innerHtml="<span class='rasterListItemIco'>"+RasterSprite.asHtml(this.icon,16,16,this.isEnabled?100:33)+"</span>"+"<a href='#' onclick='this.blur(); return false;' class='"+selStyle+"'>"+"<span class='rasterBkleft'></span>"+"<span class='rasterBkright'></span>"+"<span class='rasterListItemTxt'>"+text+"</span>"+"</a>";if(innerHtmlOnly===true)
return innerHtml;else
return"<div class='rasterListItem' __iidx='"+this.index+"'>"+innerHtml+"</div>";};RasterListItem.prototype.gridItemHtml=function(innerHtmlOnly)
{var sprite;var icoStyle="rasterListItemIco";var selStyle=!this.isEnabled?"rasterListItemDisabled":(this.isSelected?"rasterListItemSelected":"");if(this.icon32!=null)
{sprite=RasterSprite.asHtml(this.icon32,32,32,this.isEnabled?100:33);}
else if(this.icon!=null)
{sprite=RasterSprite.asHtml(this.icon,16,16,this.isEnabled?100:33);icoStyle="rasterListItemIco16";}
else
{sprite=RasterSprite.asHtml(null);icoStyle="rasterListItemIco32";}
var text=RasterStrings.formatDate(this.text||"&nbsp;");var innerHtml="<a href='#' onclick='this.blur(); return false;' class='"+selStyle+"'>"+"<span class='rasterBkbottom'></span>"+"<span class='rasterBktop'></span>"+"<span class='"+icoStyle+"'>"+sprite+"</span>"+"<br />"+"<span class='rasterListItemTxt'>"+text+"</span>"+"</a>";if(innerHtmlOnly===true)
return innerHtml;else
return"<span class='rasterGridListItem' __iidx='"+this.index+"'>"+innerHtml+"</span>";};RasterListItem.prototype.thumbItemHtml=function(innerHtmlOnly)
{var imgHtml;var selStyle=!this.isEnabled?"rasterListItemDisabled":(this.isSelected?"rasterListItemSelected":"");var opacity=this.isEnabled?"":(Raster.isIE?"filter:progid:DXImageTransform.Microsoft.Alpha(opacity=33);":"opacity: .33;");var thumbSz=this.listControl.thumbsize;if(this.thumbnail!=null)
imgHtml="<img class='rasterThumbnail' src='"+this.thumbnail+"' "+
(!(Raster.isIE6||Raster.isIEQuirks)?"style='"+opacity+";max-width:"+thumbSz+"px; max-height:"+thumbSz+"px;' />":"style='"+opacity+";width:expression(this.width > "+thumbSz+" ? \""+thumbSz+"px\" : true);"+"height:expression(this.height > "+thumbSz+" ? \""+thumbSz+"px\" : true);"+"margin-top: expression( ("+thumbSz+" - this.height) / 2 )' />");else if(this.icon32!=null)
imgHtml=RasterSprite.asHtml(this.icon32,32,32,this.isEnabled?100:33);else if(this.icon!=null)
imgHtml=RasterSprite.asHtml(this.icon,16,16,this.isEnabled?100:33);else
imgHtml=RasterSprite.asHtml(null);var text=RasterStrings.formatDate(this.text||"&nbsp;");var innerHtml="<a href='#' onclick='this.blur(); return false;' class='"+selStyle+"'>"+"<span class='rasterListItemThumb' style='width:"+thumbSz+"px;"+"height:"+thumbSz+"px;line-height:"+thumbSz+"px;'>"+imgHtml+"&nbsp;</span>"+"<br />"+"<span class='rasterListItemTxt'>"+text+"</span>"+"</a>";if(innerHtmlOnly===true)
return innerHtml;else
return"<span class='rasterThumbListItem' __iidx='"+this.index+"'>"+
innerHtml+"</span>";};RasterListItem.prototype.tableItemHtml=function()
{var rowClass=(this.listControl.isAltRows&&this.index%2==0?"rasterTableListAltRow ":"")+
(!this.isEnabled?"rasterListItemDisabled":(this.isSelected?"rasterListItemSelected":""));var buf=[];if(this.listControl.columns&&this.listControl.columns.length>0)
{var data=RasterStrings.formatDate(this.data[this.listControl.columns[0].dataIdx]||"&nbsp;");buf.push("<td __coln='0'>"+
RasterList.SURROUND[0]+"<span class='rasterListItemIco'>"+
RasterSprite.asHtml(this.icon,16,16,this.isEnabled?100:33)+"</span><span>"+
data+"</span>"+
RasterList.SURROUND[1]+"</td>");for(var i=1;i<this.listControl.columns.length;i++)
{data=RasterStrings.formatDate(this.data[this.listControl.columns[i].dataIdx]||"&nbsp;");buf.push("<td  __coln='"+i+"'>"+
RasterList.SURROUND[0]+data+RasterList.SURROUND[1]+"</td>");}}
return"<tr __iidx='"+this.index+"' class='"+rowClass+"'>"+buf.join("")+"</tr>";};RasterListItem.prototype.rasterize=function()
{var list=this.listControl;var selStyle=!this.isEnabled?"rasterListItemDisabled":(this.isSelected?"rasterListItemSelected":"");if(!list.isTable)
{RasterListItem.frag=RasterListItem.frag||document.createElement("DIV");RasterListItem.frag.innerHTML=list.isList?this.listItemHtml():(list.isGrid?this.gridItemHtml():this.thumbItemHtml());list.contentDiv.appendChild(RasterListItem.frag.firstChild);}
else
{var tr=list.dataBody.insertRow(list.dataBody.rows.length);tr.className=selStyle;tr.setAttribute("__iidx",this.index+"");for(var i=0;i<list.columns.length;i++)
{var td=tr.insertCell(tr.cells.length);td.setAttribute("__coln",i+"");var data=RasterStrings.formatDate(this.data[list.columns[i].dataIdx]||"&nbsp;");if(i==0)
{td.innerHTML=RasterList.SURROUND[0]+"<span class='rasterListItemIco'>"+
RasterSprite.asHtml(this.icon,16,16,this.isEnabled?100:33)+"</span>"+"<span>"+
data+"</span>"+
RasterList.SURROUND[1];}
else
{td.innerHTML=RasterList.SURROUND[0]+data+RasterList.SURROUND[1];}}}
return this;};RasterListItem.prototype.remove=function()
{this.listControl.removeItems(this);return this;};RasterListItem.prototype.scrollIntoView=function()
{this.getItemElement().scrollIntoView();return this;};RasterListItem.prototype.isFirst=function()
{return this.getItemElement().previousSibling!=null;};RasterListItem.prototype.isLast=function()
{return this.getItemElement().nextSibling!=null;};RasterListItem.prototype.getPreviousItem=function()
{var box=this.getItemElement();if(box.previousSibling!=null&&box.previousSibling.getAttribute("__iidx")!=null)
return this.listControl.allItems[box.previousSibling.getAttribute("__iidx")*1];else
return null;};RasterListItem.prototype.getNextItem=function()
{var box=this.getItemElement();if(box.nextSibling!=null&&box.nextSibling.getAttribute("__iidx")!=null)
return this.listControl.allItems[box.nextSibling.getAttribute("__iidx")*1];else
return null;};RasterListItem.prototype.moveUp=function()
{var sibling=this.getPreviousItem();if(sibling!=null)
{Raster.setSibling(this.getItemElement(),sibling.getItemElement(),false);var all=this.listControl.allItems;var isLast=this.index==all.length-1;all.splice(sibling.index,1);if(isLast)
all.push(sibling);else
all.splice(this.index,0,sibling);var tmp=this.index;this.index=sibling.index;sibling.index=tmp;this.getItemElement().setAttribute("__iidx",this.index+"");sibling.getItemElement().setAttribute("__iidx",sibling.index+"");if(this.listControl.isTable)
{this.updateStyle();sibling.updateStyle();}}
return this;};RasterListItem.prototype.moveDown=function()
{var sibling=this.getNextItem();if(sibling!=null)
{Raster.setSibling(this.getItemElement(),sibling.getItemElement(),true);var all=this.listControl.allItems;var isLast=sibling.index==all.length-1;all.splice(this.index,1);if(isLast)
all.push(this);else
all.splice(sibling.index,0,this);var tmp=this.index;this.index=sibling.index;sibling.index=tmp;this.getItemElement().setAttribute("__iidx",this.index+"");sibling.getItemElement().setAttribute("__iidx",sibling.index+"");if(this.listControl.isTable)
{this.updateStyle();sibling.updateStyle();}}
return this;};function RasterList(parent,displayMode,thumbsize)
{RasterControl.call(this,parent);this.controlBox.innerHTML='<div class="rasterListContent"></div>';this.controlBox.listControl=this;this.contentDiv=this.controlBox.firstChild;this.setClass(Raster.isIEQuirks?"rasterList rasterListQuirks":"rasterList");this.allItems=[];this.selectedItems=[];this.columns=null;this.data2Col=null;this.isCustomizable=false;this.isMultiSelect=false;this.isSortable=false;this.isDnD=false;this.isResizable=false;this.isSpread=false;this.isAscending=true;this.isTableIconsVisible=true;this.isAltRows=false;this.sortedIndex=null;this.thumbsize=thumbsize||80;this.isGrid=false;this.isTable=false;this.isThumbs=false;this.isList=false;this.headerDiv=null;this.headerTable=null;this.headerCols=null;this.headerRow=null;this.dataTable=null;this.dataBody=null;this.dataCols=null;this.eventHandler=null;this.controlBox.onmousedown=RasterList.itemMousedownHandler;this.controlBox.onmouseup=RasterList.itemMouseupHandler;this.controlBox.ondblclick=RasterList.itemDblClickHandler;this.setDropHandler(RasterList.dragDropHandler);this.id="rl"+(Raster.idSequence++);RasterList.all[this.id]=this;this.changeDisplayMode(displayMode);}
RasterList.SURROUND=Raster.isIE?["<span style='white-space:nowrap'>","</span>"]:["",""];RasterList.MIN_COL_WIDTH=16;RasterList.all={};RasterList.prototype.IID_LIST=true;Raster.implementIID(RasterList,RasterControl);RasterList.doLayout=function()
{for(var id in RasterList.all)
RasterList.all[id].doLayout();};RasterList.prototype.doLayout=function()
{if(this.isTable&&this.isSpread)
this.spread();if(Raster.isIE)
this.realignHeaders();};RasterList.prototype.dispose=function()
{this.controlBox.onmousedown=null;this.contentDiv.onscroll=null;this.controlBox.ondblclick=null;if(this.headerDiv)
this.headerDiv.onmousedown=null;this.headerTable=null;this.headerCols=null;this.headerRow=null;this.dataTable=null;this.dataBody=null;this.dataCols=null;this.contentDiv=null;this.headerDiv=null;delete RasterList.all[this.id];RasterControl.prototype.dispose.call(this);};RasterList.prototype.setEventHandler=function(eventHandler)
{this.eventHandler=eventHandler;return this;};RasterList.prototype.changeDisplayMode=function(displayMode,thumbsize)
{this.isGrid=displayMode=="grid";this.isTable=displayMode=="table";this.isThumbs=displayMode=="thumbs";this.thumbsize=thumbsize||this.thumbsize;this.isList=!this.isGrid&&!this.isTable&&!this.isThumbs;if(this.isTable)
{Raster.addClass(this.contentDiv,"rasterListContentTable");if(this.headerDiv==null)
{this.headerDiv=document.createElement("DIV");this.headerDiv.className="rasterTableListHdrBox"+(!this.isResizable?" rasterTableListHideSz":"");this.controlBox.appendChild(this.headerDiv);this.headerDiv.onmousedown=RasterList.colMousedownHandler;}
else
this.headerDiv.style.display="block";this.contentDiv.onscroll=RasterList.tableScrollHandler;}
else
{Raster.removeClass(this.contentDiv,"rasterListContentTable");if(this.headerDiv!=null)
this.headerDiv.style.display="none";this.contentDiv.innerHTML="";this.contentDiv.onscroll=null;this.headerTable=null;this.headerCols=null;this.headerRow=null;this.dataTable=null;this.dataBody=null;this.dataCols=null;}
this.paint();return this;};RasterList.prototype.setCustomizable=function(isCustomizable)
{this.isCustomizable=isCustomizable;return this;};RasterList.prototype.setSortable=function(isSortable)
{this.isSortable=isSortable;return this;};RasterList.prototype.setDragDrop=function(isDnD)
{this.isDnD=isDnD;return this;};RasterList.prototype.setAltRows=function(isAltRows)
{this.isAltRows=isAltRows;if(this.isTable)
this.paintTable();return this;};RasterList.prototype.setResizable=function(isResizable)
{this.isResizable=isResizable;if(this.headerDiv)
if(isResizable)
Raster.removeClass(this.headerDiv,"rasterTableListHideSz");else
Raster.addClass(this.headerDiv,"rasterTableListHideSz");return this;};RasterList.prototype.setMultiSelect=function(isMultiSelect)
{this.isMultiSelect=isMultiSelect;return this;};RasterList.prototype.setSpread=function(isSpread)
{this.isSpread=isSpread;var cols=this.columns;if(!isSpread&&cols)
{for(var i=0;i<cols.length;i++)
cols[i].width=cols[i].owidth;if(this.isTable)
this.applyColWidths();}
else
this.spread();return this;};RasterList.prototype.showTableIcons=function(isTableIconsVisible)
{this.isTableIconsVisible=isTableIconsVisible;if(this.dataTable)
if(isTableIconsVisible)
Raster.removeClass(this.dataTable,"rasterTableListNoIco");else
Raster.addClass(this.dataTable,"rasterTableListNoIco");return this;};RasterList.prototype.size=function()
{return this.allItems.length;};RasterList.prototype.add=function(icon,icon32,thumbnail,data,value,doPaint)
{var item=new RasterListItem(this,this.allItems.length,icon,icon32,thumbnail,data,value);if(doPaint!==false)
item.rasterize();this.allItems.push(item);return item;};RasterList.prototype.removeSelectedItems=function()
{this.removeItems(this.getSelectedItems());return this;};RasterList.prototype.removeAll=function()
{this.removeItems(this.getItems());return this;};RasterList.prototype.removeItems=function(items)
{function remove(list,i)
{var el=i.getItemElement();el.parentNode.removeChild(el);list.allItems.splice(i.index,1);}
if(items.IID_LISTITEM)
{remove(this,items);}
else
{var arr=items.slice(0);arr.sort(function(a,b){return b.index-a.index;});for(var i=0;i<arr.length;i++)
{if(arr[i].isSelected)
this.unselectItem(arr[i]);remove(this,arr[i]);}}
this.updateIndexes(true);return this;};RasterList.prototype.unselectItem=function(item)
{if(item==null||!item.IID_LISTITEM)
item=this.getItemByValue(item);if(item!=null)
for(var i=0;i<this.selectedItems.length;i++)
if(item==this.selectedItems[i])
{this.selectedItems.splice(i,1);item.markSelected(false);break;}
return this;};RasterList.prototype.selectItem=function(item,add,range)
{if(!this.isMultiSelect)
add=range=null;if(item==null||!item.IID_LISTITEM)
item=this.getItemByValue(item);if(add!==true&&range!=true)
this.clear();if(item!=null&&item.isEnabled)
{var sel=this.selectedItems;if(range===true&&sel.length>0)
{var a=sel[sel.length-1].index;var b=item.index;var step=(a>b)?-1:1;while(a!=b+step)
{var it=this.allItems[a];if(!it.isSelected&&it.isEnabled)
{it.markSelected(true);sel.push(it);}
a+=step;}}
else
{if(add===true&&item.isSelected)
item.unselect();else
{item.markSelected(true);sel.push(item);}}}
return this;};RasterList.prototype.selectAll=function()
{for(var i=0;i<this.allItems.length;i++)
this.allItems[i].markSelected(true);this.selectedItems=this.allItems.slice(0);return this;};RasterList.prototype.clear=function()
{for(var i=0;i<this.selectedItems.length;i++)
this.selectedItems[i].markSelected(false);this.selectedItems.splice(0,this.selectedItems.length);return this;};RasterList.prototype.getItemByValue=function(value)
{for(var i=0;i<this.allItems.length;i++)
if(this.allItems[i].value==value)
return this.allItems[i];return null;};RasterList.prototype.getItem=function(index)
{return this.allItems[index];};RasterList.prototype.getItems=function()
{return this.allItems.slice(0);};RasterList.prototype.getSelectedItems=function()
{return this.selectedItems.slice(0);};RasterList.prototype.getSelectedItem=function()
{var sel=this.selectedItems;if(sel.length>0)
return sel[sel.length-1];else
return null;};RasterList.prototype.hasSelection=function()
{return this.selectedItems.length>0;};RasterList.prototype.updateIndexes=function(updateDom)
{var i;var all=this.allItems;if(updateDom!==true)
{for(i=0;i<all.length;i++)
all[i].index=i;}
else
{var container=this.isTable?this.dataBody:this.contentDiv;for(i=0;i<all.length;i++)
{all[i].index=i;container.childNodes[i].setAttribute("__iidx",i+"");}
if(this.isTable&&this.isAltRows)
for(i=0;i<all.length;i++)
all[i].updateStyle();}};RasterList.prototype.moveItems=function(items,destIndex,doPaint)
{var length=this.allItems.length;destIndex=(destIndex==null)?length:Raster.clip(destIndex,0,length);var isAppend=destIndex==length;if(items.IID_LISTITEM)
{if(items.index==destIndex&&(items.index+1)==destIndex)
return this;this.allItems.splice(items.index,1);if(isAppend)
this.allItems.push(items);else
this.allItems.splice((destIndex>items.index?destIndex-1:destIndex),0,items);}
else
{var arr=items.slice(0);arr.sort(function(a,b){return b.index-a.index;});var i;if(!isAppend)
{var sel={};for(i=0;i<arr.length;i++)
sel[arr[i].index]=arr[i];while(sel[destIndex]!=null)
destIndex++;if(destIndex>=this.allItems.length)
isAppend=true;else
this.allItems[destIndex].__INS=true;}
for(i=0;i<arr.length;i++)
this.allItems.splice(arr[i].index,1);if(isAppend)
this.allItems=this.allItems.concat(items);else
{var insIndex=0;for(i=0;i<this.allItems.length;i++)
if(this.allItems[i].__INS)
{delete this.allItems[i].__INS;insIndex=i;break;}
for(i=0;i<arr.length;i++)
this.allItems.splice(insIndex,0,arr[i]);}}
this.updateIndexes();if(doPaint!==false)
this.paint();return this;};RasterList.prototype.addColumn=function(name,width,dataIdx,colIdx,doPaint)
{if(this.data2Col&&this.data2Col[dataIdx]!=null)
return this;var col={width:width,owidth:width,dataIdx:dataIdx,name:name};var cols=this.columns=this.columns||[];if(colIdx==null||colIdx>=cols.length)
cols.push(col);else
{if(this.sortedIndex!=null&&this.sortedIndex>=colIdx)
this.sortedIndex++;cols.splice(colIdx,0,col);}
this.updateData2ColMap();if(doPaint!==false&&this.isTable)
this.paintTable();return this;};RasterList.prototype.removeColumn=function(colIdx,doPaint)
{var cols=this.columns;if(cols&&colIdx<cols.length)
{cols.splice(colIdx,1);if(this.sortedIndex==colIdx)
this.sortedIndex=null;else if(this.sortedIndex!=null&&this.sortedIndex>colIdx)
this.sortedIndex--;this.updateData2ColMap();if(doPaint!==false&&this.isTable)
this.paintTable();}
return this;};RasterList.prototype.moveColumn=function(srcIndex,destIndex)
{var cols=this.columns;if(!cols||cols.length<=1)
return this;destIndex=(destIndex==null)?cols.length:Math.min(cols.length,destIndex);if(srcIndex>=cols.length||srcIndex==destIndex||(srcIndex+1)==destIndex)
return this;if(this.sortedIndex!=null)
cols[this.sortedIndex].__SORTED=true;var temp;if(destIndex==cols.length)
{temp=cols.splice(srcIndex,1);cols.push(temp[0]);}
else if(srcIndex>destIndex)
{temp=cols.splice(srcIndex,1);cols.splice(destIndex,0,temp[0]);}
else
{temp=cols.splice(srcIndex,1);cols.splice(destIndex-1,0,temp[0]);}
if(this.sortedIndex!=null)
for(var i=0;cols.length;i++)
if(cols[i].__SORTED===true)
{delete cols[i].__SORTED;this.sortedIndex=i;break;}
this.updateData2ColMap();if(this.isTable)
this.paintTable();return this;};RasterList.prototype.updateData2ColMap=function()
{this.data2Col={};for(var i in this.columns)
this.data2Col[this.columns[i].dataIdx]=i;};RasterList.prototype.spreadRatio=function()
{var cols=this.columns;if(!cols||cols.length==0)
return 1;var sum=0;for(var i=0;i<cols.length;i++)
sum+=cols[i].owidth;var width=this.contentDiv.clientWidth-((Raster.isIE6||Raster.isIE7)&&!Raster.isIEQuirks?24:0);return(width-2)/sum;};RasterList.prototype.spread=function(doPaint)
{var cols=this.columns;if(cols!=null)
{var ratio=this.spreadRatio();for(var i=0;i<cols.length;i++)
cols[i].width=Math.round(cols[i].owidth*ratio);if(this.isTable&&doPaint!==false)
this.applyColWidths();}
return this;};RasterList.prototype.setColWidth=function(colIndex,width)
{var cols=this.columns;if(cols==null)
return this;if(colIndex<cols.length)
{cols[colIndex].width=width;cols[colIndex].owidth=width;if(this.isTable)
if(this.isSpread)
this.spread();else
this.applyColWidths();}
return this;};RasterList.prototype.applyColWidths=function()
{var cols=this.columns;var tableWidth=0;for(var i=0;i<this.headerCols.childNodes.length;i++)
{this.headerCols.childNodes[i].width=cols[i].width;this.dataCols.childNodes[i].width=cols[i].width;tableWidth+=cols[i].width;}
this.headerTable.style.width=tableWidth+"px";this.dataTable.style.width=tableWidth+"px";this.realignHeaders();};RasterList.prototype.getColWidth=function(colIndex)
{if(!this.columns||colIndex>=this.headerCols.childNodes.length)
return-1;return this.columns[colIndex].width;};RasterList.prototype.getColCount=function()
{return this.columns?this.columns.length:0;};RasterList.prototype.realignHeaders=function()
{if(this.headerTable==null)
return;this.headerTable.style.marginLeft=(-this.contentDiv.scrollLeft)+"px";};RasterList.prototype.setSortCol=function(colIndex,isAcsending)
{if(!this.isTable)
{this.sortedIndex=colIndex;return this;}
var th;if(this.sortedIndex!=null)
{th=this.headerRow.cells[this.sortedIndex];Raster.removeClass(th,"TableListHdrAsc");Raster.removeClass(th,"TableListHdrDesc");}
if(colIndex!=null&&this.columns!=null&&colIndex<this.columns.length)
{this.sortedIndex=colIndex;th=this.headerRow.cells[colIndex];Raster.addClass(th,isAcsending!==false?"TableListHdrAsc":"TableListHdrDesc");}
return this;};RasterList.prototype.sort=function(isAcsending,colIndex,dataIndex)
{this.setSortCol(null);var cols=this.columns;colIndex=colIndex||0;if(isAcsending==null||(cols!=null&&colIndex>=cols.length))
return this;this.isAscending=isAcsending;this.sortedIndex=colIndex;dataIndex=(dataIndex==null)?(cols?cols[colIndex].dataIdx:0):dataIndex;isAcsending=(isAcsending===true)?1:-1;this.allItems.sort(function(item1,item2)
{var a=item1.data[dataIndex];var b=item2.data[dataIndex];if(!isNaN(a-b))
return isAcsending*(a-b);else if(a!=null&&b!=null&&a.getTime!=null&&b.getTime!=null)
return isAcsending*(a.getTime()-b.getTime());else
return(a||"").toString().toUpperCase()<(b||"").toString().toUpperCase()?-isAcsending:isAcsending;});this.updateIndexes();this.paint();return this;};RasterList.prototype.paint=function()
{if(this.isList)
this.paintList();else if(this.isTable)
this.paintTable();else if(this.isGrid)
this.paintGrid();else if(this.isThumbs)
this.paintThumbs();return this;};RasterList.prototype.paintList=function()
{var buf=[];for(var i=0;i<this.allItems.length;i++)
buf.push(this.allItems[i].listItemHtml());this.contentDiv.innerHTML=buf.join('');};RasterList.prototype.paintGrid=function()
{var buf=[];for(var i=0;i<this.allItems.length;i++)
buf.push(this.allItems[i].gridItemHtml());this.contentDiv.innerHTML=buf.join('');};RasterList.prototype.paintThumbs=function()
{var buf=[];for(var i=0;i<this.allItems.length;i++)
buf.push(this.allItems[i].thumbItemHtml());this.contentDiv.innerHTML=buf.join('');};RasterList.prototype.paintTable=function()
{var colgroup=[];var headers=[];var rows=[];var tableWidth=0;var cols=this.columns||[];if(this.isSpread)
this.spread(false);var i;for(i=0;i<cols.length;i++)
{colgroup.push('<col width="'+cols[i].width+'" />');var sortCss=(this.sortedIndex==i)?"class='TableListHdr"+(this.isAscending?"Asc":"Desc")+"'":"";headers.push('<th __coln="'+i+'" '+sortCss+'>'+'<div class="rasterTableListHdr">'+'<div class="rasterTableListHdrTxt">'+
(cols[i].name||"&nbsp;")+'</div>'+'<div class="rasterTableListHdrSort">'+'<div class="rasterTableListHdrSize" grip="1"></div>'+'</div>'+'</div>'+'</th>');tableWidth+=cols[i].width;}
for(i=0;i<this.allItems.length;i++)
rows.push(this.allItems[i].tableItemHtml());this.contentDiv.innerHTML='<table border="0" cellspacing="0" class="rasterTableList'+
(this.isTableIconsVisible?'':' rasterTableListNoIco')+'" style="width:'+tableWidth+'px">'+'<colgroup>'+colgroup.join("")+'</colgroup>'+'<tbody>'+
rows.join('')+'</tbody>'+'</table>';this.headerDiv.innerHTML='<table border="0" cellspacing="0" cellpadding="0" class="rasterTableListHdr"  style="width:'+tableWidth+'px">'+'<colgroup>'+colgroup.join("")+'</colgroup>'+'<tbody><tr>'+headers.join("")+'</tr></tbody>'+'</table>';this.headerTable=this.headerDiv.firstChild;this.headerCols=this.headerTable.firstChild;this.headerRow=this.headerTable.lastChild.firstChild;this.dataTable=this.contentDiv.firstChild;this.dataBody=this.dataTable.lastChild;this.dataCols=this.dataTable.firstChild;this.realignHeaders();};RasterList.prototype.renameColumn=function(colIdx,name)
{if(this.columns&&colIdx<this.columns.length)
{this.columns[colIdx].name=name;if(this.headerRow&&colIdx<this.headerRow.cells.length)
this.headerRow.cells[colIdx].firstChild.firstChild.innerHTML=name||"&nbsp;";}
return this;};RasterList.tableScrollHandler=function(event)
{var list=Raster.findParentExpando(Raster.srcElement(event),"listControl");list.realignHeaders();};RasterList.itemDblClickHandler=function(event)
{RasterList.itemMousedownHandler(event,true);};RasterList.itemMouseupHandler=function(event)
{var el=Raster.srcElement(event);var itemContainer=Raster.findParentWithAttr(el,"__iidx");if(itemContainer==null)
return;var list=Raster.findParentExpando(el,"listControl");var itemIndex=parseInt(itemContainer.getAttribute("__iidx"));var item=list.allItems[itemIndex];if(list.mousedownItem==item&&item.isEnabled)
item.select();};RasterList.prototype.getDragContext=function(mouseEvt)
{var data=mouseEvt.context[this.id];if(!data)
{data=Raster.getBounds(this.contentDiv);data.width=this.contentDiv.clientWidth;data.height=this.contentDiv.clientHeight;data.list=this;data.sbHeight=this.contentDiv.clientWidth<this.contentDiv.scrollWidth?18:0;data.rowHeight=this.isList?(this.contentDiv.firstChild?this.contentDiv.firstChild.offsetHeight:0):((this.dataBody&&this.dataBody.firstChild)?this.dataBody.firstChild.offsetHeight:0);data.rowsBottom=data.y+(data.rowHeight*this.allItems.length);data.bottom=data.y+data.height;data.isBeforeDrag=true;data.itemIndex=null;if(this.isGrid||this.isThumbs)
{var ch=this.contentDiv.children;var idx,top=0,prevTop,rows=[],n=0;rows[0]={top:0,right:0,bottom:ch[0].offsetHeight,items:[{idx:0,left:0}]};prevTop=ch[0].offsetTop;data.itemWidth=ch[0].offsetWidth;for(idx=1;idx<ch.length;idx++)
{top=ch[idx].offsetTop;if(top!=prevTop)
{rows[n].bottom=top;n++;rows[n]={top:top,right:0,bottom:top+ch[idx].offsetHeight,items:[]};rows[n].items.push({idx:idx,left:0});prevTop=top;}
else
rows[n].items.push({idx:idx,left:ch[idx].offsetLeft});rows[n].bottom=Math.max(rows[n].bottom,top+ch[idx].offsetHeight);rows[n].right=Math.max(rows[n].right,ch[idx].offsetLeft+ch[idx].offsetWidth);}
data.rowsBottom=rows.length>0?rows[rows.length-1].bottom:0;data.gridrows=rows;}
mouseEvt.context[this.id]=data;}
return data;};RasterList.itemMousedownHandler=function(event,isDblClick)
{Raster.stopEvent(event);Raster.setActiveMenu(null);var el=Raster.srcElement(event);var itemContainer=Raster.findParentWithAttr(el,"__iidx");if(itemContainer==null)
return;var list=Raster.findParentExpando(el,"listControl");var itemIndex=parseInt(itemContainer.getAttribute("__iidx"));var item=list.allItems[itemIndex];var mouse=Raster.getInputState(event);var dataIdx=null;var colNo=null;if(list.isTable)
{var tmp=Raster.findParentWithAttr(el,"__coln");if(tmp!=null)
{colNo=parseInt(tmp.getAttribute("__coln"));dataIdx=list.columns[colNo].dataIdx;}}
var lstEvent=null;if(list.eventHandler)
{lstEvent=RasterEvent.mkListEvent(event,isDblClick===true?"dblclick":(mouse.button==1?"click":"context"),list,item,colNo,itemIndex,null,null,dataIdx,null,null);list.eventHandler(lstEvent);}
if((lstEvent&&lstEvent.isCancelled)||!item.isEnabled||isDblClick===true)
return;list.mousedownItem=null;if(item.isSelected&&!mouse.ctrl&&!mouse.shift)
list.mousedownItem=item;else
item.select(mouse.ctrl,mouse.shift);if(!list.isDnD||mouse.button!=1)
return;RasterMouse.setCursor(CURSORS.DRAG);var mouseEvt=RasterMouse.startDrag(event,item,null,null,true);var data=list.getDragContext(mouseEvt);data.colNo=colNo;data.dataIdx=dataIdx;};RasterList.dragDropHandler=function(mouseEvt)
{var dragValue=mouseEvt.value;var evtType=mouseEvt.type=="enter"?"over":mouseEvt.type;var list=mouseEvt.control;if(!list.isDnD||evtType=="cancel"||dragValue==null||evtType=="out")
{RasterMouse.showDropBorderOver(null);RasterMouse.showDropLine(null);return;}
var data=list.getDragContext(mouseEvt);var isLocal=dragValue.IID_LISTITEM&&(dragValue.listControl==list);var lstEvent=null;if(data.isBeforeDrag)
{data.isBeforeDrag=false;if(isLocal&&list.eventHandler!=null)
{lstEvent=RasterEvent.mkListEvent(mouseEvt.event,"beforedrag",list,dragValue,data.colNo,dragValue.index,null,null,data.dataIdx,dragValue,null);list.eventHandler(lstEvent);}
if(lstEvent!=null&&lstEvent.isCancelled)
{RasterMouse.cancelDrag();return;}
RasterMouse.addTimerListener(RasterList.itemMoveAutoScrollHandler,data);list.mousedownItem=null;}
var itemIndex,position,box={};var scrollY=list.contentDiv.scrollTop;var localY=Raster.clip(mouseEvt.y,data.y,data.y+data.height)-data.y;var maxBottom=Math.min(data.rowsBottom,data.bottom);var isList=list.isTable||list.isList;if(isList)
{itemIndex=Math.floor((scrollY+localY)/data.rowHeight);var rowY=itemIndex*data.rowHeight-scrollY+data.y;var edge=Math.round(((scrollY+localY)%data.rowHeight)/data.rowHeight*2);box.x=data.x;box.y=Math.max(rowY,data.y);box.w=data.width;box.h=Math.min(data.rowHeight,maxBottom-rowY);position=edge==2?"after":((edge==1&&list.eventHandler!=null)?"over":"before");}
else if(localY<maxBottom)
{var n,left;var rows=data.gridrows;var scrollX=list.contentDiv.scrollLeft;var dx=Raster.clip(mouseEvt.x,data.x,data.x+data.width)-data.x+scrollX;localY+=scrollY;for(n=0;n<rows.length-1;n++)
if(localY>=rows[n].top&&localY<rows[n+1].top)
break;var len=rows[n].items.length;for(var i=0;i<len;i++)
if(dx>=rows[n].items[i].left&&dx<rows[n].items[i].left+data.itemWidth)
{left=rows[n].items[i].left;itemIndex=rows[n].items[i].idx;var side=Math.round((dx-rows[n].items[i].left)/data.itemWidth*2);position=side==2?"after":(side==1?"over":"before");break;}
if(left==null)
{left=rows[n].items[len-1].left;itemIndex=rows[n].items[len-1].idx;position="after";}
box.x=Raster.clip(left+data.x-scrollX,data.x,data.x+data.width);box.y=Raster.clip(rows[n].top+data.y-scrollY,data.y,data.y+data.height);box.h=Math.min(data.y+data.height,rows[n].top+data.y-scrollY+rows[n].bottom-rows[n].top)-box.y;box.w=Math.min(data.x+data.width-box.x,data.itemWidth);}
if(data.itemIndex!=itemIndex)
RasterMouse.restoreCursor();data.itemIndex=itemIndex;RasterMouse.showDropBorderOver(null);RasterMouse.showDropLine(null);var listItem=list.allItems[itemIndex];if(listItem==null||dragValue==listItem)
return;lstEvent=null;if(list.eventHandler!=null&&(evtType=="over"||(evtType=="drop"&&data.position!=null)))
{lstEvent=RasterEvent.mkListEvent(mouseEvt.event,evtType,list,listItem,null,itemIndex,null,null,null,dragValue,(evtType=="over"?position:data.position));list.eventHandler(lstEvent);}
if(evtType=="over"&&lstEvent&&lstEvent.acceptPosition)
{position=data.position=lstEvent.acceptPosition;if(isList)
{if(position=="after")
RasterMouse.showDropLine(box.x,box.y+box.h,false,box.w);else if(position=="before")
RasterMouse.showDropLine(box.x,box.y,false,box.w);else
RasterMouse.showDropBorder(box.x,box.y,box.w,box.h);}
else
{if(position=="after")
RasterMouse.showDropLine(box.x+box.w,box.y,true,box.h);else if(position=="before")
RasterMouse.showDropLine(box.x,box.y,true,box.h);else
RasterMouse.showDropBorder(box.x,box.y,box.w,box.h);}}
else if(evtType!="drop")
{data.position=null;}
if(evtType=="drop"&&isLocal&&data.position&&(lstEvent&&!lstEvent.isCancelled))
list.moveItems(list.selectedItems,itemIndex+(data.position=="after"?1:0));};RasterList.itemMoveAutoScrollHandler=function(mouseEvt,data)
{var container=data.list.contentDiv;var bounds=data;var scrollmax=Math.max(0,container.scrollHeight-container.clientHeight);if(container.scrollHeight>bounds.height)
{mouseEvt.type="over";if(mouseEvt.y<bounds.y+16&&container.scrollTop>0)
{RasterMouse.showDropBorder(null);RasterMouse.showDropLine(null);container.scrollTop=Math.max(0,container.scrollTop-20);RasterList.dragDropHandler(mouseEvt);}
else if(mouseEvt.y>bounds.bottom-16)
{RasterMouse.showDropBorder(null);RasterMouse.showDropLine(null);container.scrollTop=Math.min(scrollmax,container.scrollTop+20);RasterList.dragDropHandler(mouseEvt);}}};RasterList.colMousedownHandler=function(event)
{Raster.stopEvent(event);Raster.setActiveMenu(null);var el=Raster.srcElement(event);if(el.getAttribute("grip")!=null)
{RasterList.colResizeInit(event);return;}
var th=Raster.findParentWithAttr(el,"__coln");if(th==null)
return;var colNo=parseInt(th.getAttribute("__coln"));var list=Raster.findParentExpando(el,"listControl");var dataIdx=list.columns[colNo].dataIdx;var mouse=Raster.getInputState(event);var lstEvent=null;if(list.eventHandler)
{lstEvent=RasterEvent.mkListEvent(event,mouse.button==2?"colcontext":"colclick",list,null,colNo,null,null,null,dataIdx,null,null);list.eventHandler(lstEvent);}
if((lstEvent&&lstEvent.isCancelled)||mouse.button!=1)
return;var data=list.getBounds();data.list=list;data.th=th;data.colNo=colNo;data.dataIdx=dataIdx;data.tickerStarted=false;data.ranges=[];var sum=0;var cells=th.parentNode.cells;for(var i=0;i<cells.length;i++)
{data.ranges.push({a:sum,b:sum+cells[i].offsetWidth/2,c:sum+cells[i].offsetWidth});sum+=cells[i].offsetWidth;}
data.ranges.push({a:sum,b:-1,c:-1});if(list.isSortable)
Raster.addClass(th,"TableListHdrSelected");Raster.addClass(list.headerDiv,"rasterTableListHideSz");RasterMouse.startDrag(event,null,data,RasterList.colMoveHandler);};RasterList.colMoveHandler=function(mouseEvt)
{var data=mouseEvt.data;var list=data.list;var eventType=mouseEvt.type;if(list.isCustomizable&&eventType=="move")
{var sx=list.contentDiv.scrollLeft;var x=mouseEvt.x-data.x;data.dropIndex=0;if(!data.tickerStarted)
{data.tickerStarted=true;RasterMouse.addTimerListener(RasterList.colMoveAutoScrollHandler,data);RasterMouse.setCursor(CURSORS.MOVE_H);}
for(var i=0;i<data.ranges.length;i++)
if(x>=data.ranges[i].a-sx&&(x<data.ranges[i].b-sx||data.ranges[i].b==-1))
{x=data.ranges[i].a-sx;data.dropIndex=i;break;}
else if(x>=data.ranges[i].b-sx&&x<data.ranges[i].c-sx)
{x=data.ranges[i].c-sx;data.dropIndex=i+1;break;}
x=Math.min(Math.max(data.x,x+data.x),data.x+data.width-18);if(data.dropIndex!=null)
RasterMouse.showDropLine(x,data.y,true,data.height);else
RasterMouse.showDropLine(null);}
else if(eventType=="up")
{var lstEvent=null;if(data.dropIndex==null)
{if(list.eventHandler)
{lstEvent=RasterEvent.mkListEvent(mouseEvt.event,"colsort",list,null,data.colNo,null,null,null,data.dataIdx,null,null);list.eventHandler(lstEvent);}
if((lstEvent==null||!lstEvent.isCancelled)&&list.isSortable)
list.sort(list.sortedIndex==data.colNo?!list.isAscending:list.isAscending,data.colNo);}
else if(list.isCustomizable&&data.colNo!=data.dropIndex&&(data.colNo+1)!=data.dropIndex)
{if(list.eventHandler)
{lstEvent=RasterEvent.mkListEvent(mouseEvt.event,"colmove",list,null,data.colNo,null,null,data.dropIndex,data.dataIdx,null,null);list.eventHandler(lstEvent);}
if(lstEvent==null||!lstEvent.isCancelled)
list.moveColumn(data.colNo,data.dropIndex);}}
else if(eventType=="end")
{if(data.list.isResizable)
Raster.removeClass(data.list.headerDiv,"rasterTableListHideSz");Raster.removeClass(data.th,"TableListHdrSelected");}};RasterList.colMoveAutoScrollHandler=function(mouseEvt,data)
{var container=data.list.contentDiv;var bounds=data;var scrollmax=Math.max(0,container.scrollWidth-container.clientWidth);if(container.scrollWidth>bounds.width)
{mouseEvt.type="move";if(mouseEvt.x<bounds.x+16&&container.scrollLeft>0)
{RasterMouse.showDropBorder(null);RasterMouse.showDropLine(null);container.scrollLeft=Math.max(0,container.scrollLeft-20);RasterList.colMoveHandler(mouseEvt);}
else if(mouseEvt.x>bounds.x+bounds.width-36)
{RasterMouse.showDropBorder(null);RasterMouse.showDropLine(null);container.scrollLeft=Math.min(scrollmax,container.scrollLeft+20);RasterList.colMoveHandler(mouseEvt);}}};RasterList.colResizeInit=function(event)
{var el=Raster.srcElement(event);var list=Raster.findParentExpando(el,"listControl");var colNo=Raster.findParentWithAttr(el,"__coln").getAttribute("__coln");if(!list.isResizable)
return;var mouse=Raster.getInputState(event);var data=list.getBounds();data.grip=Raster.getBounds(el);data.dx=mouse.x-data.grip.x;data.list=list;data.colNo=parseInt(colNo);data.colWidth=list.getColWidth(data.colNo);data.dataIdx=list.columns[colNo].dataIdx;RasterMouse.showShadeBox(data.grip.x,data.y,5,data.height,"w-resize");RasterMouse.startDrag(event,null,data,RasterList.colResizeHander);};RasterList.colResizeHander=function(mouseEvt)
{var data=mouseEvt.data;var list=data.list;var eventType=mouseEvt.type;if(eventType=="move")
{var x=Math.max(data.grip.x-data.colWidth+RasterList.MIN_COL_WIDTH,mouseEvt.x-data.dx);RasterMouse.showShadeBox(x,data.y,5,data.height);data.mouseMoved=true;}
else if(eventType=="up"&&data.mouseMoved)
{var lstEvent=null;var colsize=Math.max(RasterList.MIN_COL_WIDTH,data.colWidth+(mouseEvt.x-mouseEvt.initial.x));if(list.eventHandler)
{lstEvent=RasterEvent.mkListEvent(mouseEvt.event,"colsize",list,null,data.colNo,0,colsize,null,data.dataIdx,null,null);list.eventHandler(lstEvent);colsize=lstEvent.newColWidth;}
if(lstEvent==null||!lstEvent.isCancelled)
{if(!list.isSpread)
list.setColWidth(data.colNo,colsize);else if(list.columns.length>1)
{var ratio=list.spreadRatio();var dw=colsize-list.getColWidth(data.colNo);var nextCol=(data.colNo+1==list.columns.length)?list.columns.length-2:data.colNo+1;list.setColWidth(data.colNo,colsize/ratio);list.setColWidth(nextCol,Math.max(16,(list.getColWidth(nextCol)-dw)/ratio));list.spread(data.colNo);}}}};function RasterGraphics(parent,width,height,bgcolor)
{RasterControl.call(this,parent);this.isVML=Raster.isIE&&!Raster.isIE9;if(this.isVML)
{if(!RasterGraphics.vmlReady)
{document.namespaces.add('v','urn:schemas-microsoft-com:vml',"#default#VML");RasterGraphics.vmlReady=true;}
this.controlBox.innerHTML='<div style="width:'+width+'; height:'+height+'"></div>';this.canvas=this.controlBox.firstChild;}
else
{this.controlBox.innerHTML='<canvas width="'+width+'" height="'+height+'"></canvas>';this.canvas=this.controlBox.firstChild;}
if(bgcolor!=null)
this.controlBox.style.background=bgcolor;this.controlBox.style.position="relative";this.controlBox.style.overflow="hidden";this.weight=1;this.color="black";this.fillColor="black";this.width=width;this.height=height;this.ox=0;this.oy=0;this.setSize(width,height);this.setWeight(this.weight);this.setColor(this.color);this.setFillColor(this.fillColor);this.setOrigin(this.ox,this.oy);}
RasterGraphics.prototype.IID_GRAPHICS=true;Raster.implementIID(RasterGraphics,RasterControl);RasterGraphics.prototype.dispose=function()
{this.canvas=null;RasterControl.prototype.dispose.call(this);};RasterGraphics.prototype.setOrigin=function(ox,oy)
{this.ox=ox;this.oy=oy;return this;};RasterGraphics.prototype.setSize=function(width,height)
{this.width=width;this.height=height;RasterControl.prototype.setSize.call(this,width,height);if(!this.isVML)
{this.canvas.width=this.width;this.canvas.height=this.height;}
return this;};RasterGraphics.prototype.setColor=function(color)
{this.color=color;if(!this.isVML)
this.canvas.getContext("2d").strokeStyle=this.color;return this;};RasterGraphics.prototype.setFillColor=function(fillColor)
{this.fillColor=fillColor;if(!this.isVML)
this.canvas.getContext("2d").fillStyle=this.fillColor;return this;};RasterGraphics.prototype.setWeight=function(weight)
{this.weight=weight;if(!this.isVML)
this.canvas.getContext("2d").lineWidth=this.weight;return this;};RasterGraphics.prototype.clear=function()
{if(this.isVML)
this.canvas.innerHTML="";else
this.canvas.getContext("2d").clearRect(0,0,this.width,this.height);return this;};RasterGraphics.prototype.line=function(x,y,x2,y2)
{if(this.isVML)
{var el=document.createElement("v:line");el.setAttribute("from",(x+this.ox)+','+(y+this.oy));el.setAttribute("to",(x2+this.ox)+','+(y2+this.oy));el.strokecolor=this.color;el.strokeweight=this.weight;this.canvas.appendChild(el);if(Raster.isIE8)
el.outerHTML=el.outerHTML;}
else
{var ctx=this.canvas.getContext("2d");ctx.beginPath();ctx.moveTo(x+this.ox,y+this.oy);ctx.lineTo(x2+this.ox,y2+this.oy);ctx.stroke();}
return this;};RasterGraphics.prototype.rect=function(x,y,x2,y2,filled)
{var box=Raster.toRect(x+this.ox,y+this.oy,x2+this.ox,y2+this.oy);if(this.isVML)
{var el=document.createElement("v:rect");el.style.position="absolute";el.style.left=box.x+"px";el.style.top=box.y+"px";el.style.width=box.width+"px";el.style.height=box.height+"px";el.strokecolor=this.color;el.strokeweight=this.weight;el.fillcolor=this.fillColor;el.filled=filled===true?"true":"false";this.canvas.appendChild(el);el.outerHTML=el.outerHTML;}
else
{var ctx=this.canvas.getContext("2d");if(filled===true)
ctx.fillRect(box.x,box.y,box.width,box.height);ctx.strokeRect(box.x,box.y,box.width,box.height);}
return this;};RasterGraphics.prototype.circle=function(x,y,r,filled)
{if(this.isVML)
{var el=document.createElement("v:oval");el.style.position="absolute";el.style.left=(x-r+this.ox)+"px";el.style.top=(y-r+this.oy)+"px";el.style.width=(r*2)+"px";el.style.height=(r*2)+"px";el.strokecolor=this.color;el.strokeweight=this.weight;el.fillcolor=this.fillColor;el.filled=filled===true?"true":"false";this.canvas.appendChild(el);el.outerHTML=el.outerHTML;}
else
{var ctx=this.canvas.getContext("2d");ctx.beginPath();ctx.arc(x+this.ox,y+this.oy,r,0,6.28,false);if(filled===true)
{ctx.fill();ctx.stroke();}
else
ctx.stroke();}
return this;};RasterGraphics.prototype.ellipse=function(x,y,x2,y2,filled)
{var box=Raster.toRect(x+this.ox,y+this.oy,x2+this.ox,y2+this.oy);if(this.isVML)
{var el=document.createElement("v:oval");el.style.position="absolute";el.style.left=box.x+"px";el.style.top=box.y+"px";el.style.width=box.width+"px";el.style.height=box.height+"px";el.strokecolor=this.color;el.strokeweight=this.weight;el.fillcolor=this.fillColor;el.filled=filled===true?"true":"false";this.canvas.appendChild(el);el.outerHTML=el.outerHTML;}
else
{var ctx=this.canvas.getContext("2d");ctx.beginPath();var centerX=box.x+box.width/2;var centerY=box.y+box.height/2;var controlRectWidth=box.width*1.33;ctx.moveTo(centerX,centerY-box.height/2);ctx.bezierCurveTo(centerX-controlRectWidth/2,centerY-box.height/2,centerX-controlRectWidth/2,centerY+box.height/2,centerX,centerY+box.height/2);ctx.bezierCurveTo(centerX+controlRectWidth/2,centerY+box.height/2,centerX+controlRectWidth/2,centerY-box.height/2,centerX,centerY-box.height/2);if(filled===true)
{ctx.fill();ctx.stroke();}
else
ctx.stroke();}
return this;};RasterGraphics.prototype.polyline=function(points,filled)
{if(this.isVML)
{var buf=new Array();for(var i=0;i<points.length;i++)
buf.push((points[i][0]+this.ox)+','+(points[i][1]+this.oy));var el=document.createElement("v:polyline");el.points.value=buf.join(" ");el.strokecolor=this.color;el.strokeweight=this.weight;el.fillcolor=this.fillColor;el.filled=filled===true?"true":"false";this.canvas.appendChild(el);}
else
{var ctx=this.canvas.getContext("2d");ctx.beginPath();ctx.moveTo(points[0][0]+this.ox,points[0][1]+this.oy);for(var j=0;j<points.length;j++)
ctx.lineTo(points[j][0]+this.ox,points[j][1]+this.oy);if(filled===true)
{ctx.fill();ctx.stroke();}
else
ctx.stroke();}
return this;};var GLYPHS=(function(){function rect(_x,_y,_w,_h){return{x:_x,y:_y,w:_w,h:_h,IID_SPRITEINFO:true,filename:'css:_glyphs.gif'};};return{DROP_DOWN:rect(0,0,7,4),DROP_DOWN2:rect(9,0,7,6),DROP_DOWN3:rect(18,0,4,7),CHEVRON_DOWN:rect(24,0,5,8),CHEVRON_RIGHT:rect(31,0,8,5),ARROW_UP:rect(41,0,12,6),ARROW_DOWN:rect(55,0,12,6),ARROW_RIGHT:rect(69,0,6,12),ARROW_LEFT:rect(77,0,6,12),TREE_VERT:rect(85,0,1,19),TREE_DASH:rect(88,0,9,1),TREE_MINUS:rect(99,0,16,11),TREE_PLUS:rect(117,0,16,11),TREE_MINUS2:rect(135,0,16,11),TREE_PLUS2:rect(153,0,16,11),TREE_VSHIM:rect(171,0,1,20),SORT_ASC:rect(174,0,11,6),SORT_DESC:rect(187,0,11,6)};})();var CURSORS=(function(){function rect(_x,_y,_w,_h){return{x:_x,y:_y,w:_w,h:_h,IID_SPRITEINFO:true,filename:'img:_cursors.gif'};};return{ADD:rect(0,0,11,11),DRAG:rect(13,0,13,9),LINK:rect(28,0,16,7),CONNECTING:rect(46,0,12,12),CANCEL:rect(60,0,14,14),LOCKED:rect(76,0,8,10),MOVE:rect(86,0,10,13),COPY:rect(98,0,14,12),DELETE:rect(114,0,12,12),MOVE_V:rect(128,0,9,15),MOVE_H:rect(139,0,15,9)};})();var ICONS16=(function(){var f='img:_icons16.'+(Raster.isIE6?'gif':'png');function rect(_x,_y,_w,_h){return{x:_x,y:_y,w:16,h:16,IID_SPRITEINFO:true,filename:f};};return{ACCEPT:rect(0,0),ADD:rect(18,0),APPLICATION:rect(36,0),APPLICATION_ADD:rect(54,0),APPLICATION_CASCADE:rect(72,0),APPLICATION_EDIT:rect(90,0),APPLICATION_ERROR:rect(108,0),APPLICATION_FORM:rect(126,0),APPLICATION_FORM_ADD:rect(144,0),APPLICATION_FORM_EDIT:rect(162,0),APPLICATION_GET:rect(180,0),APPLICATION_KEY:rect(198,0),APPLICATION_LIGHTNING:rect(216,0),APPLICATION_LINK:rect(234,0),APPLICATION_OSX:rect(252,0),APPLICATION_OSX_TERMINAL:rect(270,0),APPLICATION_PUT:rect(0,18),APPLICATION_SIDE_BOXES:rect(18,18),APPLICATION_SIDE_CONTRACT:rect(36,18),APPLICATION_SIDE_EXPAND:rect(54,18),APPLICATION_SIDE_LIST:rect(72,18),APPLICATION_SIDE_TREE:rect(90,18),APPLICATION_SPLIT:rect(108,18),APPLICATION_TILE_HORIZONTAL:rect(126,18),APPLICATION_TILE_VERTICAL:rect(144,18),APPLICATION_VIEW_COLUMNS:rect(162,18),APPLICATION_VIEW_ICONS:rect(180,18),APPLICATION_VIEW_LIST:rect(198,18),APPLICATION_VIEW_TILE:rect(216,18),APPLICATION_XP:rect(234,18),APPLICATION_XP_TERMINAL:rect(252,18),ARROW_REFRESH_SMALL:rect(270,18),ARROW_ROTATE_CLOCKWISE:rect(0,36),ARROW_SWITCH:rect(18,36),ASTERISK_YELLOW:rect(36,36),ATTACH:rect(54,36),BASKET:rect(72,36),BASKET_ADD:rect(90,36),BASKET_EDIT:rect(108,36),BELL:rect(126,36),BELL_ADD:rect(144,36),BOOK:rect(162,36),BOOK_ADD:rect(180,36),BOOK_ADDRESSES:rect(198,36),BOOK_EDIT:rect(216,36),BOOK_OPEN:rect(234,36),BRICK:rect(252,36),BRICKS:rect(270,36),BUG:rect(0,54),BULLET_ARROW_DOWN:rect(18,54),BULLET_ARROW_UP:rect(36,54),BULLET_DISK:rect(54,54),BULLET_ERROR:rect(72,54),BULLET_FEED:rect(90,54),BULLET_GO:rect(108,54),BULLET_PICTURE:rect(126,54),BULLET_STAR:rect(144,54),CALCULATOR:rect(162,54),CALCULATOR_ADD:rect(180,54),CALCULATOR_EDIT:rect(198,54),CALENDAR:rect(216,54),CALENDAR_VIEW_DAY:rect(234,54),CALENDAR_VIEW_MONTH:rect(252,54),CAMERA:rect(270,54),CANCEL:rect(0,72),CAR:rect(18,72),CART:rect(36,72),CD:rect(54,72),CHART_BAR:rect(72,72),CHART_BAR_ADD:rect(90,72),CHART_BAR_EDIT:rect(108,72),CHART_ORGANISATION:rect(126,72),CLOCK:rect(144,72),CLOCK_ADD:rect(162,72),COG:rect(180,72),COG_ADD:rect(198,72),COG_EDIT:rect(216,72),COLOR_SWATCH:rect(234,72),COLOR_WHEEL:rect(252,72),COMMENT:rect(270,72),COMMENT_ADD:rect(0,90),COMMENT_EDIT:rect(18,90),COMMENTS:rect(36,90),COMPUTER:rect(54,90),CONNECT:rect(72,90),CONTROL_EJECT:rect(90,90),CONTROL_END:rect(108,90),CONTROL_EQUALIZER:rect(126,90),CONTROL_FASTFORWARD:rect(144,90),CONTROL_PAUSE:rect(162,90),CONTROL_PLAY:rect(180,90),CONTROL_REPEAT:rect(198,90),CONTROL_REWIND:rect(216,90),CONTROL_START:rect(234,90),CONTROL_STOP:rect(252,90),CROSS:rect(270,90),CUP:rect(0,108),CURSOR:rect(18,108),CUT:rect(36,108),DATABASE:rect(54,108),DATABASE_ADD:rect(72,108),DATABASE_EDIT:rect(90,108),DATABASE_TABLE:rect(108,108),DATE:rect(126,108),DELETE:rect(144,108),DISCONNECT:rect(162,108),DISK:rect(180,108),DISK_MULTIPLE:rect(198,108),DRIVE:rect(216,108),DRIVE_CD:rect(234,108),DVD:rect(252,108),EMAIL:rect(270,108),EMAIL_ATTACH:rect(0,126),EMAIL_EDIT:rect(18,126),EMAIL_OPEN:rect(36,126),EMOTICON_EVILGRIN:rect(54,126),EMOTICON_GRIN:rect(72,126),EMOTICON_HAPPY:rect(90,126),EMOTICON_SMILE:rect(108,126),EMOTICON_SURPRISED:rect(126,126),EMOTICON_TONGUE:rect(144,126),EMOTICON_UNHAPPY:rect(162,126),EMOTICON_WINK:rect(180,126),ERROR:rect(198,126),EXCLAMATION:rect(216,126),EYE:rect(234,126),FEED:rect(252,126),FILM:rect(270,126),FIND:rect(0,144),FLAG_GREEN:rect(18,144),FLAG_RED:rect(36,144),FLAG_YELLOW:rect(54,144),FOLDER:rect(72,144),FOLDER_ADD:rect(90,144),FOLDER_PAGE:rect(108,144),FONT:rect(126,144),FONT_ADD:rect(144,144),GROUP:rect(162,144),GROUP_ADD:rect(180,144),HEART:rect(198,144),HELP:rect(216,144),HOURGLASS:rect(234,144),HOUSE:rect(252,144),IMAGE:rect(270,144),IMAGE_ADD:rect(0,162),IMAGES:rect(18,162),INFORMATION:rect(36,162),KEY:rect(54,162),KEY_ADD:rect(72,162),KEYBOARD:rect(90,162),LAYERS:rect(108,162),LAYOUT:rect(126,162),LAYOUT_ADD:rect(144,162),LIGHTBULB:rect(162,162),LIGHTBULB_OFF:rect(180,162),LIGHTNING:rect(198,162),LIGHTNING_ADD:rect(216,162),LINK:rect(234,162),LINK_BREAK:rect(252,162),LOCK:rect(270,162),LOCK_OPEN:rect(0,180),LORRY:rect(18,180),MAGIFIER_ZOOM_OUT:rect(36,180),MAGNIFIER:rect(54,180),MAGNIFIER_ZOOM_IN:rect(72,180),MAP:rect(90,180),MAP_ADD:rect(108,180),MONEY:rect(126,180),MONEY_DOLLAR:rect(144,180),MONITOR:rect(162,180),MONITOR_ADD:rect(180,180),MOUSE:rect(198,180),MUSIC:rect(216,180),NEW:rect(234,180),NEWSPAPER:rect(252,180),NOTE:rect(270,180),NOTE_ADD:rect(0,198),OVERLAYS:rect(18,198),PACKAGE:rect(36,198),PAGE:rect(54,198),PAGE_ADD:rect(72,198),PAGE_ATTACH:rect(90,198),PAGE_COPY:rect(108,198),PAGE_EDIT:rect(126,198),PAGE_EXCEL:rect(144,198),PAGE_PASTE:rect(162,198),PAGE_RED:rect(180,198),PAGE_WHITE:rect(198,198),PAGE_WHITE_ACROBAT:rect(216,198),PAGE_WHITE_OFFICE:rect(234,198),PAGE_WHITE_PAINTBRUSH:rect(252,198),PAGE_WHITE_PASTE:rect(270,198),PAGE_WHITE_PICTURE:rect(0,216),PAGE_WHITE_POWERPOINT:rect(18,216),PAGE_WHITE_PUT:rect(36,216),PAGE_WHITE_STACK:rect(54,216),PAGE_WHITE_TEXT:rect(72,216),PAGE_WHITE_WORD:rect(90,216),PAGE_WHITE_WORLD:rect(108,216),PAGE_WHITE_WRENCH:rect(126,216),PAGE_WHITE_ZIP:rect(144,216),PAGE_WORD:rect(162,216),PAGE_WORLD:rect(180,216),PAINTBRUSH:rect(198,216),PAINTCAN:rect(216,216),PALETTE:rect(234,216),PASTE_PLAIN:rect(252,216),PENCIL:rect(270,216),PHONE:rect(0,234),PHONE_SOUND:rect(18,234),PHOTOS:rect(36,234),PICTURE:rect(54,234),PICTURE_EMPTY:rect(72,234),PICTURES:rect(90,234),PLUGIN:rect(108,234),PLUGIN_DISABLED:rect(126,234),PRINTER:rect(144,234),PRINTER_ADD:rect(162,234),REPORT:rect(180,234),RESULTSET_FIRST:rect(198,234),RESULTSET_LAST:rect(216,234),RESULTSET_NEXT:rect(234,234),RESULTSET_PREVIOUS:rect(252,234),SCRIPT:rect(270,234),SCRIPT_ADD:rect(0,252),SCRIPT_EDIT:rect(18,252),SERVER:rect(36,252),SERVER_ADD:rect(54,252),SERVER_EDIT:rect(72,252),SERVER_ERROR:rect(90,252),SERVER_KEY:rect(108,252),SHADING:rect(126,252),SHAPE_ALIGN_BOTTOM:rect(144,252),SHAPE_ALIGN_CENTER:rect(162,252),SHAPE_ALIGN_LEFT:rect(180,252),SHAPE_ALIGN_MIDDLE:rect(198,252),SHAPE_ALIGN_RIGHT:rect(216,252),SHAPE_ALIGN_TOP:rect(234,252),SHAPE_FLIP_HORIZONTAL:rect(252,252),SHAPE_FLIP_VERTICAL:rect(270,252),SHAPE_GROUP:rect(0,270),SHAPE_HANDLES:rect(18,270),SHAPE_MOVE_BACK:rect(36,270),SHAPE_MOVE_BACKWARDS:rect(54,270),SHAPE_MOVE_FORWARDS:rect(72,270),SHAPE_MOVE_FRONT:rect(90,270),SHAPE_ROTATE_ANTICLOCKWISE:rect(108,270),SHAPE_ROTATE_CLOCKWISE:rect(126,270),SHAPE_SQUARE:rect(144,270),SHAPE_SQUARE_EDIT:rect(162,270),SHAPE_UNGROUP:rect(180,270),SHIELD:rect(198,270),SOUND:rect(216,270),SOUND_LOW:rect(234,270),SOUND_MUTE:rect(252,270),SOUND_NONE:rect(270,270),SPELLCHECK:rect(0,288),STAR:rect(18,288),STOP:rect(36,288),STYLE:rect(54,288),SUM:rect(72,288),TABLE:rect(90,288),TABLE_ADD:rect(108,288),TABLE_EDIT:rect(126,288),TABLE_MULTIPLE:rect(144,288),TAG:rect(162,288),TAG_BLUE:rect(180,288),TAG_GREEN:rect(198,288),TAG_ORANGE:rect(216,288),TAG_RED:rect(234,288),TELEPHONE:rect(252,288),TELEVISION:rect(270,288),TEXT_ALIGN_CENTER:rect(0,306),TEXT_ALIGN_JUSTIFY:rect(18,306),TEXT_ALIGN_LEFT:rect(36,306),TEXT_ALIGN_RIGHT:rect(54,306),TEXT_ALLCAPS:rect(72,306),TEXT_BOLD:rect(90,306),TEXT_COLUMNS:rect(108,306),TEXT_DROPCAPS:rect(126,306),TEXT_HORIZONTALRULE:rect(144,306),TEXT_INDENT:rect(162,306),TEXT_INDENT_REMOVE:rect(180,306),TEXT_ITALIC:rect(198,306),TEXT_LETTER_OMEGA:rect(216,306),TEXT_LETTERSPACING:rect(234,306),TEXT_LINESPACING:rect(252,306),TEXT_LIST_BULLETS:rect(270,306),TEXT_LIST_NUMBERS:rect(0,324),TEXT_SMALLCAPS:rect(18,324),TEXT_STRIKETHROUGH:rect(36,324),TEXT_SUBSCRIPT:rect(54,324),TEXT_SUPERSCRIPT:rect(72,324),TEXT_UNDERLINE:rect(90,324),TEXTFIELD_KEY:rect(108,324),TICK:rect(126,324),TIME:rect(144,324),TIME_ADD:rect(162,324),USER:rect(180,324),USER_ADD:rect(198,324),USER_EDIT:rect(216,324),USER_GREEN:rect(234,324),USER_RED:rect(252,324),USER_SUIT:rect(270,324),VCARD:rect(0,342),VCARD_ADD:rect(18,342),WAND:rect(36,342),WORLD:rect(54,342),WORLD_ADD:rect(72,342),WORLD_EDIT:rect(90,342),WORLD_LINK:rect(108,342),WRENCH:rect(126,342),ZOOM:rect(144,342)};})();var ICONS32=(function(){function rect(_x,_y,_w,_h){return{x:_x,y:_y,w:32,h:32,IID_SPRITEINFO:true,filename:'img:_icons32.png'};};return{ACCESSORIES:rect(0,0),ADDRESS_BOOK:rect(34,0),AUDIO:rect(68,0),AUDIO_MUTED:rect(102,0),AUDIO_VOL_HIGH:rect(136,0),AUDIO_VOL_LOW:rect(170,0),BATTERY:rect(204,0),BATTERY_CAUTION:rect(238,0),CALENDAR:rect(0,34),CAMERA_PHOTO:rect(34,34),CD:rect(68,34),CD_ROM:rect(102,34),CHAT:rect(136,34),COMPUTER:rect(170,34),DIALOG_ERROR:rect(204,34),DIALOG_FAVORITE:rect(238,34),DIALOG_IMPORTANT:rect(0,68),DIALOG_READONLY:rect(34,68),DIALOG_SYSTEM:rect(68,68),DIALOG_TIP:rect(102,68),DIALOG_UNREADABLE:rect(136,68),DIALOG_WARNING:rect(170,68),DISPLAY:rect(204,68),DOCUMENT:rect(238,68),EDIT_COPY:rect(0,102),EDIT_CUT:rect(34,102),EDIT_FIND:rect(68,102),EDIT_PASTE:rect(102,102),EDIT_REDO:rect(136,102),EDIT_UNDO:rect(170,102),FLOPPY:rect(204,102),FOLDER:rect(238,102),GLOBE:rect(0,136),GO_DOWN:rect(34,136),GO_HOME:rect(68,136),GO_NEXT:rect(102,136),GO_PREVIOUS:rect(136,136),GO_UP:rect(170,136),GRAPHICS:rect(204,136),HARDDISK:rect(238,136),HELP:rect(0,170),HTML:rect(34,170),IMAGE:rect(68,170),INTERNET:rect(102,170),MAIL:rect(136,170),MAIL_ATTACHMENT:rect(170,170),MAIL_FORWARD:rect(204,170),MAIL_JUNK:rect(238,170),MAIL_NEW:rect(0,204),MAIL_REPLY:rect(34,204),MAIL_REPLY_ALL:rect(68,204),MOUSE:rect(102,204),NETWORK:rect(136,204),NETWORK_OFFLINE:rect(170,204),OFFICE:rect(204,204),PACKAGE:rect(238,204),PRESENTATION:rect(0,238),PRINTER:rect(34,238),PROPERTIES:rect(68,238),REFRESH:rect(102,238),SEARCH:rect(136,238),SPREADSHEET:rect(170,238),STOP:rect(204,238),SYSTEM:rect(238,238),TERMINAL:rect(0,272),TEXT:rect(34,272),TOOLS:rect(68,272),TRASH:rect(102,272),USERS:rect(136,272),VIDEO:rect(170,272),WEATHER:rect(204,272),WINDOWS:rect(238,272)};})();