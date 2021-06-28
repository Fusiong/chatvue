<template>
  <div class="main">


    <Contact @set-contact="set" />
    <Dialog :contact="contact" />

    
  </div>
  
</template>

<script>
import Contact from "@/components/contact";
import Dialog from "@/components/dialog";

export default {
  name: "Chat",
  components: {
    Dialog,
    Contact,
  },
  data() {
    return {
      contact: null,        
    };
  },
  methods: {
     set(user){
       this.contact = user;

     }
  },
};
</script>

<style lang="less" scoped>
.main {
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: rgb(171, 199, 194);
}
</style>
