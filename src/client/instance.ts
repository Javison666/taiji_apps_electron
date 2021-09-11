import BookmarkManagerInstance from 'client/base/common/bookmark'

export const App_Browser_Win_list: Set<Electron.BrowserWindow> = new Set();

export const BookmarkManager = new BookmarkManagerInstance([])
