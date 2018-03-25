import Vue from "vue"
import Vuex from "vuex"
import * as uuidv4 from "uuid/v4"

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        columns: {} as {[key: string]: Column}
    },
    mutations: {
        addColumn(state, payload) {
            state.columns[payload.uuid] = payload.column
        }
    },
    actions: {
        addColumn(context, column: Column) {
            context.commit("addColumn", {
                uuid: uuidv4(),
                column
            })
        }
    }
})

interface ColumnTimeline {
    type: "timeline"
    params: {
        instance: string
        account?: string
        type: "home" | "public" | "public:local"
    } | {
        instance: string
        account?: string
        type: "hashtag" | "hashtag:local"
        hashtag: string
    }
}

export type Column = ColumnTimeline

