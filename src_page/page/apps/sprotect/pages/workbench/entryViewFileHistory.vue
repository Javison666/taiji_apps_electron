<template>
    <div class="flex flex-col absolute w-full h-full">
        <div class="pt-6 bg-purple-600">
            <h1 class="text-4xl p-8 pb-1 font-black text-white">Sprotect</h1>
            <h2
                class="text-1xl p-2 pb-14 text-white animate-pulse tracking-widest"
            >
                Protect your code, protect your app!
            </h2>
        </div>
        <div class="flex flex-grow overflow-hidden p-4 pt-2">
            <div class="flex flex-col flex-nowrap w-8/12 pr-8">
                <div class="text-left py-2 flex-none">最近文件</div>
                <div
                    class="flex-grow overflow-y-auto bg-gray-100 rounded-lg pt-1"
                >
                    <ListRecentFiles />
                    <!-- <div class="text-left">
                        <span class="ml-2 text-xs text-gray-500"
                            >暂无历史记录，请打开新的文件开始吧！</span
                        >
                    </div> -->
                </div>
            </div>
            <div class="text-left">
                <div class="py-2">开始</div>
                <div class="text-xs">
                    <div class="py-1">
                        <a
                            href="#"
                            class="font-medium text-purple-600 hover:text-purple-500 cursor-pointer"
                            @click.prevent="openNewFile"
                        >
                            打开新的文件
                        </a>
                    </div>
                    <div class="py-1">
                        <a
                            href="#"
                            class="font-medium text-purple-600 hover:text-purple-500 cursor-pointer"
                        >
                            帮助
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import ListRecentFiles from "@/components/project/ListRecentFiles.vue";
import { openNewAndAddToFileHistory } from '../../../../bridge/fileHistory'

export default {
    components: {
        ListRecentFiles,
    },
    setup() {
        const openNewFile = async () => {
            const openFileUri = await openNewAndAddToFileHistory()
            // const res: any = await client.ipcRenderer.showOpenDialog({
            //     properties: ["openFile"],
            // });
            // if (!res.canceled) {
            //     await client.ipcMessagePort.callApp("Shared_Process", {
            //         channelType: "fileHistory",
            //         channelCommond: "addFileHistory",
            //         reqData: {
            //             filePath: res.filePaths[0],
            //         },
            //     });
            // }
            return openFileUri
        };
        return {
            openNewFile,
        };
    },
    methods: {},
};
</script>
