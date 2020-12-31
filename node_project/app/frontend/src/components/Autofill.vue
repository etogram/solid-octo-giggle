<template>
<div class="col-xl-6">
  <label class="mb-0 font-responsive-vw" for="location">Location</label>
  <b-input-group :size="responsiveSize" class="mt-0">
    <template #append >
      <b-input-group-text @click="searchInit">
        <strong  class="text-danger">
          <b-icon-x/>
        </strong>
      </b-input-group-text>
    </template>
    <template #prepend>
      <b-dropdown :text="searchOpt" variant="secondary" :size="responsiveSize">
      <b-dropdown-item  @click="getlistOpt('system')" class="font-responsive-vw">system</b-dropdown-item>
      <b-dropdown-item 
      @click="getlistOpt('constellation')" class="font-responsive-vw">constellation</b-dropdown-item>
      <b-dropdown-item 
      @click="getlistOpt('region')" class="font-responsive-vw">region</b-dropdown-item>
      </b-dropdown>
    </template>
    <b-form-input id="location" autocomplete="off" list="autocompleteList" v-on:keyup.enter="setResult" v-on:change="setResult" v-model="search" 
    v-on:keyup="onChange" ></b-form-input>
    <datalist id="autocompleteList" >
        <option v-for="(choice,index) in choices" :key="index">{{choice}}</option>
    </datalist>
  </b-input-group>
</div>
</template>

<script>
export default {
  name: 'Autofill',
  props: ['items'],
  data: function () {
      return {
        isOpen: false,
        search: '',
        results: [],
        isLoading:false,
        socket:null,
        searchOpt:"system",
        windowWidth: window.innerWidth,
      };
  },
  computed: {
    responsiveSize:function(){
      var ret = "";
      if(this.windowWidth<576){
        ret = "sm"
      }
      return ret;
    },
    choices:function(){
      var temp = [];
      switch(this.searchOpt){
      case 'system':
        this.results.forEach(e=>temp.push(e.region+' > '+e.constellation+' > '+e.name))
        break
      case 'constellation':
        this.results.forEach(e=>temp.push(e.region+' > '+e.constellation))
        break
      case 'region':
        this.results.forEach(e=>temp.push(e.region))
        break
      default:
        //
      }
      return temp
    },
  },
    watch: {
      windowWidth(newWidth, oldWidth) {
        if (newWidth!=oldWidth){
            this.windowWidth = newWidth;
            this.$emit('window-width-change',newWidth);
        }
      },
      items: function (val, oldValue) {
        if (val !== oldValue) {
          this.results = val;
          this.isLoading = false;
        }
      },
      searchOpt: function (val, oldValue) {
        if (val !== oldValue) {
          this.$emit('search-opt',val);
        }
      },      
      search: function (val, oldValue) {
        if (val !== oldValue) {
        this.$emit('search-set',val);
        }
      },      
    },
    mounted() {
      this.$nextTick(() => {
        document.addEventListener('click', this.handleClickOutside)
        window.addEventListener('resize', this.onResize);
      })
    },
    beforeDestroy() { 
      window.removeEventListener('resize', this.onResize); 
      document.removeEventListener('click', this.handleClickOutside)
  },
  methods:{
      onResize() {
        this.windowWidth = window.innerWidth;
      },
      searchInit:function(){
        this.$emit('reset');
        this.search='';
      },
      getlistOpt:function(opt){
        this.search='';
        this.searchOpt=opt;
      },
      onChange() {
        this.$emit('input',this.search,this.searchOpt);
        this.isLoading = true;
          },
      setResult() {
        var temp;
        switch(this.searchOpt){
          case 'system':
            try{
              temp = this.search.split('>')[2].trim();
            }catch{
              console.log('incatch')
              temp = this.search;
            }
            break
          case 'constellation':
            try{
              temp = this.search.split('>')[1].trim();
            }catch{
              console.log('incatch')
              temp = this.search;
            }
            break
          case 'region':
            try{
              temp = this.search.trim();
            }catch{
              console.log('incatch')
              temp = this.search;
            }
            break
          default:
          //
        }
        console.log('emit location')
        this.$emit('search-set',temp,this.searchOpt);
      },
      handleClickOutside(evt) {
        if (!this.$el.contains(evt.target)) {
          this.isOpen = false;

        }
      }
  },
}
</script>
