// import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import postcsspxtoviewport from 'postcss-px-to-viewport'
// import ElementPlus from 'unplugin-element-plus/vite'
import legacyPlugin from '@vitejs/plugin-legacy'
import esbuild from 'rollup-plugin-esbuild'

// https://vitejs.dev/config/

// 是否为开发环境
const isProd = process.env.NODE_ENV === 'production'

const imgUrl = 'http://192.168.1.182:21888' // 静态资源

// 获取env文件
const getEnvFun = (mode, target) => loadEnv(mode, process.cwd())[target]

export default ({ mode }) => {
  return defineConfig({
    mode: isProd ? 'production' : 'development',
    // lintOnSave: true,
    plugins: [
      vue(),
      vueJsx(),
      // ElementPlus({
      //   useSource: true,
      // }),
      VueSetupExtend(), // 自定义组件名
      //配置插件
      AutoImport({
        // 组件中不用再导入ref，reactive等
        imports: ['vue', 'vue-router'],
        dirs: ['./src/api'],
        dts: 'src/auto-import.d.ts'
      }),
      esbuild({
        //替换成你想要的谷歌内核版本
        target: 'chrome76',
        loaders: {
          '.vue': 'js',
          '.ts': 'js'
        }
      }),
      // 浏览器兼容问题配置
      legacyPlugin({
        // targets: ['chrome 76'], // 需要兼容的目标列表，可以设置多个
        targets: ['defaults', 'not IE 11', 'chrome 76'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks: true,
        polyfills: [
          'es.symbol',
          'es.promise',
          'es.promise.finally',
          'es/map',
          'es/set',
          'es.array.filter',
          'es.array.for-each',
          'es.array.flat-map',
          'es.object.define-properties',
          'es.object.define-property',
          'es.object.get-own-property-descriptor',
          'es.object.get-own-property-descriptors',
          'es.object.keys',
          'es.object.to-string',
          'web.dom-collections.for-each',
          'esnext.global-this',
          'esnext.string.match-all'
        ]
      })
    ],
    // build: {
    //   target: 'es2015'
    // },
    resolve: {
      alias: {
        // '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@': path.resolve(__dirname, 'src'),
        _c: path.resolve(__dirname, 'src/components')
      }
    },
    css: {
      postcss: {
        plugins: [
          postcsspxtoviewport({
            unitToConvert: 'px', // 要转化的单位
            viewportWidth: 750, // UI设计稿的宽度
            unitPrecision: 6, // 转换后的精度，即小数点位数
            propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: false, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
            // exclude: [],
            include: [/form-info-card/,/mobile-page/, /shareMb/, /editMb/], //如果设置了include，那将只有匹配到的文件才会被转换
            landscape: false // 是否处理横屏情况
          }),
          postcsspxtoviewport({
            unitToConvert: 'px', // 要转化的单位
            viewportWidth: 375, // UI设计稿的宽度
            unitPrecision: 6, // 转换后的精度，即小数点位数
            propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: false, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
            // exclude: [],
            include: [/vant/], //如果设置了include，那将只有匹配到的文件才会被转换
            landscape: false // 是否处理横屏情况
          })
        ]
      },
      preprocessorOptions: {
        // 引入全局的less变量
        less: {
          charset: false,
          additionalData: '@import "./src/assets/css/basicVariate.less";',
          javascriptEnabled: true
        }
      }
    },
    // 开发服务器选项
    server: {
      host: '0.0.0.0',
      port: 7070,
      open: false,
      proxy: {
        '/police': {
          target: getEnvFun(mode, 'VITE_API_URL'),
          changeOrigin: true
        },
        '/image': {
          target: imgUrl
        },
        warningws: {
          target: getEnvFun(mode, 'VITE_WS_URL'),
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/warningws/, getEnvFun(mode, 'VITE_WS_REWRITE'))
        }
      }
    }
  })
}
