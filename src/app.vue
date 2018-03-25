<template>
    <div>
        <div class="columns">
            <timeline v-for="instance in $store.state.tabs" :key="instance" :instance="instance"/>
            <div>
                <form v-on:submit="add">
                    <input v-model="newInstance">
                    <button>+</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import timeline from "./components/timeline.vue"
import { store } from "./store"

export default Vue.extend({
    components: {
        timeline,
    },
    data: () => ({
        newInstance: "",
    }),
    methods: {
        add(e: any) {
            e.preventDefault(e)
            store.dispatch("addTab", this.newInstance).then(() => {
                this.newInstance = ""
            })
        }
    }
})
</script>

<style scoped>
    .columns {
        display: flex;
    }
    .columns > * {
        flex: 1;
        max-height: 100%;
        overflow-y: auto;
    }
</style>