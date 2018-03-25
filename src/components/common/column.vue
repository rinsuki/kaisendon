<template>
    <div class="column">
        <div class="header">
            <i :class="['fa', 'fa-'+icon]" v-if="icon"/>
            <div class="header-main">
                <div class="title">{{ title }}</div>
                <div class="instance">{{ account}}</div>
            </div>
        </div>
        <div class="main">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        title: {
            type: String
        },
        account: {
            type: String
        },
        icon: {
            type: String
        }
    }
})
</script>


<style scoped>
.column {
    display: flex;
    flex-flow: column;
    background: #eee;
    margin: 0.5em;
    height: calc(100vh - 1em);
}
.header {
    background: #ddd;
    display: flex;
    height: 3em;
    align-items: center;
    padding: 0 1em;
}
.fa {
    font-size: 150%;
    padding-right: 0.5em;
}
.header-main{
    flex: 1;
    display: flex;
    flex-flow: column;
}
.header .instance {
    font-size: 75%;
}
.main {
    flex: 1;
    overflow-y: auto;
}
</style>
