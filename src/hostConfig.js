const ipRoutes = {
    "PROD": import.meta.env.VITE_CLOUD,
    "LOCAL": import.meta.env.VITE_LOCAL,
};

const ipMicroComments = {
    "PROD": import.meta.env.VITE_MICROCOMMENT_CLOUD,
    "LOCAL": import.meta.env.VITE_MICROCOMMENT_LOCAL,
};



const baseUrl = ipRoutes[import.meta.env.VITE_ENVIRONMENT];

const baseUrlMicroComment = ipMicroComments[import.meta.env.VITE_MICROCOMMENT];

const baseUrlS3 = import.meta.env.VITE_S3_URL

export {baseUrl,baseUrlMicroComment,baseUrlS3};




