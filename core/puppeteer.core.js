const puppeteer = require("puppeteer");
const randomUserAgent = require("random-useragent");
const log = require("./log.core");

let browser;
async function getBrowser() {
  if (!browser) {
    log.info("creating a browser");
    browser = await puppeteer.launch();
    browser.on("disconnected", () => {
      browser = false;
    });
  }
  return browser;
}

async function getCoverImageURL(targetUrl, selectorOptions) {
  const myBrowser = await getBrowser();
  let page;
  const {
    selectorString,
    postProcessingRegex,
    attributeString,
  } = selectorOptions;
  try {
    page = await myBrowser.newPage();

    const newUserAgent = randomUserAgent.getRandom((ua) => ua.browserName === "Chrome" && ua.osName === "Windows");
    await page.setUserAgent(newUserAgent);
    await page.goto(targetUrl);

    await page.waitForSelector(selectorString, { timeout: 5000 });
    let url = await page.$eval(
      selectorString,
      (elem, attributeToFind) => elem.getAttribute(attributeToFind),
      attributeString,
    );
    if (postProcessingRegex) {
      const matched = url.match(postProcessingRegex);
      if (matched) {
        [url] = matched;
      }
    }
    return url;
  } catch (err) {
    log.error("Puppeteer error", err);
    return null;
  } finally {
    if (page) {
      await page.close();
    }
  }
}

module.exports = {
  getCoverImageURL,
};
