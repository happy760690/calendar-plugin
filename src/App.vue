<template>
<h2>日历组件返回值：{{customeDate}}</h2>
  <my-calendar v-model="customeDate"  @change='change'></my-calendar>
</template>

<script>
import { ref } from 'vue';

export default{ 
  setup() {
    const change = (...arg) => {
      console.log(arg);
    };

    let customeDate = ref("2021/04/11")  
    
    return { 
      customeDate,
      change
    }
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
</style>
