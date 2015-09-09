/**
 * This is a modified version of the endnote bookmarket.
 * Use this to save endnote citations from Google Scholar.
 * 
 */

var title = null;
var baseHref = null;
var pageform = null;
var pageformContainer = null;
var url = null;
var ENW_HOST = "www.myendnoteweb.com";
var httpport = ":80";
var httpsport = ":443";
var enableBookmarlet= 'yes';
var scholarMessage = "To capture references from Google Scholar please turn on Show links to import citations into Endnote.";
var captureUnavailableMessage = "EndNote online Capture Bookmarklet is unavailable";
var bookmarkletURLs = new Array("services.oxfordjournals.org","jstor.org","ncbi.nlm.nih.gov","pubs.acs.org","worldcat.org","ingentaconnect.com","ieeexplore.ieee.org","pubs.ama-assn.org","scholar.google.com","highwire.stanford.edu");
var bookmarkletCaptureMethods = new Array("getOxfordData","getJstorData","getpubmeddata","getpubacsdata","getworldcatdata","getIngentaData","getIEEEData","getPubsData","getscholardata","getHighwireData");
var SERVER = null;
var protocol=location.protocol;
if( protocol.match(/https:/) && (navigator.userAgent.indexOf("Trident/7.0") > 0 || navigator.userAgent.indexOf("Trident/8.0") > 0 || navigator.userAgent.indexOf("Edge/") > 0)) {
SERVER = 'http://'+ENW_HOST+httpport;
}
else {
var port=protocol.match(/https:/)?httpsport:httpport;
SERVER=protocol+'//'+ENW_HOST+port;
}
/**
 * Draw a floating div over the current page
 * 
 * @param clip
 * @param clippingForm
 * @param baseURL
 * @return
 */
showClipperPanel = function() {
  var panel;
  panel = div("e_clipper");
  panel.style.position = "absolute";
  panel.style.right = "0px";
  panel.style.margin = "10px";
  panel.style.top = scrollTop(window) + "px";
  panel.style.zIndex = "15000";

  var data;
  data = div("e_data", panel);
  data.style.position = "absolute";
  data.style.width = "0px";
  data.style.height = "0px";
  data.style.margin = "0px";
  data.style.top = "0px";


  var view;
  var width;
  view = div("e_view", panel);
  view.style.backgroundColor = "white";
  view.style.width = "640px";
  view.style.height = "517px";
  view.style.border = "solid rgb(180,180,180)";
  view.style.borderWidth = "6px";
  view.style.position = "fixed";
  view.style.top = "6px";
  view.style.right = "6px";
  var p=document.getElementById("e_data");
  if (navigator.appName == "Microsoft Internet Explorer"){
  width="width:640px;";
  }
  else {
	 width="width:640px;";
  }
  view.innerHTML = '<div id="heading" style="height:17px; background-color:rgb(204,204,204); overflow-x:hidden; overflow-y:hidden;"+width> '
    + '<div id="ENWeb" style="float:left; width:300px; padding-left:10px; background-color:rgb(204,204,204);'
	+ 'text-align:left;"> <a href="javascript:goToENWeb();" ><font size="1" color="#005a84" face="arial">Go to EndNote</font></a></div> '
	+ '<div id="close" style="float:right; width:300px; padding-right:10px; background-color:rgb(204,204,204);'
	+ 'text-align:right"><a href="javascript:closeIframe();"><font size="1" color="#005a84" face="arial">Close[x]</font></a>'
    + '</div></div> <iframe marginheight="0px" id="e_iframe" name="e_iframe" src="#" scrolling="auto" frameborder="0" style="width:100%;'
	+ 'height:97%;border:1px; padding:0px; margin:0px;" onload="onload_iframe()"></iframe>';


  document.getElementsByTagName("body")[0].appendChild(panel);

  window.document.body.appendChild(pageformContainer);
  pageform.submit();

  return 1;
};
goToENWeb = function() {
	window.location.target="_blank";
	window.open(SERVER);
}

delete_node = function() {
	var obj=document.getElementsByTagName("head")[0];
		var scripts=obj.getElementsByTagName("SCRIPT");
		for(i=0;i<scripts.length;i++) {
			if(scripts[i].src.match(/bookmarklet.js/)) {		
			    var node=scripts[i];
				node.parentNode.removeChild(node);  
				break;
			}		
		}
}

closeIframe =function() {
	var p=document.getElementById("e_data");
	if(p != undefined) {
	delete_node();
	p.parentNode.parentNode.removeChild(p.parentNode);
	}
}

onload_iframe = function() {
	var p=document.getElementById("e_data");
	if (p && p.style ) {
		c = p.style.zIndex; 
		if (c==7) {
			delete_node();
			p.parentNode.parentNode.removeChild(p.parentNode);
		}
		p.style.zIndex = ++c;
	}
}
	
div = function(id, parentElement) {
	var d = makeElement("div", parentElement);
    d.id = id;
    d.style.border = "0";
    d.style.margin = "0";
    d.style.padding = "0";
    d.style.position = "relative";
	return d;
};

makeForm = function() {
	var form;
    var html="";
    url = window.document.location.href;
    for (var i = 0; i < bookmarkletURLs.length; i++) {
		var captureURL=bookmarkletURLs[i];
		if(url.match(captureURL)) {
			var captureMethod = bookmarkletCaptureMethods[i];
			html = eval(captureMethod+ '()');
			if(html == false) {
				return false;
			}	
			break;
		}
	}

	if(html == "") {
		html = gethttml();
	}   
	 	

  var target = 'e_iframe';
    
  var div = makeElement('div');
  div.style.display = 'none';
  div.id = "writenote_clip_form_parent";

 
  form = makeElement('form', div);
  form.action = SERVER+"/Bookmarklet/Bookmarklet.html?func=capture";
  form.method = 'POST';
  form.target = target || '_top';
  form.enctype = "multipart/form-data";
  form.acceptCharset = "UTF-8";
  form.name = "writenote_clip_form";
  form.id = "writenote_clip_form";


  var url = makeElement('input', form);
  url.name = 'url';
  url.value = location.href;
  url.type = 'text';
  var titleNode = makeElement('input', form);
  titleNode.name = 'title';
  titleNode.value = title;
  titleNode.type = 'text';

  var body = makeElement('textarea', form);
  body.name = 'body';
  body.value = html;
  pageform = form;
  pageformContainer = div;

};

 function getElementsByClassName(class_name) {
    var docList = this.all || this.getElementsByTagName('*');
    var matchArray = new Array();

    var re1 = new RegExp("(?:^|\\s)"+class_name+"(?:\\s|$)");
    for (var i = 0; i < docList.length; i++) {
        if (re1.test(docList[i].className))  {
            matchArray[matchArray.length] = docList[i];
        }
    }

    return matchArray;
}



getJstorData = function() {
var content="";
var subCite;
var obj=document.getElementsByTagName("body")[0];
subCite =obj.getElementsByClassName('subCite');

if(subCite.length > 0) {
	
	for(i=0;i<subCite.length;i++) {
		var inputs=subCite[i].getElementsByTagName("input");
		
		if(inputs.length > 0) {
			
			for(j=0;j<inputs.length;j++) {
				if((inputs[j].getAttribute('type')=='checkbox') && (inputs[j].getAttribute('name') == "doi")) {
					if(inputs[j].checked == false) {
						
					}
					else if(inputs[j].checked == true) {
						
		 			    content=content+subCite[i].innerHTML;					    
					}	   
					
				}				
			}			
		}				
		
	}
}
if(content == ""){
	content=gethttml();
}
return content;
}



getIngentaData = function() {
var content="";
var formcontrols;
var obj=document.getElementsByTagName("body")[0];
formcontrols =obj.getElementsByClassName('form-controls ');

if(formcontrols.length > 0) {
	
	for(i=0;i<formcontrols.length;i++) {
		var inputs=formcontrols[i].getElementsByTagName("input");
		
		if(inputs.length > 0) {
			
			for(j=0;j<inputs.length;j++) {
				if((inputs[j].getAttribute('type')=='checkbox') && (inputs[j].getAttribute('name').match(/art/))) {
					if(inputs[j].checked == false) {
						
					}
					else if(inputs[j].checked == true) {
						
		 			    content=content+formcontrols[i].innerHTML;					    
					}	   
					
				}				
			}			
		}				
		
	}
}
if(content == ""){
	content=gethttml();
}
return content;
}



getpubacsdata = function() {
var content="";
var articleBox;
var obj=document.getElementsByTagName("body")[0];
articleBox =obj.getElementsByClassName('articleBox ');


if(articleBox.length > 0) {
	
	for(i=0;i<articleBox.length;i++) {
		var inputs=articleBox[i].getElementsByTagName("input");
		
		if(inputs.length > 0) {
			
			for(j=0;j<inputs.length;j++) {
				if((inputs[j].getAttribute('type')=='checkbox') && (inputs[j].getAttribute('name')=='doi')) {
					if(inputs[j].checked == false) {
						
					}
					else if(inputs[j].checked == true) {
						
		 			    content=content+articleBox[i].innerHTML;					    
					}	   
					
				}				
			}			
		}				
		
	}
}
if(content == ""){
	content=gethttml();
}
return content;
}



getHighwireData = function() {
var content="";
var obj=document.getElementsByTagName("body")[0];
var inputs=obj.getElementsByTagName("input");
if(inputs.length > 0) {
	for(j=0;j<inputs.length;j++) {		
		if(inputs[j].getAttribute('type')=='checkbox')  {			
			if(inputs[j].checked == false) {	
				inputs[j].removeAttribute('checked');
			}
			else if(inputs[j].checked == true) {
				inputs[j].setAttribute('checked',true)									    
			}
		}
	}
}		
content=gethttml();
return content;
}


getOxfordData = function() {
var content="";
var obj=document.getElementsByTagName("body")[0];
var inputs=obj.getElementsByTagName("input");
if(inputs.length > 0) {
	for(j=0;j<inputs.length;j++) {		
		if(inputs[j].getAttribute('type')=='checkbox')  {			
			if(inputs[j].checked == false) {	
				inputs[j].removeAttribute('checked');
			}
			else if(inputs[j].checked == true) {
				inputs[j].setAttribute('checked',true)									    
			}
		}
	}
}		
content=gethttml();
return content;
}

getPubsData = function() {
var content="";
var obj=document.getElementsByTagName("body")[0];
var inputs=obj.getElementsByTagName("input");
if(inputs.length > 0) {
	for(j=0;j<inputs.length;j++) {		
		if(inputs[j].getAttribute('type')=='checkbox')  {			
			if(inputs[j].checked == true && inputs[j].getAttribute('name')=='gca') {					
				inputs[j].setAttribute('checked',true)
			}
			else if(inputs[j].checked == false && inputs[j].getAttribute('name')=='gca'){
				inputs[j].removeAttribute('checked');
			}
		}
	}
}		
content=gethttml();
return content;
}


getscholardata = function() {
	var strURL;
	var content="";
	var obj=document.getElementsByTagName("body")[0];
	var gs_fl;
	var foundElements;
	if (navigator.appName == "Microsoft Internet Explorer"){		
		document.getElementsByClass = getElementsByClassName;
		gs_fl= document.getElementsByClass("gs_fl"); 
	}
	else {
		gs_fl=obj.getElementsByClassName('gs_fl');
	}
	
	if(gs_fl.length > 0) {
		for(i=0;i<gs_fl.length;i++) {
			var a_tags=gs_fl[i].getElementsByTagName("a");
			for(j=0;j<a_tags.length;j++) {
				if(a_tags[j].innerHTML == "Import into EndNote") {
					strURL='http://scholar.google.com'+a_tags[j].getAttribute('href');
					var req = new XMLHttpRequest();
					req.open("GET", strURL, false);
					req.send();
					content += req.responseText + "\n";
				}
			}
			if(content == "") {				
				alert(scholarMessage);
				return false;
			}
		}
	}
	return content;
	
}


getworldcatdata = function() {
var content="";
var menuElems;
var obj=document.getElementsByTagName("body")[0];
if (navigator.appName == "Microsoft Internet Explorer"){
document.getElementsByClass = getElementsByClassName;
menuElems= document.getElementsByClass("menuElem"); 
}

else
	{
	menuElems=obj.getElementsByClassName('menuElem');
	}

if(menuElems.length > 0) {
	for(i=0;i<menuElems.length;i++) {
		var inputs=menuElems[i].getElementsByTagName("input");
		if(inputs.length > 0) {
			for(j=0;j<inputs.length;j++) {
				if(inputs[j].getAttribute('type')=='checkbox') {
					if(inputs[j].checked == false) {
					}
					else if(inputs[j].checked == true) {
		 			    content=content+menuElems[i].innerHTML;
					}	   
					
				}				
			}			
		}				
	}
}
if(content == ""){
	content=window.document.documentElement.innerHTML;
}
return content;
}


getpubmeddata = function () {
var content="";
var obj=document.getElementsByTagName("body")[0];
var rprts;
var foundElements;
if (navigator.appName == "Microsoft Internet Explorer"){
document.getElementsByClass = getElementsByClassName;
rprts= document.getElementsByClass("rprt"); 
}

else
	{
	rprts=obj.getElementsByClassName('rprt');
	}

if(rprts.length > 0) {
	for(i=0;i<rprts.length;i++) {
		var inputs=rprts[i].getElementsByTagName("input");
		if(inputs.length > 0) {
			for(j=0;j<inputs.length;j++) {
				if(inputs[j].getAttribute('type')=='checkbox') {
					if(inputs[j].checked == false) {
					}
					else if(inputs[j].checked == true) {
		 			    content=content+rprts[i].innerHTML;
					}	   
					
				}				
			}			
		}				
	}
}
if(content == ""){
	content=window.document.documentElement.innerHTML;
}
return content;
}

getIEEEData = function() {
var content="";
var obj=document.getElementsByTagName("body")[0];
var refs;
var foundElements;
if (navigator.appName == "Microsoft Internet Explorer") {
	document.getElementsByClass = getElementsByClassName;
	refs= document.getElementsByClass("noAbstract"); 
}
else {
	refs=obj.getElementsByClassName('noAbstract');
}

if(refs.length > 0) {
	for(i=0;i<refs.length;i++) {
		var inputs=refs[i].getElementsByTagName("input");
		if(inputs.length > 0) {
			for(j=0;j<inputs.length;j++) {
				if(inputs[j].getAttribute('type')=='checkbox') {
					if(inputs[j].checked == false) {
					}
					else if(inputs[j].checked == true) {
		 			    content=content+refs[i].innerHTML;
					}	   
					
				}				
			}			
		}				
	}
}
if(content == ""){
	content=window.document.documentElement.innerHTML;
}
return content;
}


gethttml = function() {
	var content=window.document.documentElement.innerHTML;
	return content;
}


makeElement = function(elementName, parentElement) {
  var element;
  element = window.document.createElement(elementName);
  if (parentElement) {
    parentElement.appendChild(element);
  }
  return element;
};


scrollTop = function() {
  return  filterResults(
          window.pageYOffset ? window.pageYOffset : 0,
          window.document.documentElement ? window.document.documentElement.scrollTop
              : 0,
          window.document.body ? window.document.body.scrollTop
              : 0);
};



filterResults = function(n_win, n_docel, n_body) {
  var n_result = n_win ? n_win : 0;
  if (n_docel && (!n_result || (n_result > n_docel)))
    n_result = n_docel;
  return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
};




initialize = function() {

if(document.getElementById("e_data") == undefined) {
}
else {
	closeIframe();

}
var	allCookies = document.cookie;
  var aWindow = null;
  aWindow = window;
   var meta = aWindow.document.createElement('meta');
meta.setAttribute('http-equiv', 'X-UA-Compatible');
meta.setAttribute('content', 'IE=IE8');
aWindow.document.getElementsByTagName('head')[0].appendChild(meta);
  title = (typeof aWindow.document.title == 'string') ? (aWindow.document.title.replace(/[\s\t\n]+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "")) : "";
  var clipper=makeForm();
	if(clipper == false) {
		delete_node();
		return;
	}
  showClipperPanel();

};

var ENWCapture_loader = setInterval(function() { 
				   clearInterval(ENWCapture_loader);
				   ENWCapture_loader = null;
				   if (enableBookmarlet == "no") {					   
					   alert(captureUnavailableMessage);
					   delete_node();
					   return;
				   }
                   initialize(); 
}, 300);

