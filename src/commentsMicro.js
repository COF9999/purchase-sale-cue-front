const ipRoutes = {
    "PROD": import.meta.env.VITE_MICROCOMMENT_CLOUD,
    "LOCAL": import.meta.env.VITE_MICROCOMMENT_LOCAL,
};


const baseUrlMicroComment = ipRoutes[import.meta.env.VITE_MICROCOMMENT];


export default baseUrlMicroComment;