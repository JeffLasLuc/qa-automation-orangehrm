module.exports = {
  default: {
    requireModule: ['tsx/cjs'],
    paths: ['src/features/**/*.feature'],
    require: [
      'src/steps/**/*.ts', 
      'src/support/**/*.ts'
    ],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    }
  }
};