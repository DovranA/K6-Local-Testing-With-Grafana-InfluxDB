export const testConfig = {
  testScenario: {
    bigTest: {
      stages: [
        { duration: '2m', target: 500 },
        { duration: '2m', target: 800 },
        { duration: '3m', target: 1000 },
        { duration: '3m', target: 800 },
        { duration: '4m', target: 1200 },
        { duration: '2m', target: 0 },
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
