export function getImgCodeLeft(src: string) {
    return new Promise(resolve => {
        var img = new Image();
        img.src = `data:image/jpeg;base64,${src}`;
        var canvas = <HTMLCanvasElement>document.getElementById('canvas');
        if(!canvas){
            return
        }
        var ctx = <CanvasRenderingContext2D >canvas.getContext('2d');
        var arr = [];
        img.onload = function () {
            const width = 552
            const height = 344
            ctx.drawImage(img, 0, 0);
            var imgData = ctx.getImageData(0, 0, width, height).data;
            // console.log(imgData)
            let pixls = []
            let p = []
            let line = []
            for (let i = 0, l = imgData.length; i < l; i++) {
                if ((i + 1) % 4 === 0) {
                    p.push(imgData[i])
                    line.push(p)
                    if ((i + 1) % (width * 4) === 0) {
                        pixls.push(line)
                        line = []
                    }
                    p = []
                } else {
                    p.push(imgData[i])
                }
            }
            // console.log(pixls);


            let whiteLine = []
            for (let i = 1; i < width - 1; i++) {
                let o: any = {
                    x: i,
                    start: null,
                    end: null,
                    isWhite: false
                }
                for (let j = 0; j < height; j++) {
                    if ((pixls[j][i][0] + pixls[j][i][1] + pixls[j][i][2] > 600) && (pixls[j][i + 1][0] + pixls[j][i + 1][1] + pixls[j][i + 1][2] < 225)) {
                        if (o.isWhite) {
                            o.end = j
                        } else {
                            o.start = j
                            o.end = j
                        }
                        o.isWhite = true
                    } else {
                        if (o.isWhite) {
                            whiteLine.push(o)
                        }
                        o = {
                            x: i,
                            start: null,
                            end: null,
                            isWhite: false
                        }

                    }
                }
            }

            // console.log(whiteLine)
            let res = whiteLine.filter(i => ((i.end - i.start) > 12))
            res = [...new Set(res.map(i=>i.x))]
            resolve(res)
        };
    })
}
