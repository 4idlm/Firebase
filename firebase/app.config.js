module.exports = {
    /**
    * Application configuration section
    */
    apps : [
    
    // Profile application
    {
    name : "ProfileAPI",
    script : "./index.js",
    env_prod : {
    NODE_ENV: "prod"
    },
    env_dev : {
    NODE_ENV: "dev"
    },
    env_local : {
    NODE_ENV: "local",
    LOCAL_CONFIG:"E:\\/app-server-config-local.json",
    DEV_DB:"https://app-server-config-local.firebaseio.com"
    }
    }
    ]
    
    }