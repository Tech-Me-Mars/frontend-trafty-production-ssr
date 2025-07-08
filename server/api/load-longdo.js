// server/api/load-longdo.js
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const key = config.longdoMapKey

  return `
    (function(){
      var script = document.createElement('script');
      script.src = 'https://api.longdo.com/map3/?key=${key}';
      script.async = true;
      document.head.appendChild(script);
    })();
  `
})