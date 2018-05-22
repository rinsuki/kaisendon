<template>
    <div class="app">
        <div class="column-selector">
            <a v-for="column in columns" :href="'#' + column.uuid" :key="column.uuid">
                <i class="fa fa-home" />
            </a>
        </div>
        <div class="columns">
            <template v-for="column in columns">
                <div :is="'column-'+column.type" :id="column.uuid" :key="column.uuid" :uuid="column.uuid">
                    <column :uuid="column.uuid" class="error-column">
                        <div>
                            <p>現在カラムをロードしています。</p>
                            <p>いつまでたってもこのカラムが表示されない場合は、内部エラーが発生している可能性があります。</p>
                            <p>右上の <i class="fa fa-cog" /> をクリックすると、このカラムを削除することができます。</p>
                        </div>
                    </column>
                </div>
            </template>
            <column title="新規カラムを追加" icon="plus">
                <form v-on:submit="add">
                    <input v-model="newInstance">
                    <button>+</button>
                </form>
                <h2>アカウント追加</h2>
                <form @submit="addAccount">
                    <input v-model="authInstance">
                    <button>認証</button>
                </form>
            </column>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ColumnTimeline from "./components/columns/timeline.vue"
import column from "./components/common/column.vue"
import { store } from "../store"
import { mapGetters } from 'vuex';

export default Vue.extend({
    components: {
        "column-timeline": ColumnTimeline,
        column,
    },
    data: () => ({
        newInstance: "",
        authInstance: "",
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
        },
        addAccount(e: any) {
            e.preventDefault()
            this.$store.dispatch('createClient', this.authInstance).then(r => location.href = r.authUrl)
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
    position sticky
    background rgba(238, 238, 238, 0.9)
    left 0
    display flex
    flex-flow column
    > a
        font-size 2rem
        width 1.5em
        height 1.5em
        text-align: center
        > i
            display inline-block
            vertical-align middle
        color: #666
        
.columns
    flex 1
    display flex
    > *
        margin 0.5em
    > *, .error-column
        display block
        flex 0 0 auto
        width 360px
</style>
