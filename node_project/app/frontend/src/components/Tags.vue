<template>
    <div>
        <b-button variant="outline-secondary" size="sm" class="my-1 mx-1 px-1 py-0" v-for="(tag, index) in tags" :data-value="tag.value" :key="index" @click="toggle" style="font-size: smaller;">{{tag.text}}</b-button>
    </div>
</template>

<script>
export default {
  name: 'Tags',
  props: ['tags'],
  data: function () {
    return {
      select:[],
      text:''
    }
  },
  computed: {
    //
  },
  mounted:function(){
    //
  },
  methods:{
    toggle(event){
      if (event.target.className.indexOf("active")==-1){
        this.select.push(event.target.dataset.value)
        event.target.classList.add("active");
        event.target.classList.remove("btn-outline-secondary");
        event.target.classList.add("btn-outline-primary");
        this.$emit('update-tags',this.select.sort(function(a, b) {return parseInt(a) - parseInt(b);}));
      }else{
        event.target.classList.remove("active");
        event.target.classList.add("btn-outline-secondary");
        event.target.classList.remove("btn-outline-primary");
        
        var index = this.select.indexOf(event.target.dataset.value);
        if (index > -1) {
          this.select.splice(index, 1);
          this.$emit('update-tags',this.select.sort(function(a, b) {return parseInt(a) - parseInt(b);}));
        }
      }
    },
  },
}
</script>
