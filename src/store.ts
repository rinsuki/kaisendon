import Vue from "vue"
import Vuex from "vuex"
import * as uuidv4 from "uuid/v4"

Vue.use(Vuex)

export const LOCALSTORAGE_NAME = "kaisendon::state"

export const store = new Vuex.Store({
    state: {
        columns: {} as {[key: string]: Column},
        columnLocations: [] as string[],
        users: {} as {[key: string]: UserToken},
        clients: {} as {[key: string]: Client},

        settings: {
            clientName: "海鮮丼",
        }
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
        },
        moveToRightColumn(state, uuid) {
            const i = state.columnLocations.indexOf(uuid)
            if (i == -1 || i == state.columnLocations.length - 1) return
            const tmpUuid = state.columnLocations[i+1]
            Vue.set(state.columnLocations, i, tmpUuid)
            Vue.set(state.columnLocations, i+1, uuid)
        },
        registerClient(state, payload) {
            Vue.set(state.clients, payload.id, payload)
        },
        registerToken(state, payload) {
            Vue.set(state.users, [payload.screenName, payload.hostName].join("@"), payload)
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
        },
        async createClient(context, instance_: string) {
            const instance = instance_
                .replace(/.*@/, "")
                .replace(/.+\/\//, "")
                .replace(/\/+$/, "")
            const scope = ["read", "write", "follow"].join(" ")
            const redirectUri = new URL(location.origin)
            redirectUri.pathname = "/oauth_callback.html"
            const createReq = await fetch("https://"+instance+"/api/v1/apps", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_name: context.state.settings.clientName,
                    redirect_uris: redirectUri.toString(),
                    scopes: scope,
                    website: location.origin,
                })
            })
            if (!createReq.ok) {
                throw await createReq.text()
            }
            const {
                client_id: clientId,
                client_secret: clientSecret,
            } = await createReq.json()
            const id = uuidv4()
            context.commit("registerClient", {
                id,
                instance,
                clientId,
                clientSecret,
            } as Client)
            const authUrl = new URL("https://"+instance)
            authUrl.pathname = "/oauth/authorize"
            authUrl.searchParams.set("client_id", clientId)
            authUrl.searchParams.set("response_type", "code")
            authUrl.searchParams.set("scope", scope)
            authUrl.searchParams.set("redirect_uri", redirectUri.toString())
            authUrl.searchParams.set("state", id)
            return {
                id,
                authUrl: authUrl.toString()
            }
        },
    },
    getters: {
        columnsList(state) {
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

window.addEventListener("storage", e => {
    if (e.key != LOCALSTORAGE_NAME) return
    store.commit("initialiseStore")
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

export interface UserToken {
    accessToken: string

    userId: string | number
    name: string
    screenName: string
    hostName: string

    avatarUrl: string
    avatarStaticUrl: string
}

export interface Client {
    id: string
    instance: string
    clientId: string
    clientSecret: string
}