import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    exclude: ['@swc/wasm'], // Marcar la ruta problemática como externa
  },
})


// // vite.config.js
// import { defineConfig } from 'vite';
// import nodePolyfills from 'rollup-plugin-node-polyfills'; // Importa el plugin de polyfills de Node.js

// export default defineConfig({
//     plugins: [
//         // Otros plugins...
//         nodePolyfills(), // Utiliza el plugin de polyfills de Node.js para cargar archivos .node
//     ],
// });