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
