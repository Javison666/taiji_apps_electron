// M2R: main to render
// R2M: render to main

enum IpcMessageType {
  M2R_UpdateWindowBookmark= 'M2R_UpdateWindowBookmark',
  R2M_AddAndUdtBookmark = 'R2M_AddAndUdtBookmark',
  R2M_DelBookmark = 'R2M_DelBookmark'
}

export default IpcMessageType