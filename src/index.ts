import Vue from "vue"
import app from "./app.vue"
import "./global.css"
import { store } from "./store";

store.dispatch("addColumn", {
    type: "timeline",
    params: {
        instance: "mstdn.maud.io",
        type: "public:local",
    }
})

store.dispatch("addColumn", {
    type: "timeline",
    params: {
        instance: "mstdn.veryyyyyyyyyyyyyyyyyyyyyyyyyyylongdomain.example",
        type: "hashtag",
        hashtag: "veryyyyyyyyyyyyyyyyyyyyyyylonghashtag",
    }
})

new Vue({
    el: "#app",
    render: h => h(app),
    store,
})