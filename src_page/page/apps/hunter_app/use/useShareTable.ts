import { reactive, ref } from 'vue'

type tableId = string | number

interface ITableItem {
    id: tableId,
    tableName: string
}

interface ITableHeader {
    value: string | number,
}
interface ITableCellData {
    value: string | number
}

interface ITableData {
    id: tableId,
    headers: ITableHeader[],
    dataList: ITableCellData[][]
}

export default () => {
    const tableList = ref(<ITableItem[]>[])
    const curTableId = ref(<string | number>'')
    const tableData = reactive(<{ data: ITableData | null }>{ data: null })

    // test
    tableList.value = [{
        id: 1,
        tableName: '先手'
    }, {
        id: 3,
        tableName: '真爱'
    }, {
        id: 2,
        tableName: '东哥'
    }]

    const TableDataList = [
        {
            id: 1,
            headers: [{
                value: '先手1'
            }, {
                value: '先手2'
            }],
            dataList: [
                [{
                    value: 111
                }, {
                    value: 222
                }]
            ]
        },
        {
            id: 2,
            headers: [{
                value: '东哥1'
            }, {
                value: '东哥2'
            }],
            dataList: [
                [{
                    value: 333
                }, {
                    value: 444
                }]
            ]
        }
    ]


    const changeCurTable = (tableId: tableId) => {
        curTableId.value = tableId
        let data =  TableDataList.find(i => i.id === tableId)
        if(data){
            tableData.data = data
        }else{
            tableData.data = null
        }
    }

    changeCurTable(tableList.value[0].id)

    return {
        tableList,
        curTableId,
        changeCurTable,
        tableData
    }
}