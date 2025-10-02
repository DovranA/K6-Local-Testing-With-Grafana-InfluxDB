export const testConfig = {
  testScenario: {
    bigTest: {
      stages: [
        { duration: '5m', target: 500 },
        { duration: '3m', target: 300 },
        { duration: '10m', target: 1000 },
        { duration: '8m', target: 800 },
        { duration: '15m', target: 1200 },
        { duration: '2m', target: 0 },
      ],
    },
    someTest: {
      stages: [
        { duration: '5m', target: 500 },
        // { duration: '3m', target: 2 },
        // { duration: '3m', target: 3 },
        // { duration: '3m', target: 4 },
        // { duration: '3m', target: 5 },
        // { duration: '3m', target: 6 },
      ],
    },
    singleRun: {
      vus: 2,
      duration: "60m"
    },
    stage20vus: {
      // maxVUs: 20,
      stage: [
        { duration: '5m', target: 20 },
        // { duration: '10s', target: 20 },
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
      url: "https://kong.tmbiz.info"
    }, staging: {
      url: ""
    }
  }
}
