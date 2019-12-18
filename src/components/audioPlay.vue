<template>
  <div class="audio">
      <div class="audioMask">
      </div>
      <div class="audioContainer">
          <div class="left">
            <div class="fa fa-backward" @click='preSong(-1)'></div>
            <div :class="playstyle" @click='PlayAndPause'></div>
            <div class="fa fa-forward" @click='preSong(1)'></div>
          </div>
          <div class="center">
            <p><span>{{tit}} - {{author}}</span>{{time}} / {{totalTime}}</p>
            <div class="progress" ref='prog'>
              <div class="time" :style='sliderTime'></div>
              <div class="dot" :style='dotTime' @mousedown='changeCurrentTime'></div>
            </div>
          </div>
          <div class="right">
            <div class="volume">
              <div class="volumeIcon">
                <div class="fa fa-volume-up">
                </div>
              </div>
              <div class="volumeProgress" ref='volume'>
                <div class="time" :style='volumPro'></div>
                <div class="dot" :style='valumDot' @mousedown="moveVolume" ref='dot'></div>
              </div>
            </div>
          </div>
          <!-- @pause="onPause"
          @play="onPlay"
          @timeupdate="onTimeupdate"
          @loadedmetadata="onLoadedmetadata"
          preload="auto"
          :src="current.audioHttp"
          controls="controls" -->
          <audio :src="file" ref="audio" style="display:none;" autoplay @timeupdate="onTimeupdate" @loadedmetadata="onLoadedmetadata">亲 您的浏览器不支持html5的audio标签</audio>
      </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    url:String,
    lrc:Array
  },
  data:()=>{
    return{
        file:'',
        play:false,
        maxTime:0,
        currentTime:0,
        sliderTime:{width:0},
        dotTime:{left:0},
        volumPro:{width:'100%'},
        valumDot:{left:'100%'},
        time:'00:00',
        totalTime:'00:00',
        tit:'',
        author:'',
        lyric:[],
        line:0,
        songlrc:{
          firstLine:'',
          secondLine:'',
          lastLine:''
        },
        changeTime:false

    }
  },
  methods:{
    //列表播放
      Play(Val){
        let url='api/v1/restserver/ting?method=baidu.ting.song.play&songid='+Val;
        this.$axios.get(url).then((res)=>{
          console.log(res.data);
          for(let key in res.data){
            if(key=='bitrate'){
              for(let key1 in res.data[key]){
                if(key1=='file_link'){
                  this.file=res.data[key][key1];
                  this.$refs.audio.play();
                  this.sliderTime.width=0;
                  this.dotTime.left=0;
                  this.play=true;
                  if(this.lyric.length>0){
                    this.songlrc.firstLine=this.lyric[0].txt;
                    this.songlrc.secondLine=this.lyric[1].txt;
                    this.songlrc.lastLine=this.lyric[2].txt;
                  }else{
                    this.songlrc.firstLine='';
                    this.songlrc.secondLine='暂无歌词';
                    this.songlrc.lastLine='';
                    this.$emit('changeLyric',this.songlrc);
                  }

                }
              }
            }else if(key=='songinfo'){
              for(let key1 in res.data[key]){
                if(key1=='title'){
                  this.tit=res.data[key][key1];
                }else if(key1=='author'){
                  this.author=res.data[key][key1];
                }
              }
            }
          }
        }).catch(function (error) {
            window.console.log(error);
        });
      },
      //暂停播放控制
      PlayAndPause(){
        if(this.play){
          this.$refs.audio.pause();
          this.play=false;
        }
        else{
          this.$refs.audio.play();
          this.play=true;
        }
      },

      //结束时间
      onLoadedmetadata(res){
          this.maxTime = parseInt(res.target.duration);
          let min=parseInt(this.maxTime/60);
          if(min<10){
            min='0'+min;
          }
          let sec=parseInt(this.maxTime%60);
          if(sec<10){
            sec='0'+sec;
          }
          this.totalTime=min+':'+sec;
      },

      //播放进度改变时执行
      onTimeupdate(res){
        this.currentTime = res.target.currentTime;
        let min=parseInt(this.currentTime/60);
        // let index=this.line;
        if(min<10){
          min='0'+min;
        }
        let sec=parseInt(this.currentTime%60);
        if(sec<10){
          sec='0'+sec;
        }
        this.time=min+':'+sec;
        if(!this.changeTime){
          this.sliderTime.width = parseFloat(
                    (this.currentTime / this.maxTime) * 100
                )+'%';
          this.dotTime.left = parseFloat((this.currentTime / this.maxTime) * 100)+'%';
        }
        if(this.lyric.length>0){
          this.lyricScroll(parseInt(res.target.currentTime*1000),this.line);
        }

      },
      //歌词滚动
      lyricScroll(lrctime,index){
        let time=this.lyric[index].time;
        if(lrctime-180 <=time && time<=lrctime+160 ){
          if(index>0 && index<this.lyric.length-1){
            this.songlrc.firstLine=this.lyric[index-1].txt;
            this.songlrc.secondLine=this.lyric[index].txt;
            this.songlrc.lastLine=this.lyric[index+1].txt;
          }
          if(this.line<this.lyric.length-1){
              this.line+=1;
          }
          this.$emit('changeLyric',this.songlrc);
        }else if(this.changeTime&&time>lrctime+2000&&this.line>0){
          this.line-=1;
        }else if(time<lrctime-1500&&this.line<this.lyric.length-1){
          this.line+=1;
        }
      },
      //调节音量
      moveVolume(){
           // let w = this.$refs.volume.style.outerWidth;
           let w = window.getComputedStyle(this.$refs.volume).width;
           let reg=new RegExp('px','g');
           w=w.replace(reg,'');
           w=Math.round(w);
           // let wx= this.$refs.dot.layerX;
           document.onmousemove = (e)=>{       //鼠标按下并移动的事件
             if(e.clientX-this.$refs.volume.offsetLeft-11<=w && e.clientX-this.$refs.volume.offsetLeft-11>=0){
               // console.log(e.clientX-this.$refs.volume.offsetLeft-11);
               this.valumDot.left=parseFloat(((e.clientX-this.$refs.volume.offsetLeft-11)/w)*100)+'%';
               this.volumPro.width=parseFloat(((e.clientX-this.$refs.volume.offsetLeft-11)/w)*100)+'%';
               this.$refs.audio.volume=parseFloat(((e.clientX-this.$refs.volume.offsetLeft-11)/w));
             }
           };
           document.onmouseup = () => {
               document.onmousemove = null;
               document.onmouseup = null;
           };
      },
      //拖动进度条
      changeCurrentTime(){
          this.changeTime=true;
          let w = window.getComputedStyle(this.$refs.prog).width;
          let reg=new RegExp('px','g');
          w=w.replace(reg,'');
          w=Math.round(w);
          // let wx= this.$refs.dot.layerX;
          document.onmousemove = (e)=>{       //鼠标按下并移动的事件
            if(e.clientX-this.$refs.prog.offsetLeft-11<=w && e.clientX-this.$refs.prog.offsetLeft-11>=0){
              // console.log(e.clientX-this.$refs.volume.offsetLeft-11);
              this.dotTime.left=parseFloat(((e.clientX-this.$refs.prog.offsetLeft-11)/w)*100)+'%';
              this.sliderTime.width=parseFloat(((e.clientX-this.$refs.prog.offsetLeft-11)/w)*100)+'%';
              // this.$refs.audio.currentTime=parseFloat(((e.clientX-this.$refs.prog.offsetLeft-11)/w))*this.$refs.audio.maxTime;
              this.$refs.audio.currentTime=parseFloat(((e.clientX-this.$refs.prog.offsetLeft-11)/w))*this.$refs.audio.duration;
              this.lyricScroll(parseInt(parseFloat(((e.clientX-this.$refs.prog.offsetLeft-11)/w))*this.$refs.audio.duration*1000),this.line)
              console.log(parseFloat(((e.clientX-this.$refs.prog.offsetLeft-11)/w))*this.$refs.audio.duration);
            }
          };
          document.onmouseup = () => {
            // let timepercent=parseFloat(((e.clientX-this.$refs.prog.offsetLeft-11)/w));
            // this.changeTimeAndLyric(timepercent);
            this.changeTime=false;
              document.onmousemove = null;
              document.onmouseup = null;
          };
      },
      //拖动拖动条后猜歌词
      // changeTimeAndLyric(percent){
      //   let len=parseInt(this.lyric.length*percent);
      //   let time=this.lyric[len].time;
      //   if(time>parseInt(this.currentTime*1000)){
      //   }else{
      //   }
      //   alert(len);
      // },
      //上一首
      preSong(num){
        if(num<0){
          this.$emit('preSong',true);
        }else{
          this.$emit('preSong',false);
        }

      }
  },
  watch:{
    url:function(newVal){
      this.Play(newVal);
    },
    lrc:function(newVal){
      this.lyric=[];
      this.lyric=newVal.concat();
    }
  },
  computed:{
    playstyle(){
      return{
        'fa':true,
        'fa-play':!this.play,
        'fa-pause':this.play
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .audio{
    position:fixed;
    width:100%;
    height:80px;
    bottom:0;
    left:0;
    border-top: 1px solid rgba(255,255,255,.3);
  }
  .audioMask{
    position:absolute;
    top:0;
    left:0;
    z-index:1;
    width:100%;
    height:80px;
    background:#fff;
    opacity:1;
  }
  .audioContainer{
    position:absolute;
    top:0;
    left:0;
    z-index:2;
    width:100%;
    display:flex;
    align-items:center;
    height:80px;
  }
  .audioContainer>.left{
    width:30%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .fa-play,.fa-pause{
    color:rgba(51,166,184,1);
    border-radius:50%;
    width:40px;
    height:40px;
    line-height:40px;
    font-size:24px;
    text-align:center;
    border:1px solid rgba(51,166,184,.5);
    cursor:pointer;
    margin:0 20px;
  }
  .fa-backward,.fa-forward{
    color:rgba(51,166,184,1);
    border-radius:50%;
    width:35px;
    height:35px;
    line-height:35px;
    font-size:20px;
    text-align:center;
    border:1px solid rgba(51,166,184,.5);
    cursor:pointer;
  }
  .center{
    width:50%;
  }
  .center .progress{
    width:100%;
    margin:0 auto;
    background:rgba(128,128,128,.5);
    height:2px;
    border-radius:1px;
    position:relative;
  }
  .time{
    background:rgba(51,166,184,1);
    height:2px;
  }
  .center>p{
    text-align:right;
    padding-right:10px;
    line-height:25px;
    font-size:12px;
    color:rgba(128,128,128,.5);
    width:100%;
  }
    .center>p span{
      float:left;
      display:inline-block;
      color:rgba(128,128,128,.8);
    }
.dot{
      width:10px;
      height:10px;
      border-radius:50%;
      background:rgba(51,166,184,1);
      position:absolute;
      top:-4px;
      cursor:pointer;
    }
    .right{
      width:20%;
      padding-left:5%;
    }
    .volume{
      width:100%;
      display:flex;
      flex-wrap:wrap;
      align-items:center;
    }
    .volumeIcon{
      width:auto;
      margin-right:10px;
    }
    .volumeIcon>div{
      font-size:18px;
      color:rgba(51,166,184,1);
    }
    .right .volumeProgress{
      width:50%;
      background:rgba(128,128,128,.5);
      height:2px;
      border-radius:1px;
      position:relative;
    }
    .volume .dot{
      cursor:pointer;
    }
</style>
