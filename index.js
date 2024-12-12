const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://vibe.naver.com/chart/total');
    const html = await page.content();
    const title = await page.title();
    const text = await page.evaluate(() => {
        return document.querySelector('body').innerText;
    });
    // const songs= await page.evaluate(() => 
    //     Array.from(document.querySelectorAll('.tracklist tbody tr'), (e) => ({
    //         rank: e.querySelector('.rank span').innerText,
    //         song: e.querySelector('.song .link_text span').innerText,
    //         artist: e.querySelector('.artist .link_artist span').innerText,
    //     }))
    // );   
    
    const songs = await page.$$eval('.tracklist tbody tr', (elements) => 
        elements.map((e) => ({
            rank: e.querySelector('.rank span').innerText,
            song: e.querySelector('.song .link_text span').innerText,
            artist: e.querySelector('.artist .link_artist span').innerText,
        }))
    );
    // .json 파일로 저장

    fs.writeFile('top100.json', JSON.stringify(songs), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    await browser.close();
}

run();