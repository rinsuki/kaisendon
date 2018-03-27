<template>
    <div class="column">
        <div class="header">
            <i :class="['fa', 'fa-'+icon]" v-if="icon"/>
            <div class="header-main">
                <div class="title" :title="title">{{ title }}</div>
                <div class="instance" :title="account">{{ account }}</div>
            </div>
            <button v-bind:class="{active: settingsOpen}" v-on:click="settingsOpen = !settingsOpen">
                <i class="fa fa-cog" />
            </button>
        </div>
        <div class="settings" v-show="settingsOpen">
            <slot name="settings"/>
            <button class="text-button" v-if="uuid" v-on:click="$store.dispatch('removeColumn', uuid)"><i class="fa fa-times"/> このカラムを消す</button>
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
        },
        uuid: {
            type: String
        },
    },
    data: () => ({
        settingsOpen: false
    })
})
</script>

<style lang="stylus" scoped>
.column
    display flex
    flex-flow column
    background #eee
    margin 0.5em

    .header
        background #ddd
        display flex
        height 3em
        align-items center
        &:first-child
            padding-left 1em
        > *:not(:last-child)
            padding-right 0.5em
        > .fa
            font-size 150%
            padding-right 0.5em
        .header-main
            flex 1
            display flex
            flex-flow column
            overflow hidden
            > *
                overflow hidden
                white-space nowrap
                text-overflow ellipsis
        .instance
            font-size 75%
        button 
            width 3rem
            height 3rem
            font-size 1.25rem
            background transparent
            border none 
            :focus
                outline none
            &.active
                background #ccc
    .main
        flex 1
        overflow-y auto
    .settings
        padding: 0.5em
        background: #ccc
        
</style>