const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://vibe.naver.com/chart/total');

    // '.tracklist tbody tr' 요소가 나타날 때까지 기다립니다.
    await page.waitForSelector('.tracklist tbody tr');

    const songs = await page.$$eval('.tracklist tbody tr', (elements) => 
        elements.map((e) => ({
            rank: e.querySelector('.rank span').innerText,
            song: e.querySelector('.song .link_text span').innerText,
            artist: e.querySelector('.artist .link_artist span').innerText,
        }))
    );

    fs.writeFile('top100.json', JSON.stringify(songs), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    await browser.close();
}

run();