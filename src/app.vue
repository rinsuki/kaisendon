<template>
    <div>
        <div class="columns">
            <template v-for="column in columns">
                <div :is="'column-'+column.type" :key="column.uuid" :uuid="column.uuid" />
            </template>
            <column title="新規カラムを追加" icon="plus">
                <form v-on:submit="add">
                    <input v-model="newInstance">
                    <button>+</button>
                </form>
            </column>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ColumnTimeline from "./components/columns/timeline.vue"
import column from "./components/common/column.vue"
import { store } from "./store"

export default Vue.extend({
    components: {
        "column-timeline": ColumnTimeline,
        column,
    },
    data: () => ({
        newInstance: "",
    }),
    methods: {
        add(e: any) {
            e.preventDefault(e)
            store.dispatch("addColumn", {
                type: "timeline",
                params: {
                    instance: this.newInstance,
                    type: "public:local",
                }
            }).then(() => {
                this.newInstance = ""
            })
        }
    },
    computed: {
        columns() {
            return store.state.columnLocations.map(uuid => ({
                uuid,
                ...store.state.columns[uuid]
            }))
        }
    }
})
</script>

<style scoped>
    .columns {
        display: flex;
    }
    .columns > * {
        flex: 0 0 auto;
        width: 360px;
    }
</style>