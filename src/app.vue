<template>
    <div class="app">
        <div class="column-selector">
            <a v-for="column in columns" :href="'#' + column.uuid" :key="column.uuid">
                <i class="fa fa-home" />
            </a>
        </div>
        <div class="columns">
            <template v-for="column in columns">
                <div :is="'column-'+column.type" :id="column.uuid" :key="column.uuid" :uuid="column.uuid" />
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
import { mapGetters } from 'vuex';

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
        ...mapGetters({
            columns: "columnsList"
        })
    }
})
</script>


<style lang="stylus" scoped>
.app
    display flex
    width 100vw
    height 100vh
    overflow-y hidden
.column-selector
    display flex
    flex-flow column
.columns
    flex 1
    display flex
    overflow-x auto
    > *
        flex 0 0 auto 
        width 360px
</style>
