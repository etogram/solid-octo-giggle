<template>
  <div id="app" class="container-fluid" style="font-family:'Courier New', Courier, 'Liberation Mono', monospace;'">
    <div class="row mt-3">
        <h1 class="mx-auto title-font-responsive-vw">EVE echoes planetary production finder</h1>
    </div>

    <div class="row">

      <autofill :items="autofillItems" v-on:input="onSearchChange" v-on:window-width-change="onWidthChange" v-on:search-set="onSearchSet" v-on:reset="onSearchReset" v-on:search-opt="onSearchOptChange"></autofill>

      <div class="col-xl-3">
          <template >
            <div>
              <label class="mb-0 font-responsive-vw" for="sb-jumps" >Jumps</label>
              <b-form-spinbutton class="mt-0" id="sb-jumps" v-model="jumps" min="0" max="10" step="1" :size="responsiveSize"
              ></b-form-spinbutton>
            </div>
          </template>
      </div>

      <div class="col-xl-3">
          <template >
            <div>
              <label class="mb-0 font-responsive-vw" for="sb-step">Security level</label>
              <b-form-spinbutton class="mt-0" id="sb-step" v-model="securityLevel" min="-1" max="1" step="0.1" :size="responsiveSize"
              ></b-form-spinbutton>
            </div>
          </template>
      </div>
    </div>

    <div class="row mx-3 my-3">
      <tags v-on:update-tags="updateTags" :tags="materialsOpt"></tags>
    </div>

    <div class="row mt-3">
        <b-button  @click="find" variant="outline-secondary" class="mx-auto col-xl-6">Find</b-button>
    </div>

    <div class="row mt-3">
        <b-list-group class="mx-auto">
          <b-list-group-item v-for="(result,index) in results" :key="index" :variant="result.variant">
            {{result.text}}
          </b-list-group-item>
        </b-list-group>
    </div>

  

  </div>
</template>

<script>

import Tags from './components/Tags.vue'
import Autofill from './components/Autofill.vue'

export default {
  name: 'App',
  components: {
    Tags,
    Autofill,
  },
  data: function () {
    return {
    domain:process.env.VUE_APP_DOMAIN,
    sessionId:document.querySelector('meta[name="sessionId"]').getAttribute('content'),
    token:document.querySelector('meta[name="token"]').getAttribute('content'),
    location:'',
    windowWidth:window.innerWidth,
    responsiveSize:(window.innerWidth<576)&&"sm"||"",
    info:[],
    securityLevel:0.5,
    jumps:5,
    socket:'',
    autofillItems:[],
    searchOpt:"system",
    materialsSelected:[],
    materialsOpt:[],
    }
  },
  mounted:async function(){
    console.log('mounted');

    this.socket = this.$io(this.domain,{
      transportOptions: {
        polling: {
          extraHeaders: {
            'x-sessionid': this.sessionId,
            'x-token':this.token,
          }
        }
    }});
    
    var self = this;
    this.socket.emit('init', {'a':'b'}, function(error, response){
      if (error){console.log('error: '+error)}
        console.log(response.materials)
      self.materialsOpt = response.materials
    });

    this.socket.on('connect_error', (error) => {
      console.log('connect_error')
      console.log(error)
    });

    this.socket.on('greetings', (msg) => {
      console.log(msg)
    });
  },
  computed:{
    tags:function(){
      var ret = [];
      for (let i=0;i<this.materialsSelected.length;i++){
          ret.push(this.materialsOpt[this.materialsSelected[i]].text)
      }
      return ret
    },
    results:function(){
      var ret = [];
      var setVariant = {"Poor":"muted","Medium":"warning","Rich":"info","Perfect":"success"}
      if (this.info.length>0){
        switch (this.searchOpt) {
          case 'system':
            for (let i=0;i<this.info.length;i++){
              var e=this.info[i];
              var jumpText = e.jumps>1&&'jumps'||'jump';
              var chunk = `${e.resource} - ${e.richness}: ${e.jumps} ${jumpText} :  ${e.region}-${e.constellation}- ${e.system} - ${e.planet} - ${e.security}`;
              ret.push({text:chunk,variant:setVariant[e.richness]})
            }
            break;
          case 'constellation':
          case 'region':
            for (let i=0;i<this.info.length;i++){
              var f=this.info[i];
              var chunks = `${f.resource} - ${f.richness} :  ${f.region}-${f.constellation}- ${f.system} - ${f.planet} - ${f.security}`
              ret.push({text:chunks,variant:setVariant[f.richness]})
            }
            break;
        }
      }
      return ret
    },
  },
  methods:{
    onWidthChange:function(width){
      this.windowWidth = width;
      var ret = "";
      if(this.windowWidth<576){
        ret = "sm"
      }
      this.responsiveSize = ret;
    },
    onSearchChange:function(search,opt){
      var data = {data:search,opt:opt};
      var self = this;
      return new Promise((resolve,reject) => {
        self.socket.emit('autocomplete', data, function(error, response){
          if (error){reject(error)}
          self.autofillItems=response;
          resolve(response);
        })
      })
    },
    onSearchSet:function(search){
      this.location = search;
    },
    onSearchReset:function(){
      this.location = '';
    },
    onSearchOptChange:function(opt){
      this.searchOpt = opt;
    },
    updateTags:function(tagsList){
      this.materialsSelected = tagsList;
    },
    find:function(){
        var self = this;
        this.info=[];
        var data = {
            searchOpt:this.searchOpt,
            location:this.location,
            materials:this.materialsSelected,
            jumps:this.jumps,
            securityLevel:this.securityLevel,
            }

        if (this.location!==''){
          console.log('send socket')
          console.log(data)
          self.socket.emit('find', data, function(error, response){
            console.log('insocket')
            if (error){console.log(error)}
            if (response!==null){
              self.info=response;}
          })          
        }
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
/*title-font-responsive-vw*/
/*xs*/
.title-font-responsive-vw
{
font-size: 1em;
font-weight: bold;
}

/*sm*/
@media screen and (min-width: 576px) { 
  .title-font-responsive-vw{
font-size: 1em;
font-weight: bold;
  }
  }

/*md*/
@media screen and (min-width: 768px) { 
  .title-font-responsive-vw{
font-size: 2em;
  }
  }

/*lg*/
@media screen and (min-width: 992px) { 
  .title-font-responsive-vw{
font-size: 2em;
  }
  }
/*xl*/
@media screen and (min-width: 1200px)
{
  .title-font-responsive-vw{
font-size: 3em;
  }
  }

/*font-responsive-vw*/
/*xs*/
.font-responsive-vw
{
font-size: smaller;
}

/*sm*/
@media screen and (min-width: 576px) { 
  .font-responsive-vw{
font-size: initial;
  }
  }

/*md*/
@media screen and (min-width: 768px) { 
  .font-responsive-vw{
font-size: initial;
  }
  }

/*lg*/
@media screen and (min-width: 992px) { 
  .font-responsive-vw{
font-size: initial;
  }
  }
/*xl*/
@media screen and (min-width: 1200px)
{
  .font-responsive-vw{
font-size: initial;
  }
  }

</style>
