<style >
    .index {
        width: 320px;
        height: 640px;
        background-color: whitesmoke;
        overflow: auto;
        padding: 12px;
    }
</style>
<template>
    <div class="index">
        <Form labelPosition="top" :model="$data">
            <FormItem :label="$t('language')">
                <RadioGroup v-model="language">
                    <Radio label="english"></Radio>
                    <Radio label="中文"></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem :label="$t('projectName')" :rules="{required: true, message: 'project name can\'t be empty', trigger: 'change'}" prop="projectName">
                <Input v-model="projectName" />
            </FormItem>
            <FormItem :label="$t('platform')">
                <RadioGroup v-model="platform">
                    <Radio label="desktop">{{$t('desktop')}}</Radio>
                    <Radio label="mobile">{{$t('mobile')}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem :label="$t('open')">
                <RadioGroup v-model="open">
                    <Radio label="yes">{{$t('yes')}}</Radio>
                    <Radio label="no">{{$t('no')}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem :label="$t('license')" v-if="open==='yes'">
                <Input v-model="license" />
            </FormItem>
            <FormItem :label="$t('author')">
                <Input v-model="author" />
            </FormItem>
            <FormItem :label="$t('description')">
                <Input v-model="description" />
            </FormItem>
            <FormItem :label="$t('router')">
                <RadioGroup v-model="router">
                    <Radio label="history">{{$t('history')}}</Radio>
                    <Radio label="rHash">{{$t('rHash')}}</Radio>
                    <Radio label="smart">{{$t('smart')}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem :label="$t('proxy')">
                <Input v-model="context" placeholder="context"/>
                <Input v-model="target" :placeholder="$t('target')"/>
                <Input v-model="regex" :placeholder="$t('regex')"/>
                <Input v-model="handledPath" :placeholder="$t('handledPath')"/>
            </FormItem>
            <FormItem :label="$t('hash')">
                <RadioGroup v-model="hash">
                    <Radio label="yes">{{$t('yes')}}</Radio>
                    <Radio label="no">{{$t('no')}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem :label="$t('chunk')">
                <div style="display: flex;width: 100%">
                    <p style="width: 100%">{{path}}</p>
                    <Button size="small" type="info" @click="openDir('path')">{{$t('select')}}</Button>
                </div>
            </FormItem>
            <FormItem :label="$t('HTMLPath')">
                <div style="display: flex;width: 100%">
                    <p style="width: 100%">{{HTMLPath}}</p>
                    <Button size="small" type="info" @click="openDir('HTMLPath')">{{$t('select')}}</Button>
                </div>
            </FormItem>
            <FormItem :label="$t('publicPath')">
                <Input  v-model="publicPath"/>
            </FormItem>
            <FormItem :label="$t('HTMLName')" :rules="{required: true, message: 'HTML name can\'t be empty', trigger: 'change'}" prop="HTMLName">
                <Input v-model="HTMLName" />
            </FormItem>
        </Form>
        <Button @click="handle">{{$t('handle')}}</Button>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                language: 'english',
                platform: 'desktop',
                open: 'yes',
                license: 'MIT',
                author: '',
                description: '',
                hash: 'no',
                router: 'smart',
                path: '/dist/',
                publicPath: '/dist/',
                HTMLPath: './',
                projectName: '',
                HTMLName: 'index.html',
                context: '',
                target: '',
                regex: '',
                handledPath: '',
                type: ''
            };
        },
        methods: {
            openDir(type){
                this.type = type;
                ipc.send('open-file-dialog');
            },
            handle() {
                ipc.send('createFile',this.$data);
            }
        },
        watch: {
            language(value){
                if(value==='english'){
                    this.$i18n.locale = 'en';
                } else {
                    this.$i18n.locale = 'zh';
                }
            }
        },
        created(){
            ipc.on('selected-directory',(e,path)=>{
                this[this.type] = path[0];
                this.type = '';
            });
        }
    };
</script>