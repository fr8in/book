module.exports = {
  apps: [
    {
      name: "client",
      script: "yarn",
args:"start",
      exp_backoff_restart_delay: 100,
       exec_mode: "cluster",
       instances : "max",

      watch: true,
      autorestart: true,
      env: {
          NODE_ENV: "dev",

        CORE:'http://prodcore.southeastasia.azurecontainer.io/v1/graphql',
      },
      env_prod: {
        NODE_ENV: "prod",

        CORE:'http://prodcore.southeastasia.azurecontainer.io/v1/graphql',
      },
    },
  ],
};
