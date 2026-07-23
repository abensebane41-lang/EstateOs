const { chromium } = require('playwright');
const path = require('path');

const files = [
  { html: 'social-post-1080x1080.html', png: 'social-post-1080x1080.png', width: 1080, height: 1080 },
  { html: 'facebook-cover-820x312.html', png: 'facebook-cover-820x312.png', width: 820, height: 312 },
  { html: 'linkedin-post-1200x627.html', png: 'linkedin-post-1200x627.png', width: 1200, height: 627 },
  { html: 'twitter-post-1200x675.html', png: 'twitter-post-1200x675.png', width: 1200, height: 675 },
  { html: 'youtube-thumbnail-1280x720.html', png: 'youtube-thumbnail-1280x720.png', width: 1280, height: 720 },
  { html: 'pinterest-pin-1000x1500.html', png: 'pinterest-pin-1000x1500.png', width: 1000, height: 1500 },
  { html: 'instagram-story-1080x1920.html', png: 'instagram-story-1080x1920.png', width: 1080, height: 1920 },
];

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\HP\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe',
  });
  const dir = __dirname;

  for (const f of files) {
    const page = await browser.newPage({ viewport: { width: f.width, height: f.height } });
    const htmlPath = path.join(dir, f.html);
    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'));
    await page.waitForTimeout(2000);
    const pngPath = path.join(dir, f.png);
    await page.screenshot({ path: pngPath, type: 'png' });
    console.log('Created: ' + f.png);
    await page.close();
  }

  await browser.close();
  console.log('Done!');
})();
