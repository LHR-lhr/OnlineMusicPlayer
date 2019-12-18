<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <Top />
    <!-- <Contai/> -->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Top from './components/Top.vue'
// import Center from './components/container.vue'

export default {
  name: 'app',
  components: {
    Top:Top,
    // Contai:Center
  }
}
</script>

<style>
*{
  margin:0;
  padding:0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  min-height: 100vh;
  /* background: rgba(51,166,184,.3); */
  position:relative;
}
#app:before{
  content:'';
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:url('./assets/bg1.jpg') no-repeat 0 0 ;
  background-size:100vw auto;
  background-attachment:fixed;
  filter:blur(15px);
  z-index: -2;
}
#app:after{
  content:'';
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(128,128,128,.2) ;
  z-index: -1;
  opacity:.4;
}
</style>
