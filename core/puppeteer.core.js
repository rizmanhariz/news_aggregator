const puppeteer = require("puppeteer");
const randomUserAgent = require("random-useragent");
const log = require("./log.core");

let browser;
async function getBrowser() {
  if (!browser) {
    log.info("creating a browser");
    browser = await puppeteer.launch({});
    browser.on("disconnected", () => {
      browser = false;
    });
  }
  return browser;
}

/**
 * Function to scrape article web page for image or textBody
 * @param {*} inputParams
 * @param {string} inputParams.targetUrl - url of article
 * @param {boolean} [inputParams.toGetCoverImage] - flag to scrape cover image
 * @param {object} [inputParams.imageScraperOptions] - options for scraping image
 * @param {string} [inputParams.imageScraperOptions.selector] - selector for element with image
 * @param {string} [inputParams.imageScraperOptions.attribute] - attribute that hols image url
 * @param {string} [inputParams.imageScraperOptions.postProcessingRegex] - regex to format image url
 * @param {boolean} [toGetTextBody] - flag to scrape article text content
 * @param {object} [textScraperOption] - options for scraping the text
 */
async function scrapeArticleWebpage({
  targetUrl,
  toGetCoverImage,
  imageScraperOptions,
  toGetTextBody,
  textScraperOption,
}) {
  const myBrowser = await getBrowser();
  let page;
  const retObj = {};
  try {
    page = await myBrowser.newPage();

    const newUserAgent = randomUserAgent.getRandom((ua) => ua.browserName === "Chrome" && ua.osName === "Windows");
    await page.setUserAgent(newUserAgent);
    await page.goto(targetUrl);

    if (toGetCoverImage) {
      const {
        selector,
        postProcessingRegex,
        attribute,
      } = imageScraperOptions;
      log.info("Waiting for cover selector");
      await page.waitForSelector(selector, { timeout: 5000 });
      let url = await page.$eval(
        selector,
        (elem, attributeToFind) => elem.getAttribute(attributeToFind),
        attribute,
      );
      if (postProcessingRegex) {
        const matched = url.match(postProcessingRegex);
        if (matched) {
          [url] = matched;
        }
      }
      retObj.url = url;
    }

    if (toGetTextBody) {
      const {
        selector,
      } = textScraperOption;
      await page.waitForSelector(selector, { timeout: 5000 });
      const text = await page.$eval(
        selector,
        (elem) => elem.innerHtml,
      );
      retObj.text = text;
    }

    return retObj;
  } catch (err) {
    log.error("Puppeteer error", err);
    if (page) {
      page.screenshot({ path: `./error_${new Date().getTime()}.png` });
    }
    return null;
  } finally {
    if (page) {
      await page.close();
    }
  }
}

module.exports = {
  scrapeArticleWebpage,
};
