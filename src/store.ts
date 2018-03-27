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
        },
        moveToLeftColumn(state, uuid) {
            const i = state.columnLocations.indexOf(uuid)
            if (i < 1) return
            const tmpUuid = state.columnLocations[i-1]
            Vue.set(state.columnLocations, i, tmpUuid)
            Vue.set(state.columnLocations, i-1, uuid)
            console.log(state)
            state.columnLocations = state.columnLocations
        },
        moveToRightColumn(state, uuid) {
            const i = state.columnLocations.indexOf(uuid)
            if (i == -1 || i == state.columnLocations.length - 1) return
            const tmpUuid = state.columnLocations[i+1]
            Vue.set(state.columnLocations, i, tmpUuid)
            Vue.set(state.columnLocations, i+1, uuid)
            console.log(state)
            state.columnLocations = state.columnLocations
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
    },
    getters: {
        columnsList(state) {
            console.log(state)
            return state.columnLocations.map(uuid => ({
                uuid,
                ...state.columns[uuid],
            }))
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

