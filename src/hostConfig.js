const ipRoutes = {
    "PROD": import.meta.env.VITE_CLOUD,
    "LOCAL": import.meta.env.VITE_LOCAL,
};


const baseUrl = ipRoutes[import.meta.env.VITE_ENVIRONMENT];


export default baseUrl;




