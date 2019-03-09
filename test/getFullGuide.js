const getFullGuide = require("../index").getFullGuide;

describe("arenavision-scraper | getFullGuide", () => {
  it("should return the whole guide", (done) => {
    getFullGuide().then(data => {
      console.log(JSON.stringify(data))
      done();
    });
  });
});
