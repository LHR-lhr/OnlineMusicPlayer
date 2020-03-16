import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    islist:false,
    ind:-1
  },
  mutations:{
    playList(state){
      state.islist=true
    },
    clickList(state,index){
      state.ind=index
    }
  }
})

export default store
