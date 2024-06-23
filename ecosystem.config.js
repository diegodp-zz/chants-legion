module.exports = {
    apps: [
      {
        name: 'next-app',
        script: 'npm',
        args: 'run start',
        env: {
          NODE_ENV: 'production'
        }
      },
      {
        name: 'partykit-server',
        script: 'npm',
        args: 'run party',
        env: {
          NODE_ENV: 'production'
        }
      }
    ]
  };
  