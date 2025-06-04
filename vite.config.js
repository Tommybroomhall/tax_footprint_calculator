// vite.config.js
export default {
  // Base public path when served in production
  base: '/',
  
  // Build configuration
  build: {
    // Output directory for production build
    outDir: 'dist',
    
    // Clean the output directory before build
    emptyOutDir: true,
    
    // Minify output
    minify: 'terser',
    
    // Configure rollup options
    rollupOptions: {
      output: {
        // Chunk files
        manualChunks: {
          vendor: ['chart.js']
        }
      }
    }
  },
  
  // Server options
  server: {
    // Port to run dev server
    port: 3000,
    
    // Open browser on server start
    open: true
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['chart.js']
  }
}
