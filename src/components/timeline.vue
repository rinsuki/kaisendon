<template>
    <div class="container">
        <h1>{{ instance }}</h1>
        <div>
            <div v-if="loading">
                ロード中...
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
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data: () => ({
        posts: [] as any[],
        ws: undefined as WebSocket | undefined,
        loading: true,
    }),
    props: {
        instance: {
            type: String,
        }
    },
    methods: {
        connectStream() {
            this.instance
            const ws = new WebSocket("wss://"+this.instance+"/api/v1/streaming?stream=public:local")
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
            })
            this.ws = ws
        }
    },
    created() {
        fetch("https://"+this.instance+"/api/v1/timelines/public?local=true&limit=20").then(r => r.json()).then(r => {
            this.posts = r
            this.loading = false
            this.connectStream()
        })
    }
})
</script>

<style scoped>
    .container {
        width: 320px;
        flex: 0 0 auto;
    }
    article {
        display: flex;
    }
    img {
        width: 3em;
        height: 3em;
        margin-right: 1em;
    }
    .main {
        flex: 1;
    }
</style>
