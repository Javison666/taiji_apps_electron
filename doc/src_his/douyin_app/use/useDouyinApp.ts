import { Page } from 'puppeteer';
import { puppeteer, sleep, path, fs } from 'src_page/page/utils/common'
import { aweme_ids, randomComment, randomFaceText } from '../data/example'
import Logger from 'src/client/platform/environment/node/logger'
import { getImgCodeLeft } from '../service/captcha';
import slideMock from '../service/slideMock';

const userDataDir = path.join(process.cwd(), 'userData')

if (!fs.existsSync(userDataDir)) {
    if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir);
    }
};

let isOldCaptcha = false
let captchaImgSrcMap = new Map()
let isCrackingCaptcha = false


const crackCaptcha = async (page: Page) => {
    if (isCrackingCaptcha) {
        return
    }
    isCrackingCaptcha = true
    let src = await page.$eval('#captcha-verify-image', (el) => el.getAttribute('src'));
    let buf = captchaImgSrcMap.get(src)
    const base64Str = buf.toString('base64')
    let res = <number[]>await getImgCodeLeft(base64Str)
    console.log('crackCaptcha', res)
    let rect = await page.evaluate(() => {
        let dat = document.getElementsByClassName('secsdk-captcha-drag-icon')[0].getBoundingClientRect()
        return Promise.resolve({
            x: dat.x,
            y: dat.y,
            width: dat.width,
            height: dat.height
        });
    });
    if (res.length >= 1) {
        console.log('rect', rect)
        await slideMock(page, res[0] * (340/554), rect)
        isCrackingCaptcha = false
    }else{
        await slideMock(page, Math.random() * 340, rect)
    }
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) - 10, rect.y + Math.floor(Math.random()*rect.height) - 10);
        // await sleep(Math.floor(Math.random()*20))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) - 6, rect.y + Math.floor(Math.random()*rect.height) - 6);
        // await sleep(Math.floor(Math.random()*20))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) - 3, rect.y + Math.floor(Math.random()*rect.height) - 3);
        // await sleep(Math.floor(Math.random()*20))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) - 1, rect.y + Math.floor(Math.random()*rect.height) - 1);
        // await sleep(Math.floor(Math.random()*20))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width), rect.y + Math.floor(Math.random()*rect.height));
        // await page.mouse.down();
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.2 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.34 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.40, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.52 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.61 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.7 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.8 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.84 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.88 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.92 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.94 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.95 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.97 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.98 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + Math.floor(Math.random()*rect.width) + res[0] * 0.99 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.move(rect.x + res[0] * 1 - rect.width, rect.y + Math.floor(Math.random()*rect.height));
        // await sleep(Math.floor(Math.random()*30))
        // await page.mouse.up();

    
}

const checkCaptcha = async (page: Page) => {
    try {
        // 先不管登录
        const CaptchaStyleContent = await page.$eval('#captcha_container', (el) => el.getAttribute('style'));
        const isCaptcha = CaptchaStyleContent?.split(';').find(i => i.includes('display'))?.includes('block')
        if (isCaptcha) {
            if (!isOldCaptcha) {
                isOldCaptcha = true
                Logger.INSTANCE.info('Captcha start', isCaptcha)
            }
            return true
        } else {
            isOldCaptcha = false
            return false
        }
    } catch (err) {
        // Logger.INSTANCE.error(err)
        return false
    }
}

const waitCaptcha = (page: Page) => {
    return new Promise(async (resolve) => {
        console.log('waitCaptcha')
        if (await checkCaptcha(page)) {
            await crackCaptcha(page)
            await sleep(1000)
            await waitCaptcha(page)
        }
        resolve(null)
    })
}


export default () => {
    const launchDouyin = async () => {
        const browser = await puppeteer.launch({
            headless: false,
            channel: 'chrome',
            userDataDir: userDataDir
            // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        });
        const page: Page = await browser.newPage();

        page.on('close', () => {
            window.location.reload()
        })


        page.on('response', async (httpResponse) => {
            const url = httpResponse.url()

            // 获取足够的视频id
            // if(url.includes(`/aweme/v1/web/tab/feed/`)){
            //     const json: any = await httpResponse.json()
            //     console.log(json)
            //     let aweme_ids = []
            //     if(json.aweme_list){
            //         for(let aweme of json.aweme_list){
            //             aweme_ids.push(aweme.aweme_id + ',\n')
            //         }
            //     }
            //     fs.writeFileSync(path.join(process.cwd(), 'aweme_ids.txt'),aweme_ids.join(''), {
            //         flag: 'a'
            //     })
            // }

            if (url.includes(`/aweme/v1/web/comment/publish`)) {
                Logger.INSTANCE.info('comment publish:', await httpResponse.text())
            }

            if (url.includes('catpcha.byteimg.com')) {
                let buf = await httpResponse.buffer()
                let url = await httpResponse.url()
                captchaImgSrcMap.set(url, buf)
            }
        })

        await page.goto('https://www.douyin.com/', {
            waitUntil: 'domcontentloaded'
        });

        await sleep(2000)
        Logger.INSTANCE.info('start waitCaptcha.')
        await waitCaptcha(page)


        for (let aweme_id of aweme_ids) {
            try {
                Logger.INSTANCE.info('start goto video:', aweme_id)
                await page.goto(`https://www.douyin.com/video/${aweme_id}`, {
                    waitUntil: 'domcontentloaded'
                })
                // if(Math.random() < 0.5){
                //     await sleep(5000)
                //     continue
                // }
                await sleep(5000)
                await waitCaptcha(page)
                await sleep(3000)
                await page.click('.public-DraftStyleDefault-ltr')
                await sleep(200)
                await page.keyboard.type(randomComment() + randomFaceText());
                await sleep(1000)
                await page.keyboard.press('Enter');
                await sleep(19000)
               
            } catch (err) {
                Logger.INSTANCE.info(aweme_id, 'err', err)
            }
        }

        // await sleep(1000)
        // page.hover(page.$('._77gLxeuo'))

        // const aweme_ids = [
        //     '7040692249885281574',
        //     '7008623784370441486',
        //     '7037396487508217129',
        //     '7040035019317906720',
        //     '7039164533830602023',
        //     '7040371729067265314',
        //     '7034721770938879240',
        //     '7041008373155761444',
        //     '7040743859395120399',
        //     '7040743859395120399',
        //     '7040266510526467331',
        //     '7035622148341288223',
        //     '7040498351942438180',
        //     '7040750988906532110'
        // ]

        // for(let aweme_id of aweme_ids){
        //     await page.goto(`https://www.douyin.com/video/${aweme_id}`)
        // }


    }

    return {
        launchDouyin
    }
}

class House {
    
    private static readonly INSTANCE = new House()
    
    private _packetMap: Map<number, any> = new Map()

    constructor(){}

    buyPacket(o: {packetCode: number, packetPrice: number}){
        if(House.INSTANCE._packetMap.get(o.packetCode)){

        }else{
            House.INSTANCE._packetMap.set(o.packetCode, {
                num: 1,
                costPrice: o.packetPrice
            })
        }
    }
}