new Vue({el:"#pageContainer",data:{errorMessage:"",errorHighlight:!1},mounted:function(){JsonDiff.init(this.$refs.srcLeft,this.$refs.srcRight,(r,e)=>{e?(this.errorMessage="两侧JSON比对完成！",this.errorHighlight=!1):(this.errorMessage={left:"左",right:"右","left-right":"两"}[r]+"侧JSON不合法！",this.errorHighlight=!0)},r=>{this.errorHighlight||(r.length?this.errorMessage+="共有 "+r.length+" 处不一致！":this.errorMessage+="左右两侧JSON内容一致！")})}});