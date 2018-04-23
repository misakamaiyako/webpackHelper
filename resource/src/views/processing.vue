<style scoped>
    .rotate-icon-load{
        animation: rotate-spin 1s linear infinite;
        color: dodgerblue;
    }
    @keyframes rotate-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>
<template>
    <div class="index" style="text-align: center">
        <p v-for="i in file" :key="i.message"><Icon :type="i.state==='success'?'checkmark-round':'close-round'" :style="{color:i.state==='success'?'dodgerblue':'red' }"></Icon>{{i.message}}</p>
        <p><Icon type="load-c" class="rotate-icon-load"></Icon>processing</p>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                file: []
            };
        },
        watch:{
            file(value){
                if (value.length===20) {
                    ipc.send('processDone');
                }
            }
        },
        created(){
            ipc.on('makeProcess',(e,message)=>{
                this.file.push(message);
            });
        }
    };
</script>