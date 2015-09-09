var obj = document.getelementsbytagname("head")[0];
var scripts = obj.getelementsbytagname("script");
var flag = 0;
var enw_host = "";
var httpport = ':80';
var httpsport = ':443';
var protocol = location.protocol;
if (protocol.match(/https:/) && (navigator.useragent.indexof("trident/7.0") > 0 || navigator.useragent.indexof("trident/8.0") > 0 || navigator.useragent.indexof("edge/") > 0)) {
    enw_host = 'http://www.myendnoteweb.com' + httpport;
} else {
    var port = protocol.match(/https:/) ? httpsport : httpport;
    enw_host = protocol + '//www.myendnoteweb.com' + port;
}
for (i = 0; i < scripts.length; i++) {
    if (scripts[i].src.match(/bookmarklet.js/)) {
        flag = 1;
        break;
    }
}
if (this.disabled == undefined && flag == 0) {
    this.disabled = true;
    try {
        var x = document.createelement('script');
        x.type = 'text/javascript';
        x.src = 'https://raw.githubusercontent.com/leoman730/endnoteclipperforscholar/master/bookmarklet.js?' + (new date().gettime() / 100000);
        document.getelementsbytagname('head')[0].appendchild(x);
    } catch (e) {
        console.log(e);
    };
}
this.disabled = undefined;
void(0)
