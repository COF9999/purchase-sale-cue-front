const ipRoutes = {
    "PROD": window.env?.VITE_CLOUD || import.meta.env.VITE_CLOUD,
    "LOCAL": window.env?.VITE_LOCAL ||  import.meta.env.VITE_LOCAL
};

const ipMicroComments = {
    "PROD":window.env?.VITE_MICROCOMMENT_CLOUD ||  import.meta.env.VITE_MICROCOMMENT_CLOUD,
    "LOCAL":window.env?.VITE_MICROCOMMENT_LOCAL || import.meta.env.VITE_MICROCOMMENT_LOCAL
};



// const baseUrl = ipRoutes[import.meta.env.VITE_ENVIRONMENT];

const baseUrl = ipRoutes[window.env?.VITE_ENVIRONMENT || import.meta.env.VITE_ENVIRONMENT];

const baseUrlMicroComment = ipMicroComments[window.env?.VITE_MICROCOMMENT || import.meta.env.VITE_MICROCOMMENT];

const baseUrlS3 = window.env?.VITE_S3_URL || import.meta.env.VITE_S3_URL


export {baseUrl,baseUrlMicroComment,baseUrlS3};



