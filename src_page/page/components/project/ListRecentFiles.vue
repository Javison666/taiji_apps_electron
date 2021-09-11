<template>
    <ul>
        <li v-for="(item, idx) in fileHistoryState.list" :key="idx">
            <div
                class="pl-3 pr-3 py-1 flex flex-nowrap items-center justify-between text-xs"
                style="line-height: .8rem;"
            >
                <div class="flex-none max-w-full truncate">
                    <a
                        href="#"
                        class="font-medium text-purple-600 hover:text-purple-500 cursor-pointer"
                        :title="item.file_path"
                        v-text="getFileNameFromPath(item.file_path)"
                    >
                    </a>
                </div>
                <div
                    class="flex-grow ml-2 text-left truncate text-gray-500"
                >
                    <span
                        :title="item.file_path"
                        v-text="item.file_path"
                    ></span>
                </div>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">
import { ref, onMounted, reactive } from "vue";
import useFileHistory from "../../use/useFileHistory";
import { getFileNameFromPath } from '../../utils/common'

export default {
    name: "listRecentFiles",
    setup() {
        const { fileHistoryState, updateFilesHistoryList } = useFileHistory();
        onMounted(async () => {
            await updateFilesHistoryList();
        });

        return {
            fileHistoryState,
            getFileNameFromPath
        };
    },
};
</script>
