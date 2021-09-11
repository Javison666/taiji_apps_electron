import nodeStorage from 'client/base/electron/nodeStorage'

interface DataItem {
  uri: string,
  remark: string,
  favicon: string
}

export default class BootmarkManager {

  private sourceData: DataItem[] = []
  private touchUpdateFunction: (data: DataItem[]) => void

  constructor(initData: DataItem[]) {
    this.sourceData = initData
    this.touchUpdateFunction = ([]) => { }
  }

  resetData(data: DataItem[]) {
    this.sourceData = data
  }

  get data() {
    return this.sourceData
  }

  addItem(item: DataItem) {
    let bookmark = this.sourceData.find(i => i.uri === item.uri)
    if (bookmark) {
      bookmark.favicon = item.favicon
      bookmark.remark = item.remark
    } else {
      this.sourceData.push(item)
    }
    this.touchUpdate()
  }

  delItem(uri: string) {
    this.sourceData = this.sourceData.filter(i => i.uri !== uri)
    this.touchUpdate()
  }

  registerTouchUdt(touchUpdateFunction: (data: DataItem[]) => void) {
    this.touchUpdateFunction = touchUpdateFunction
  }

  touchUpdate() {
    nodeStorage.setItem('bookmark', this.data)
    this.touchUpdateFunction(this.data)
  }

}
