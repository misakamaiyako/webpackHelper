const routers = [
    {
        path: '/',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '/making',
        component: resolve => require(['./views/processing.vue'],resolve)
    }
];
export default routers;