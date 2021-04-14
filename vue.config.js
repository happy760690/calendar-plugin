module.exports = {
    productionSourceMap:false,
    configureWebpack: () =>{
        if(process.env.NODE_ENV === 'production'){
            return {
                output: {
                    // filename: 'bundle.[contentHash:8].js',  // 打包代码时，加上 hash 戳
                    filename: '[name].[contentHash:2].js', // name 即多入口时 entry 的 key
                    // path: distPath,
                    // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
                },
                module: {
                    rules: [
                        // 图片 - 考虑 base64 编码的情况
                        {
                            test: /\.(png|jpg|jpeg|gif)$/,
                            use: {
                                loader: 'url-loader',
                                options: {
                                    // 小于 5kb 的图片用 base64 格式产出
                                    // 否则，依然延用 file-loader 的形式，产出 url 格式
                                    limit: 5 * 1024,
        
                                    // 打包到 img 目录下
                                    outputPath: '/img1/',
        
                                    // 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
                                    // publicPath: 'http://cdn.abc.com'
                                }
                            }
                        },
                       
                    ]
                },
                plugins: [
                ],
            }
        } else { // 开发环境
            return {
                
            }
        }
        
    }
}