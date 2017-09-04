/**
 * Created by Administrator on 2017/8/31.
 */
//console.log(Vue)
//console.log(VueResource)
//console.log(VueRouter)
//console.log(Vuex)

//定义Shop组件
var Shop={
    template:'#tpl_shop',
    //绑定数据
    data:function(){
        return{
            shop:{}
        }
    },
    //请求数据
    created:function(){
        console.log(1111111+this.$route.params)
        //使用vue resource请求数据
        this.$http.get('/data/shop.json?id='+this.$route.params.storeName)
        //接受并存储数据
            .then(function(res){
                //如果请求成功，存储数据
                if(res.data.errno===0){
                    this.shop=res.data.data;
                    console.log(this)
                }
            })
    }
}

//定义Product组件
var Product={
    template:'#tpl_product',
    //绑定数据
    data:function(){
        //绑定菜单栏数据
        return{
            menu:[]
        }
    },
    //请求数据
    created:function(){
        this.$http.get('data/menu.json?id='+this.$route.params.storeName)
        //存储数据
            .then(function(res){
                //请求数据，存储数据
                if(res.data.errno===0){
                    this.menu=res.data.data;
                }
            })
    }

}

//定义Food组件
var Food={
    template:'#tpl_food',
    data:function(){
        return{
            list:[],
            //做一个数据备份
            //请求过的数据需要备份
            all:{}
        }
    },
    //注册方法
    methods:{
        add:function(item){
            //点击+，执行回调函数
            item.num++;
        },
        reduce:function (item) {
            item.num--;
        }
    },
    created:function(){
        //空数据
        var id=this.$route.params.foodId || "01" //默认01
        this.$http.get('/data/'+id+'.json')
            .then(function (res) {
               if(res.data.errno===0){
                   this.list=res.data.data;
                   //缓存数据
                   this.all[id]=res.data.data;
               }
            })
    },
    //切换路由，我们要更新数据，所以要监听数据的改变
    watch:{
        '$route':function(){
            console.log(1111);
            //更新数据，检测是否有缓存
            var id=this.$route.params.foodId || "01" //默认01
            if(this.all[id]){
                this.list=this.all[id];
            }else{
                //没有缓存，要请求数据
                this.$http.get('data/'+id+'.json')
                    .then(function(res){
                        //请求成功，更新数据
                        if(res.data.errno===0){
                            this.list=res.data.data;
                            //缓存新的数据
                            this.all[id]=res.data.data;
                        }
                    })
            }
        }
    }
}

//使用路由一般步骤
//第一步 定义路由规则
var routes=[
    {
    path:'/store/:storeName',
    //组件
    //component:{template:'#tpl_shop'},
        // 头部是可以复用的，所以写在第一个组件中；
        //注意：组件通常是大写
        component:Shop,

    //定义字路由
    children:[
        {
        //商品子页面
        path:'product',
       //component:{template:'#tpl_product'},
        component:Product,
            children:[
                {
                    path:'food/:foodId',
                    //component:{template:'#tpl_food'}
                    component:Food,
                }
            ]
        }
    ]
},
   //重定向
   {
       path:'*',
       redirect:'/store/kdj/product/food/02'
    }

]
//第1步：创建vuex共享数据
var store=new Vuex.Store({
    //定义数据
    state:{
        //共享价格数据
        num:0,
    },
    //定义改变
    mutations:{
        //增加价格
        add:function (state,num) {
            //更新数据
            state.num+=+num;
        },
        //减少数据
        reduce:function(state,num){
            state.num-=num;
        }
    }
})

//第二步 实例化路由
var router = new VueRouter({
    // 传入规则
    routes: routes
})



//第三步 定义路由渲染容器


//第四步 在vue实例化对象上注册路由
var app=new Vue({
    el:'#app',
    router: router,
    //第2步，注册store
    store:store
})


