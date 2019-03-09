const getChannels = require("../src/getChannels").default;

describe("arenavision-scraper | getChannels", () => {
  it("should return all the channels", (done) => {
    getChannels().then(data => {
      console.log(data)
      done();
    });
  });
});
