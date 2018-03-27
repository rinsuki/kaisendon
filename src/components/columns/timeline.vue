<template>
    <column v-bind="columnInfo">
        <div>
            <div v-if="loading">
                ロード中...
            </div>
            <div v-if="loadingError">
                ロードに失敗しました。
            </div>
            <article v-for="post in posts" :key="post.id">
                <img :src="post.account.avatar" />
                <div class="main">
                    <a :href="post.account.url" target="_blank">
                        {{ post.account.display_name || post.account.username }}
                        <span class="screen-name">@{{ post.account.acct }}</span>
                    </a>
                    <div class="post-text" v-html="post.content"></div>
                </div>
            </article>
        </div>
    </column>
</template>

<script lang="ts">
import Vue from 'vue'
import { store, Column } from "../../store"
import column from "../common/column.vue"

export default Vue.extend({
    data: () => ({
        posts: [] as any[],
        ws: undefined as WebSocket | undefined,
        loading: true,
        loadingError: false,
    }),
    props: {
        uuid: {
            type: String,
        }
    },
    components: {
        column
    },
    methods: {
        connectStream() {
            const url = new URL("wss://"+this.params.instance+"/api/v1/streaming")
            url.searchParams.append("stream", this.params.type)
            switch (this.params.type) {
            case "hashtag":
            case "hashtag:local":
                url.searchParams.append("tag", this.params.hashtag)
            }
            const ws = new WebSocket(url.toString())
            ws.addEventListener("close", () => {
                this.connectStream()
            })
            ws.addEventListener("message", (msg) => {
                const m = JSON.parse(msg.data)
                if (m.event != "update") {
                    return
                }
                const a = m.payload
                this.posts.unshift(JSON.parse(a))
                while (this.posts.length >= 1000) {
                    this.posts.pop()
                }
            })
            this.ws = ws
        },
        getUrl(params: {[key: string]: any}): URL {
            var soutai = ""
            switch(this.params.type) {
            case "home":
                soutai = "timelines/home"
                break
            case "public:local":
                params["local"] = true
            case "public":
                soutai = "timelines/public"
                break
            case "hashtag:local":
                params["local"] = true
            case "hashtag":
                soutai = "timelines/tag/"+this.params.hashtag
                break
            }
            if (soutai == "") {
                throw "invalid-timeline-type: "+this.params.type
            }
            const url = new URL(soutai, "https://"+this.params.instance+"/api/v1/")
            Object.keys(params).forEach(k => {
                url.searchParams.append(k, params[k])
            })
            return url
        }
    },
    computed: {
        params(): Column["params"] {
            return store.state.columns[this.uuid].params
        },
        columnInfo(): any {
            const typeToIcon = {
                "home": "home",
                "public": "globe",
                "public:local": "users",
                "hashtag": "hashtag",
                "hashtag:local": "hashtag",
            } as {[key: string]: string}
            const titleToIcon = {
                "home": "ホームタイムライン",
                "public": "連合タイムライン",
                "public:local": "ローカルタイムライン",
            } as {[key: string]: string}
            const r = {
                icon: typeToIcon[this.params.type],
                title: titleToIcon[this.params.type],
                account: this.params.instance,
                uuid: this.uuid,
            }
            if (this.params.type == "hashtag" || this.params.type == "hashtag:local") {
                r.title = this.params.hashtag
            }
            return r
        }
    },
    created() {
        fetch(this.getUrl({limit: 20}).toString()).then(r => r.json()).then(r => {
            this.posts = r
            this.loading = false
            this.connectStream()
        }).catch(e => {
            console.error("Timeline Load Error:",e)
            this.loading = false
            this.loadingError = true
        })
    },
    destroyed() {
        if (this.ws) {
            this.ws.close()
            this.ws = undefined
        }
    }
})
</script>

<style lang="stylus" scoped>
article
    display flex
    padding 0.5em

    &:not(:first-child)
        border-top solid 1px #888

    img
        size = 3em
        width size
        height size
        margin-right 1em
    
    .main
        flex 1
</style>