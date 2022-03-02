import * as fs from "fs";
import * as path from "path";
import { outDir, appNames } from "./env";

for (let appName of appNames) {
    const htmlPath = path.join(process.cwd(), outDir, `page/apps/${appName}/index.html`)
    if(fs.existsSync(htmlPath)){
        let content = fs.readFileSync(htmlPath).toString()
        content = content.replace(/\/assets/g, '../../../assets')
        fs.writeFileSync(htmlPath, content, {
            flag: 'w'
        })
    }
}