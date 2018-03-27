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
            <div class="uuid" v-if="uuid">UUID: {{ uuid }}</div>
            <div class="last-button" v-if="uuid">
                <button class="text-button" v-on:click="$store.dispatch('removeColumn', uuid)"><i class="fa fa-times"/> このカラムを消す</button>
                <div class="spacer"></div>
                <button class="text-button" v-on:click="$store.commit('moveToLeftColumn', uuid)"><i class="fa fa-chevron-left" /></button>
                <button class="text-button" v-on:click="$store.commit('moveToRightColumn', uuid)"><i class="fa fa-chevron-right" /></button>
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
        .uuid
            font-size 0.75em
        .last-button
            display flex
            .spacer
                flex 1
            > *
                margin 0 0.25em
</style>