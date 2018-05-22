import Vue from "vue"
import app from "./app.vue"
import { store } from "../store";

new Vue({
    el: "#app",
    render: h => h(app),
    store,
})