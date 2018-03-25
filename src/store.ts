import Vue from "vue"
import Vuex from "vuex"
import * as uuidv4 from "uuid/v4"

Vue.use(Vuex)

export const LOCALSTORAGE_NAME = "kaisendon::state"

export const store = new Vuex.Store({
    state: {
        columns: {} as {[key: string]: Column},
        columnLocations: [] as string[],
    },
    mutations: {
        addColumn(state, payload) {
            state.columns[payload.uuid] = payload.column
            state.columnLocations.push(payload.uuid)
        },
        removeColumn(state, payload) {
            delete state.columns[payload]
            state.columnLocations = state.columnLocations.filter(uuid => uuid != payload)
        },
        initialiseStore(state) {
            const storage = localStorage.getItem(LOCALSTORAGE_NAME)
            if (storage) {
                (<any>this).replaceState(Object.assign(state, JSON.parse(storage)))
            }
        }
    },
    actions: {
        addColumn(context, column: Column) {
            context.commit("addColumn", {
                uuid: uuidv4(),
                column
            })
        },
        removeColumn(context, uuid: string) {
            context.commit("removeColumn", uuid)
        }
    }
})

store.commit("initialiseStore")

store.subscribe((mutation, state) => {
    localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(state))
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

