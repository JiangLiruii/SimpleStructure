export default function(config) {
    'use strict';

    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai', 'sinon'],
        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage'],
        coverageReport: {
            type: 'lcov',
            dir: __dirname + '/coverage/',
        },
        plugins: [
            'karma-coverage',
            'karma-mocha',
            'karma-chai',
            'karma-sinon',
            'karma-phantomjs-launcher'
        ],
        preprocessors: {
            '**/bundled/test/bdd.test.js': 'coverage'
        },
        // karma在执行单元测试时, 会在内部生成一个html, 并且加载files和plugins字段指定的文件, 用script标签引用, 只有file加载进来的文件在测试执行期间才是可用的
        files: [{
            pattern: '/bundled/test/bdd.test.js',
            include: true,
        },{
            pattern: '/node_modules/jquery/dist/jquery.min.js',
            include: true
        },{
            pattern: '/node_modules/bootstrap/dist/js/bootstrap.min.js',
            include: true,
        }],
        //客户端入口文件
        client: {
            mocha: {
                ui: 'bdd'
            }
        },
        port: 9876,
        color: true,
        autoWatch: false,
        logLevel: config.DEBUG
    })
}