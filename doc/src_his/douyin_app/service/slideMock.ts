import { Page } from 'puppeteer';
import { sleep } from 'src_page/page/utils/common';


const getTimeUnit = () => {
    const len = getRandomRangeValue(40, 0.2)
    const rate = 0.1
    return Math.random() * (len * rate * 2) + len - len * rate
}

const getRandomRangeValue = (num: number, rate: number) => {
    return num * (1-rate/2) + num * rate * Math.random()
}

export default async (page: Page, left: number, rect: { x: number, y: number, width: number, height: number }) => {
    await page.mouse.move(rect.x + Math.floor(Math.random() * rect.width) - 10, rect.y + Math.floor(Math.random() * rect.height) - 10);
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + Math.floor(Math.random() * rect.width) - 6, rect.y + Math.floor(Math.random() * rect.height) - 6);
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + Math.floor(Math.random() * rect.width) - 3, rect.y + Math.floor(Math.random() * rect.height) - 3);
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + Math.floor(Math.random() * rect.width) - 1, rect.y + Math.floor(Math.random() * rect.height) - 1);
    await sleep(getTimeUnit())
    let startX = Math.floor(Math.random() * rect.width)
    await page.mouse.move(rect.x + startX, rect.y + Math.floor(Math.random() * rect.height));
    await page.mouse.down();
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.2, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.34, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.40, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.52, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.61, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.7, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.8, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.84, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.88, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.92, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.94, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.95, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.97, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.98, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX + left * getRandomRangeValue(0.99, 0.1), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.move(rect.x + startX  + getRandomRangeValue(left, 0.02), rect.y + Math.floor(Math.random() * rect.height));
    await sleep(getTimeUnit())
    await page.mouse.up();
}