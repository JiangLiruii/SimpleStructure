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

## Framework的主要结构:

### 最基本的使 [interface](./source/framework/interface.ts), 它定义了整个框架的接口类型. 当然是写到某一接口时才会去往里面添加内容, 一开始谁也无法把将来要用到的接口都给写出来.

### 最重要的核心是[mediator](./source/framework/mediator.ts), 它定义了整个框架的消息传递, 包含 `publish, subscribe, unsubscribe` 三个方法, 在mediator中, 一次只能监听或取消监听**一个事件**

### 其次是 [app_event](./source/framework/app_event.ts), 它根据mediator进一步进行了封装, 使程序中的其他类可以直接使用 `triggerEvent, subscribeToEvents, unsubscribeToEvents` 方法, 其中subscribeToEvents和unsubscribeToEvents都是遍历的整个this._events私有变量, 使用mediator的subscribe和unsubscribe.

### 在完成mediator和app_event之后可以顺理成章的写出 [app_event](./source/framework/app_event.ts) 了, 具有四个公有实例属性, `guid, topic, data, handler` 即 `唯一标识符, 事件名称, 事件数据, 事件处理函数`这4类. 这里产生guid的方法为使用随机的16进制32位也就是2进制128位的方法.`Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)`.

### 下面根据MVC的结构进行逐一分析.
#### [Model](./source/framework/model.ts), model 的数据来源于网络请求或本地文件获取. 

- 设置url, 这里将url抽离成一个类装饰器 ModelSetting, 然后注入_url属性
- 请求 requestAsync 的方法, 使用的ajax, 可以设置多钟不同的请求方式(get, post, delete, get等).
- 该类为抽象类, initialize和dispose不应该在这里实现.

#### [View](./source/framework/view.ts), view 需要获取一个对应的模板(template), 与Model一样, 采用的是装饰器注入的方式. 使用了 [HandleBars](http://handlebarsjs.com/) 模板引擎, 这里主要是 renderAsync 的实现方式

- 获取template数据
- 渲染出一个html
- 将对应的html放入container中.
- 其余的initialize, dispose, bindDomEvent, unBindDomEvent 都不应该在这个抽象类中完成.

#### [Controller](./source/framework/controller.ts), controller是需要监听model的变化, 并且将这个变化处理后交给view进行视图的更新渲染.但是同样的, 在framework种应该是抽象的, 只有initialize和dispose两个方法, 每个model都需要有一个controller.

#### [Dispatcher](./source/framework/dispatcher.ts), dispatcher是用于监听'app.dispatch'事件, 如果有更新的话, 会从controller的hash表中找到对应的controller, 有三种情况,

- 1 没有对应的controller
- 2 有对应的controller没有对应的action
- 3 有对应的controller和对应的action
    - 3.1 当前没有cntroller --> 新建controller
    - 3.2 当前controller与更新的controller一致 --> 不需要对controller左任何操作
    - 3.3 当前有controller但与更新的controller不一致 --> 需要dispose原有的, 再initialize新的.

#### 最后来看看路由 [Router](./source/framework/router.ts) 它是由[route](./source/framework/route.ts)组成, route定义一个路由应该长什么样子, 包含了actionName, controllerName, 并且有一个序列化导航地址的方法, 以actionName, controllerName和其余参数为唯一标识. router定义路由的行为, 监听路由变化, 在变化时

- 根据路由实例化route, 
- 将route传入dispatcher中, 把控制权交给对应的controller

## App主要结构

### app文件夹中是根据已有的抽象类来进行实例化并且将抽象中的功能具体化.主要就是MVC这三个, template可以看成view的一部分.

#### controller中定义了两个controller

- [MarketController](./source/app/controller/market_controller.ts)
- [SymbolController](./source/app/controller/symbol_controller.ts)

每个controller都具象化了initialize和dispose这两个方法, 监听不同的事件控制model(进而生成不同的view), 且都具有自有的model和view属性

#### model中定义了四个model, 

- [NasdaqModel](./source/app/models/nasdaq_model.ts) --> 响应MarketController
- [NyseModel](./source/app/models/nyse_model.ts) --> 响应MarketController
- [ChartModel](./source/app/models/chart_model.ts) --> 响应SymbolController(initialize中的`app.model.chart.change`触发)
- [QuoteModel](./source/app/models/quote_model.ts) --> 响应SymbolController

每个model都具象化了initialize和dispose这两个方法, 监听不同事件控制view的render事件生成新的view, 且通过ModelSetting注入`_serviceUrl`属性(该属性再getAsync的时候使用).

#### template中定义了两个模板, 对应 [market](./source/app/template/market.hbs) 和 [symbol](./source/app/template/symbol.hbs)

#### views中定义了三种视图

- [MarketView](./source/app/views/market_view.ts) --> 对应trigger view类事件的model(NasdaqModel, NyseModel)
- [SymbolView](./source/app/views/symbol_view.ts) --> 对应trigger symbol类事件的model(QuoteModel)
- [ChartView](./source/app/views/chart_view.ts) --> 对应trigger chart类事件的model(ChartModel)


