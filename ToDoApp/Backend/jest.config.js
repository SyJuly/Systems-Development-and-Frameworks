module.exports = {
  verbose: true,
  moduleFileExtensions: [
    "js",
    "json"
  ],
  transform: {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/components/*.{js}",
    "!**/node_modules/**"
  ],
  coverageReporters: [
    "text-summary"
  ],
}
