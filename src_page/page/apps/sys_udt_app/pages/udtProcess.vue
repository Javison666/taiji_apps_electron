<template>
    <div class="box-window h-full w-full flex flex-col">
        <div class="box-header app-drag text-3xl items-center text-center text-white app-drag p-0">
            <div class="header-title">发现新版本</div>
            <div style="line-height: 26px;">
                <div
                    class="header-ver text-center"
                >V {{ newVersionInfo.newVersionDetails.versionNo }}</div>
            </div>
        </div>
        <div class="flex fex-col">
            <div class="box-content text-left w-full">
                <div
                    class="sub-item"
                    v-if="newVersionInfo.newVersionDetails.addRemarkList.length > 0"
                >
                    <div class="sub-title">【新增】</div>
                    <div class="sub-content">
                        <div v-for="item in newVersionInfo.newVersionDetails.addRemarkList" :key="item">{{ item }}</div>
                    </div>
                </div>
                <div
                    class="sub-item"
                    v-if="newVersionInfo.newVersionDetails.improveRemarkList.length > 0"
                >
                    <div class="sub-title">【优化】</div>
                    <div class="sub-content">
                        <div v-for="item in newVersionInfo.newVersionDetails.improveRemarkList" :key="item">{{ item }}</div>
                    </div>
                </div>
                <div
                    class="sub-item"
                    v-if="newVersionInfo.newVersionDetails.repairRemarkList.length > 0"
                >
                    <div class="sub-title">【修改】</div>
                    <div class="sub-content">
                        <div v-for="item in newVersionInfo.newVersionDetails.repairRemarkList" :key="item">{{ item }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="box-tip">
            <div class="box-tip-content">
                <span>
                    <svg
                        t="1642133287368"
                        style="display: inline; position: relative; top: -2px; left: -2px;"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2121"
                        width="16"
                        height="16"
                    >
                        <path
                            d="M512 4.12672c280.49408 0 507.87328 227.3792 507.87328 507.87328 0 280.49408-227.3792 507.87328-507.87328 507.87328C231.50592 1019.87328 4.12672 792.49408 4.12672 512 4.12672 231.50592 231.50592 4.12672 512 4.12672zM512 685.96736c-42.47552 0-76.91264 34.42688-76.91264 76.91264 0 42.47552 34.43712 76.91264 76.91264 76.91264 42.47552 0 76.91264-34.43712 76.91264-76.91264C588.91264 720.39424 554.47552 685.96736 512 685.96736zM509.78816 625.83808c36.58752 0 66.24256-29.66528 66.24256-66.24256l0-309.1456c0-36.58752-29.65504-66.24256-66.24256-66.24256-36.58752 0-66.24256 29.66528-66.24256 66.24256l0 309.1456C443.5456 596.18304 473.20064 625.83808 509.78816 625.83808z"
                            p-id="2122"
                            fill="#f5222d"
                        />
                    </svg>
                </span>
                <span>提醒：新版本更新后，需重启客户端方可使用</span>
            </div>
        </div>
        <div class="box-bottom text-center" v-if="!newVersionInfo.newVersionReady">
            <div v-if="processNum === -2">
                <div class="box-udt-button cursor-pointer text-white" @click="startUdtClient">更新版本</div>
            </div>
            <div v-else-if="processNum < 100">
                <div class="process-bar">
                    <div class="process-bg"></div>
                    <div class="process-ing" :style="{ width: processValue + '%' }"></div>
                    <div class="process-value">
                        <span v-if="processNum === -1" style="color: #D4454F;">{{ processValue }}%</span>
                        <span v-else style="color: #595959">{{ processValue }}%</span>
                    </div>
                    <div class="process-content">
                        <div v-if="processNum === -1">
                            更新失败
                            <a href="#" style="color: #D4454F;" @click="startUdtClient">重新下载</a>
                        </div>
                        <div v-else-if="processNum === 99">下载完成，正在安装...</div>
                    </div>
                </div>
            </div>
            <div v-else-if="processNum === 100">
                <div class="box-udt-button cursor-pointer text-white" @click="relaunch">重启客户端</div>
            </div>
        </div>
        <div class="box-bottom text-center" v-else>
            <div>
                <div class="box-udt-button cursor-pointer text-white" @click="relaunch">重启客户端</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import useUdtClient from "../use/useUdtClient";

const {
    processNum,
    processValue,
    startUdtClient,
    newVersionInfo,
    isStartUdt,
    getNewVersionInfo,
} = useUdtClient()

const destroyWindow = () => {
    client.app.destroyWindow()
}

const relaunch = () => {
    client.ipcRenderer.send('client:relaunchClient')
}

onMounted(async () => {
    await getNewVersionInfo()
})

</script>


<style lang="postcss" scoped>
.box-window {
    overflow: hidden;
    background: white;
}
.box-header {
    padding-top: 22px;
    height: 115px;
    z-index: 1;
    background: url(data:image/png;base64,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);
    background-size: 100% 100%;
}
.header-img {
    z-index: 0;
}
.header-title {
    font-size: 26px;
    letter-spacing: 2px;
}
.header-ver {
    font-size: 12px;
    border-radius: 4px;
    border: 1px solid #ffffff;
    display: inline-block;
    height: 24px;
    padding: 0 6px;
    line-height: 24px;
}
.box-content {
    height: 168px;
    padding: 0 35px;
    overflow: auto;
    margin-top: 16px;
}
.sub-item {
    padding-bottom: 16px;
}
.sub-title {
    font-size: 15px;
    font-weight: 600;
    padding-bottom: 10px;
}
.sub-content {
    padding-left: 6px;
    font-size: 14px;
}

.box-tip-content {
    background: #fff1f0;
    border-radius: 8px;
    border: 1px solid #ffa39e;
    color: #f5222d;
    font-size: 12px;
    display: inline-block;
    padding: 8px 12px;
}
.box-tip {
    padding: 16px 0;
}

.box-udt-button {
    width: 288px;
    height: 32px;
    background: linear-gradient(180deg, #e66e56 0%, #d3434e 100%);
    border-radius: 4px;
    line-height: 32px;
    display: inline-block;
}

.process-bar {
    width: 256px;
    height: 8px;
    background: #d9d9d9;
    border-radius: 4px;
    margin-left: 28px;
    position: relative;
}
.process-ing {
    width: 0;
    height: 8px;
    background: #d9d9d9;
    border-radius: 4px;
    background: linear-gradient(90deg, #e56c56 0%, #d5484f 100%);
    transition: width 0.2s linear;
    position: absolute;
}
.process-value {
    position: absolute;
    left: 260px;
    font-size: 14px;
    width: 30px;
    top: -6px;
    letter-spacing: 0;
}
.process-content {
    text-align: left;
    padding-top: 14px;
    font-size: 12px;
}
</style>