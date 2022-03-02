<template>
  <div>
    <div class="table-name-list flex flex-row">
      <div
        v-for="tableItem in tableList"
        :key="tableItem.id"
        class="cursor-pointer"
        :class="{ 'text-green-400': tableItem.id === curTableId }"
        @click="changeCurTable(tableItem.id)"
      >
        {{ tableItem.tableName }}
      </div>
    </div>
    <div v-if="tableData.data">
      <table border="1">
        <tr>
          <th v-for="(tableHeader, idx) in tableData.data.headers" :key="idx">{{tableHeader.value}}</th>
        </tr>
        <tr v-for="(tableData, idx) in tableData.data.dataList" :key="idx">
          <td v-for="(cell, idx) in tableData" :key="idx">{{ cell.value }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import useShareTable from "../use/useShareTable";

export default defineComponent({
  name: "ShareTable",
  setup() {
    const { tableList, curTableId, changeCurTable, tableData } = useShareTable();
    onMounted(async () => {});
    return {
      tableList,
      curTableId,
	  changeCurTable,
	  tableData
    };
  },
});
</script>

<style lang="postcss" scoped>
</style>