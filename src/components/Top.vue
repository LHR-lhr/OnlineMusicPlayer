<template>
  <div class="top">
      <div>PP音乐</div>
      <div class="search" v-show="flag">
        <input type="text" name="search" v-model="val" placeholder="请输入你想要的音乐" @keyup.enter='search'>
          <button @click="search">搜索</button>
      </div>
      <div class="">
          <!-- <span @click='errorTips'>注册</span>
          <span @click='errorTips'>登录</span> -->
      </div>
      <Contai :songs='song'></Contai>
  </div>
</template>
<!--http://msearchcdn.kugou.com/api/v3/search/song?showtype=14&highlight=em&pagesize=30&tag_aggr=1&tagtype=全部&plat=0&sver=5&keyword=你好&correct=1&api_ver=1&version=9108&page=1&area_code=1&tag=1&with_res_tag=1-->
<script>
import Contai from './container.vue';
export default {
  name: 'Top',
  components:{
    Contai
  },
  data:function(){
    return {
      flag:true,
        val:'',
        url:'',
        song:[]
    }
  },
  props: {
    msg: String
  },
    methods:{
      search(){
          this.url='api/v1/restserver/ting?method=baidu.ting.search.catalogSug&query='+this.val
          // method=baidu.ting.search.catalogSug&query='+this.val
          this.$axios.get(this.url).then((res) =>{
            console.log(res.data);
              for(let key in res.data){
                if(key=='song'){
                  this.song=res.data[key];
                  // console.log(this.song);
                }else if(key=='error_code'){
                  if(res.data[key]==22001){
                    alert('什么也没有哦')
                  }
                }
              }
          }).catch(function (error) {
              window.console.log(error);
          });
          this.$store.commit('clickList',-1);
      },
      //错误提示
      errorTips(){
        alert('功能待开发中');
      }

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top{
  width:100%;
    display:flex;
    flex-wrap:wrap;
    align-items:center;
    position: relative;
    /* border-top: 1px solid rgba(255,255,255,.3); */
}
.top>div:nth-child(1){
  width:20%;
    font-size: 18px;
    font-family: '等线';
    line-height: 70px;
    text-align: left;
    padding-left: 20px;
    box-sizing: border-box;
    color:rgba(51,166,184,1);
    font-weight:500;
}
.top>div:nth-child(2){
  width:60%;
    text-align: right;
    box-sizing: border-box;
}
.search>input{
    display: inline-block;
    width: 50%;
    height: 30px;
    border: none;
    padding-left: 20px;
    color: rgba(0,0,0,.5);
    vertical-align: top;
}
.search>button{
    display: inline-block;
    width: 100px;
    height: 30px;
    border: none;
    background: rgba(51,166,184,1);
    color: #fff;
    cursor: pointer;
}
.top>div:nth-child(3){
  width:20%;
    box-sizing: border-box;
    text-align: center;
}
.top>div:nth-child(3) span{
    display: inline-block;
    width: auto;
    margin: 0 10px;
    line-height: 70px;
    border: none;
    color: rgba(0,0,0,.8);
    cursor: pointer;
    font-size: 12px;

}

</style>
