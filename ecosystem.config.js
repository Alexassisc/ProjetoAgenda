module.exports = {
  apps: [{
    name: 'agenda',
    script: './server.js', // porque o server.js está na mesma pasta
    env: {
      MONGO_CONNECTION: process.env.MONGO_CONNECTION,
      SESSION_SECRET: process.env.SESSION_SECRET
    }
  }]
}