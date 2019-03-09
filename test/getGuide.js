const getGuide = require("../src/getGuide").default;

describe("arenavision-scraper | getGuide", () => {
  it("should return the entire guide", (done) => {
    getGuide().then(data => {
      console.log(JSON.stringify(data))
      done();
    });
  });
});
