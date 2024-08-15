import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from 'unplugin-vue-router/vite';

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
// 根据当前工作目录中的 `mode` 加载 .env 文件
// 第二个参数：process.cwd()表示返回运行当前脚本的工作目录的路径（current work directory）
// 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), "");
  console.log('proxy.target',env.VITE_RES_URL);
  return {
    // vite 配置
    base: "/",
    plugins: [
      VueRouter({
        routesFolder: 'src/pages', // 指定路由文件所在的目录
        exclude: ['**/components/*.vue'],
        extensions: ['.vue'], // 指定路由文件的后缀名
      }),
      vue(),
      AutoImport({
        imports: [ "vue-router","vue",],
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: "src/auto-imports.d.ts",
      }),
      Components({

      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    // 强制预构建插件包
    optimizeDeps: {
      include: ["axios"],
    },
    // 打包配置
    build: {
      target: "modules",
      outDir: "dist",
      assetsDir: "assets",
      minify: "terser",
    },
    // 本地运行配置，及反向代理配置
    server: {
      host: true,
      port: 9000,
      strictPort:true,
      hotOnly: false,
      cors: true,
      // open: true,
      proxy: {
        "/api": {
          target: env.VITE_RES_URL, //代理接口
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
