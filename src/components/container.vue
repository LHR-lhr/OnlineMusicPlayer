<template>
  <div class="container">
      <div class="containerTop">
        <div class="songlistTop">
          <div>序号</div>
          <div>歌曲名</div>
          <div>歌手名</div>
          <div>所属专辑</div>
          <div>其他操作</div>
        </div>
        <div class="songlist">
        <ul>
          <li v-for='(val,key) in song_list' :key='key' @dblclick="chose(key)">
            <div class="songlist_container">
              <div>{{key+1}}</div>
              <div>{{val.title}}</div>
              <div>{{val.artist_name}}</div>
              <div>{{val.album_title}}</div>
              <div>
                <div class="fa fa-download" @click='dlSong(key)'>

                </div>
              </div>
            </div>
          </li>
        </ul>
        </div>
      </div>
      <div class='containerLeft'>
          <div class="songImg">
            <img :src="img" :alt="palysong.album_title">
          </div>
          <div class="songInfo">
            <p><span>歌曲名</span>{{palysong.title}}</p>
            <p><span>专辑名</span>{{palysong.album_title}}</p>
            <p><span>歌手名</span>{{palysong.artist_name}}</p>
          </div>
          <div class="lyric">
            <p>{{lyric.firstLine}}</p>
            <p>{{lyric.secondLine}}</p>
            <p>{{lyric.lastLine}}</p>
          </div>
      </div>
      <!-- v-on:changeLyric='changeLyric' -->
      <audioPlay :url="url" :lrc="lrc" ref='audioPlay' v-on:changeLyric='changeLyric' v-on:preSong='preSong'></audioPlay>
  </div>
</template>

<script>
// 引入组件
import audioPlay from'./audioPlay.vue'
import Lyric from 'lyric-parser'

export default {
  name: 'Center',
  components:{
    audioPlay:audioPlay
  },
  props: {
    msg: String,
    songs:Array
  },
  data:()=>{
    return {
        song:[],
        music:{},
        song_list:[],
        file:'',
        url:'',
        palysong:{},
        img:require('../assets/songimg.png'),
        lrc:[],
        lyric:{
          firstLine:'',
          secondLine:'',
          lastLine:''
        },
        listIndex:0
    }
  },
  methods:{
    chose(index){
      this.listIndex=index;
      // this.url='api/v1/restserver/ting?method=baidu.ting.song.play&songid='+this.song_list[index].song_id;
      this.url=this.song_list[index].song_id;
      this.palysong=this.song_list[index];

      let url='api/v1/restserver/ting?method=baidu.ting.song.play&songid='+this.song_list[index].song_id;
      this.$axios.get(url).then((res)=>{
        for(let key in res.data){
          if(key=='songinfo'){
            for(let key1 in res.data[key]){
              if(key1=='pic_big'){
                this.img=res.data[key][key1];
              }
            }
          }
        }
      }).catch(function (error) {
          window.console.log(error);
      });

      let lrcurl='api/v1/restserver/ting?method=baidu.ting.song.lry&songid='+this.song_list[index].song_id;
      this.$axios.get(lrcurl).then((res)=>{
        for(let key in res.data){
          if(key=='lrcContent'){
            // this.lrc=JSON.parse(JSON.stringify(res.data[key]));
            let lrc=new Lyric(res.data[key]).lines
            this.lrc=JSON.parse(JSON.stringify(lrc));

          }
        }
      }).catch(function (error) {
          window.console.log(error);
      });
       this.$refs.audioPlay.line=0;
    },
    //更新歌单
    UpdateSong(song){
      this.song_list=[];
      let songs=JSON.parse(JSON.stringify(song));
      let length=songs.length;
      //重新处理数据
      this.getData(0,length,songs)

  },
  //获取数据
  getData(index,length,songs){
    let song=songs[index];
    for(let key1 in song){
      if(key1=='songname'){
        this.music['title']=song[key1];
      }else if(key1=='artistname'){
        this.music['artist_name']=song[key1];
      }else if(key1=='songid'){
        this.music['song_id']=song[key1];
        //搜索专辑
        let url='api/v1/restserver/ting?method=baidu.ting.song.play&songid='+song[key1];
        this.$axios.get(url).then((res)=>{
          for(let key in res.data){
            if(key=='songinfo'){
              for(let key1 in res.data[key]){
                if(key1=='album_title'){
                  this.music['album_title']=res.data[key][key1];
                  index+=1;
                  let eins=JSON.parse(JSON.stringify(this.music));
                  this.song_list.push(eins);
                  if(index<length){
                    this.getData(index,length,songs);
                  }
                }
              }
            }
          }
        }).catch(function (error) {
            window.console.log(error);
        });

      }
    }
    // this.song_list=Object.assign({}, this.song_list);
    // this.song_list=JSON.parse(JSON.stringify(this.song_list));
    // let eins=JSON.parse(JSON.stringify(this.music));
    // this.song_list[(parseInt(index)+len).toString()]=JSON.parse(JSON.stringify(eins));
    // this.song_list.push(eins);
    // if(++index<length){
    //   this.getData(index++,length,songs);
    // }
  },
  //子组件更新歌词
  changeLyric(data){
    this.lyric=data;
  },
  //上一首
  preSong(data){
    if(data){
      this.listIndex-=1;
      if(this.listIndex<0){
        alert('已经到达第一首了');
      }else{
        this.chose(this.listIndex);
      }
    }else{
      this.listIndex+=1;
      if(this.listIndex>this.song_list.length){
        alert('已经到达世界的尽头');
      }else{
        this.chose(this.listIndex);
      }
    }
  },
  //下载
  dlSong(key){
    let t=new Date().getTime();
    let url='api/v1/restserver/ting?method=baidu.ting.song.downWeb&songid='+this.song_list[key].song_id+'&bit=128&_t='+t;
    this.$axios.get(url).then((res)=>{
      console.log(res);
      alert('下载功能暂时不可用');
    }).catch(function(error){
      console.log(error);
    })
  }
  },
  created(){
      this.$axios.get('api/v1/restserver/ting?method=baidu.ting.billboard.billList&type=1&size=20&offset=0').then(
        (res)=>{
          // let len=this.song_list.length;
          for(let key in res.data){
            if(key=='song_list'){
              this.song=res.data[key];
              let songs=this.song;
              songs=JSON.stringify(songs);
              songs=JSON.parse(songs);
              //重新处理数据
              for(let index in songs){
                let song=songs[index];
                for(let key1 in song){
                  if(key1=='album_title'){
                    this.music['album_title']=song[key1];
                  }else if(key1=='title'){
                    this.music['title']=song[key1];
                  }else if(key1=='artist_name'){
                    this.music['artist_name']=song[key1];
                  }else if(key1=='song_id'){
                    this.music['song_id']=song[key1];
                  }
                }
                let eins=JSON.parse(JSON.stringify(this.music));
                this.song_list.push(eins);
              }
            }
          }
        }).catch(function (error) {
            window.console.log(error);
        });
  },
  watch:{
    songs:function(newVal){
      this.UpdateSong(newVal);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0;
  width:100%;
  cursor:default;
  border-bottom: 1px solid rgba(255,255,255,.3);
}
a {
  color: #42b983;
}
.container ,.songlistTop{
  width:100%;
}
.container{
  margin-bottom:80px;
}
.containerTop{
  width:75%;
  float:left;
}
.containerLeft{
  width:25%;
    float:left;
}
.containerLeft>div{
  text-align:center;
}
.containerLeft>div p span{
  display:inline-block;
  margin-right:10px;
  font-size:14px;
  color:rgba(0,0,0,.5)
}
.containerLeft>.songInfo p{
  font-size:14px;
  color:rgba(0,0,0,.8);
}
.songlistTop{
  display:inline-block;
  border-bottom: 1px solid rgba(255,255,255,.3);
}
.songlistTop>div,.songlist_container>div{
  font-size:14px;
  line-height:50px;
  text-align:center;
  color:rgba(0,0,0,.5);
  float:left;
  height:auto;
  user-select:none;
}
.songlistTop>div:nth-child(1),.songlist_container>div:nth-child(1){
  width:5%;
}
.songlistTop>div:nth-child(2),.songlist_container>div:nth-child(2){
  width:25%;
}
.songlistTop>div:nth-child(3),.songlist_container>div:nth-child(3){
  width:25%;
}
.songlistTop>div:nth-child(4),.songlist_container>div:nth-child(4){
  width:25%;
}
.songlistTop>div:nth-child(5),.songlist_container>div:nth-child(5){
  width:20%;
}
.songImg img{
  width:150px;
  height:150px;
  display:inline-block;
}
.songImg{
  margin-top:50px;
}
.songInfo{
  margin-top:30px;
}
.songInfo p{
  color:#fff!important;
}
.lyric{
  margin-top:50px;
}
.lyric p{
  font-size:14px;
  color:#fff;
  line-height:32px;
  font-family:"等线 Light";
  user-select:none;
  -moz-user-select:none;
}
.lyric p:nth-child(2){
  font-size:18px;
  color:rgba(51,166,184,1);
  line-height:32px;
  font-weight:600;
  font-family:"等线";
}
.fa-download{
  color:#fff;
  cursor:pointer;
}
</style>
