import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        tabs: [] as string[]
    },
    mutations: {
        addTab(state, payload) {
            state.tabs.push(payload)
        }
    },
    actions: {
        addTab(context, instance: string) {
            context.commit("addTab", instance)
        }
    }
})

