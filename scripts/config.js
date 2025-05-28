export const testConfig = {
  testScenario: {
    bigTest: {
      stages: [
        { duration: '5m', target: 200 },
        { duration: '5m', target: 400 },
        { duration: '10m', target: 600 },
        { duration: '10m', target: 800 },
        { duration: '15m', target: 1000 },
        { duration: '3m', target: 0 },
      ],
    },
    singleRun: {
      vus: 1
    },
    stage20vus: {
      maxVUs: 20,
      stage: [
        { duration: '1m', target: 10 },
        { duration: '30s', target: 20 },
      ]
    },
    ramping20VUs: {
      startVUs: 0,
      stage: [
        {
          duration: '30s',
          target: 20
        }
      ],
      gracefulRampDown: '10s'
    },
  },
  environment: {
    prod: {
      url: ""
    },
    dev: {
      // url: "http://95.85.125.16:18000"
      url: "http://kong.tmbiz.info:8000"
    }, staging: {
      url: ""
    }
  }
}
