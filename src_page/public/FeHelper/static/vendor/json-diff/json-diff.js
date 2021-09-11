let JsonDiff=function(){function t(t,e){this.el=t;let o=this.codemirror=CodeMirror.fromTextArea(this.el,{lineNumbers:!0,mode:{name:"javascript",json:!0},matchBrackets:!0,theme:"tomorrow-night"});e&&o.setValue(e);let n=this;o.on("inputRead",function(t,e){"paste"===e.origin&&function(){let t=o.lineCount();o.autoFormatRange({line:0,ch:0},{line:t}),o.setSelection({line:0,ch:0})}(),i()}),o.on("keyup",i),o.on("change",i),o.on("clear",function(){console.log(arguments)});let r="";function i(){let t=o.getValue();t!==r&&n.trigger("change"),r=t}}function e(){!function(){o.clearMarkers(),n.clearMarkers();let t,e,l=o.getText(),c=n.getText();try{l&&(t=JSON.parse(l)),r&&r("left",!0)}catch(t){console.log("left ==>",t)}try{c&&(e=JSON.parse(c)),r&&r("right",!0)}catch(t){console.log("right ==>",t)}if(!t||!e)return void(t||e?t?r&&r("right",!1):r&&r("left",!1):r&&r("left-right",!1));let h=jsonpatch.compare(t,e);i&&i(h),h.forEach(function(t){try{"remove"===t.op?o.highlightRemoval(t):"add"===t.op?n.highlightAddition(t):"replace"===t.op&&(n.highlightChange(t),o.highlightChange(t))}catch(t){console.warn("error while trying to highlight diff",t)}})}()}t.prototype.getText=function(){return this.codemirror.getValue()},t.prototype.setText=function(t){return this.codemirror.setValue(t)},t.prototype.highlightRemoval=function(t){this._highlight(t,"#DD4444")},t.prototype.highlightAddition=function(t){this._highlight(t,"#4ba2ff")},t.prototype.highlightChange=function(t){this._highlight(t,"#E5E833")},t.prototype._highlight=function(t,e){let o=function(t,e){let o=parse(t).pointers,n=e.path,r={line:o[n].key?o[n].key.line:o[n].value.line,ch:o[n].key?o[n].key.column:o[n].value.column},i={line:o[n].valueEnd.line,ch:o[n].valueEnd.column};return{start:r,end:i}}(this.getText(),t);this.codemirror.markText(o.start,o.end,{css:"background-color: "+e})},t.prototype.clearMarkers=function(){this.codemirror.getAllMarks().forEach(function(t){t.clear()})};let o=null,n=null,r=null,i=null;return{init:function(l,c,h,a){r=h,i=a,BackboneEvents.mixin(t.prototype),o=new t(l,""),n=new t(c,""),o.on("change",e),n.on("change",e),o.codemirror.on("scroll",function(){let t=o.codemirror.getScrollInfo();n.codemirror.scrollTo(t.left,t.top)}),n.codemirror.on("scroll",function(){let t=n.codemirror.getScrollInfo();o.codemirror.scrollTo(t.left,t.top)})}}}();