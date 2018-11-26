# 这是我的第一个自制MVC框架的尝试

## 主要包含
### 框架(framework)
- controller: 初始化view 和 model, 完成初始化后将执行流交给一个或多个model
- view: 加载和编译模板, 一旦模板编译完成, 等待model传入数据, 编译传入的数据, 并插入到DOM中, 同时也负责绑定和解绑ui事件
- model: 负责与HTTP API通信, 并在内存中维护数据. 设计数据的格式化和数据的增减. 一旦完成对数据的操作, 将传递到一个或多个view中
- router: 路由观察浏览器URL的变化,并在变更时创建一个route实例, 通过程序事件传递给dispatcher
- route: 被用来表示一个URL, URL的命名规则可以指明那个controller的方法在特定路由下被调用
- component: 程序的根组件, 负责初始化框架内所有的内部组件(包括中介器, 路由和调度器)
- event: 将信息从一个组件发送到另一个, 也可以订阅或取消订阅
- dispatcher: 接受一个Route实例, 用来指定依赖的controller, 如果需要会销毁上一个controller并新建, 一旦controller被创建, 执行流便会交给controller
- mediator: 负责程序中所有其他模块间的通信

## 数据流均采用FLUX的单向数据流
- 所有的Action直接发送到Dispatcher中, 然后将执行流交给Store
- Store用来储存和操作数据, 类似于MVC中的model, 每当数据被修改时, 会传递给view
- View负责将数据渲染成HTML并处理事件(Action). 如果一个事件需要修改一些数据, View会将这个Action送入到Dispatch中, 而不是直接对model进行修改. 这是与双向数据绑定的区分点.

## 主要结构:

### 最基本的使 [interface](./source/framework/interface.ts), 它定义了整个框架的接口类型. 当然是写到某一接口时才会去往里面添加内容, 一开始谁也无法把将来要用到的接口都给写出来.

### 最重要的核心是[mediator](./source/framework/mediator.ts), 它定义了整个框架的消息传递, 包含 `publish, subscribe, unsubscribe` 三个方法, 在mediator中, 一次只能监听或取消监听**一个事件**

### 其次是 [app_event](./source/framework/app_event.ts), 它根据mediator进一步进行了封装, 使程序中的其他类可以直接使用 `triggerEvent, subscribeToEvents, unsubscribeToEvents` 方法, 其中subscribeToEvents和unsubscribeToEvents都是遍历的整个this._events私有变量, 使用mediator的subscribe和unsubscribe.

### 在完成mediator和app_event之后可以顺理成章的写出 [app_event](./source/framework/app_event.ts) 了, 具有四个公有实例属性, `guid, topic, data, handler` 即 `唯一标识符, 事件名称, 事件数据, 事件处理函数`这4类. 这里产生guid的方法为使用随机的16进制32位也就是2进制128位的方法.`Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)`.

### 下面根据MVC的结构进行逐一分析.
#### [Model](./source/framework/model.ts), model 的数据来源于网络请求或本地文件获取. 所以需要设置url, 这里将url抽离成一个类装饰器 ModelSetting, 然后注入_url属性, 剩下的就是请求 requestAsync 的方法, 使用的ajax, 可以设置多钟不同的请求方式(get, post, delete, get等). 该类为抽象类, initialize和dispose不应该在这里实现.

#### [View](./source/framework/view.ts), view 需要获取一个对应的模板(template), 与Model一样, 采用的是装饰器注入的方式. 使用了 [HandleBars](http://handlebarsjs.com/) 模板引擎, 这里主要是 renderAsync 的实现方式, 从获取template数据, 到渲染出一个html, 再将对应的html放入container中.其余的initialize, dispose, bindDomEvent, unBindDomEvent 都不应该在这里完成.