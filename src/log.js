exports.default = class Log {
  constructor(isLogEnabled, prefix) {
    this.isLogEnabled = isLogEnabled
    this.prefix = prefix
  }

  info(msg) {
    if (this.isLogEnabled) {
      console.info(`${new Date().toISOString().substr(11, 8)} ${this.prefix} - ${msg}`)
    }
  }
}