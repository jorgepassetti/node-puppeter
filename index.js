console.time('businessLogic');
const puppeteer = require('puppeteer');
/* const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin()); */

const requestsChecks = [
  {
    regex: /fbevents\.js/,
    id: 'facebook-pixel',
  },
  {
    regex: /analytics\.tiktok\.com/,
    id: 'tiktok-pixel',
  },
  {
    regex: /hotjar.com/,
    id: 'hotjar',
  },
  {
    regex: /segment.com/,
    id: 'segment-com',
  },
  {
    regex: /wp-content/,
    id: 'wordpress',
  },
  {
    regex: /googletagmanager/,
    id: 'GTM',
  },
  {
    regex: /google-analytics.com/,
    id: 'google-analytics',
  },
  {
    regex: /cloudfront.net/,
    id: 'cloudfront',
  },
  {
    regex: /finsweet.com/,
    id: 'finsweet',
  },
  {
    regex: /lfeeder.com/,
    id: 'leadfeeder',
  },
  {
    regex: /intercom.io/,
    id: 'intercom',
  },
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const start = async () => {
  const urlToCheck = 'http://vitalproteins.com'; //'https://myapricot.com'; //, 'https://www.metasalt.io'];
  const browser = await puppeteer.launch({ headless: true });
  let response = {};
  try {
    console.log('initing page');
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    let trimedRequestsChecks = requestsChecks;
    page.on('request', (request) => {
      url = request.url();
      console.log('url', url);
      for (let index = 0; index < trimedRequestsChecks.length; index++) {
        const check = trimedRequestsChecks[index];
        response[check.id] = check.regex.test(url);
        if (check.regex.test(url)) {
          trimedRequestsChecks.splice(index, 1);
        }
      }
      request.continue();
    });

    console.time('goto');
    await page.goto(urlToCheck, {
      timeout: 120000,
    });
    await delay(4500);
    console.timeLog('goto');

    /*     console.time('ionic')
    response.ionic = await page.evaluate(() => {
      return !!document.querySelector('body > app-root');
    });
    console.timeLog('ionic')

    console.time('angular')
    response["angular-version"] = await page.evaluate(() => {
      const attributes = document.querySelector('body').firstElementChild.attributes || [];
      for (let index = 0; index < attributes.length; index++) {
        const attr = attributes[index];
        if(attr.name == 'ng-version'){
          return attr.value;
        }
      }
      return null;
    });
    console.timeLog('angular') */

    console.time('hreflang');
    response.hreflang = await page.evaluate(async () => {
      const attributes = document.querySelector('link').attributes || [];
      console.log('attributes', attributes);
      let value;
      for (let index = 0; index < attributes.length; index++) {
        const attr = attributes[index];
        if (attr.name == 'hreflang') {
          value = true;
        }
      }
      return value;
    });
    console.timeLog('hreflang');

    console.time('next');
    response.next = await page.evaluate(() => {
      return !!document.querySelector('#__next');
    });
    console.timeLog('next');

    console.time('nuxt');
    response.nuxt = await page.evaluate(() => {
      return !!document.querySelector('#__nuxt');
    });
    console.timeLog('nuxt');

    console.time('react');
    response.react = await page.evaluate(() => {
      return !!document.querySelector('[data-reactroot], [data-reactid]');
    });
    console.timeLog('react');

    console.time('gatsby');
    response.gatsby = await page.evaluate(() => {
      return !!document.querySelector('#___gatsby');
    });
    console.timeLog('gatsby');

    console.time('eleventy');
    response.eleventy = await page.evaluate(() => {
      return !!document.querySelector('.elv-layout');
    });
    console.timeLog('eleventy');

    console.time('others');
    response.vue = response.nuxt;
    response.react = response.next;
    response.react = response.docusaurus;
    response.react = response.gatsby;
    console.timeLog('others');
    console.log('response', response);
  } catch (e) {
    console.log(`${urlToCheck}  error`, e);
  } finally {
    //await browser.close();
    console.timeEnd('businessLogic');
  }
};

start();
