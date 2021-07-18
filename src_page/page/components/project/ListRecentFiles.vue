<template>
    <ul>
        <li v-for="(item, idx) in list" :key="idx">
            <div
                class="pl-3 pr-3 py-1 flex flex-nowrap items-center justify-between text-sm"
            >
                <div class="flex-none max-w-full truncate">
                    <a
                        href="#"
                        class="font-medium text-purple-600 hover:text-purple-500 cursor-pointer"
                    >
                        asdf.pdf
                    </a>
                </div>
                <div class="flex-grow ml-2 text-left truncate text-xs text-gray-500">
                    <span :title="item.path"
                        >D:1/2/3/resume_back/resume_back/resume_back</span
                    >
                </div>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">
export default {
    props: ["listRecentFiles"],
    data: () => ({
        list: [
            {
                path: "/1/2/3.txt",
                time: 123,
            },
            {
                path: "/1/2/3.txt",
                time: 123,
            },
            {
                path: "/1/2/3.txt",
                time: 123,
            },
            {
                path: "/1/2/3.txt",
                time: 123,
            },
            {
                path: "/1/2/3.txt",
                time: 123,
            },
            {
                path: "/1/2/3.txt",
                time: 123,
            },
            {
                path: "/1/2/3.txt",
                time: 123,
            },
            {
                path: "/1/2/3.txt",
                time: 123,
            },
        ],
    }),
};
</script>
