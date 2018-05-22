<template>
    <div>
        <p>{{ state }}</p>
        <a href="/client.html" v-if="showBackLink">海鮮丼に戻る</a>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Client, UserToken } from '../store'

const loc = new URL(location.href)

export default Vue.extend({
    data() {
        return {
            state: "アクセストークンを取得しています...",
            showBackLink: false,
            clientId: loc.searchParams.get("state"),
            code: loc.searchParams.get("code"),
        }
    },
    computed: {
        client(): Client | null {
            return this.clientId && this.$store.state.clients[this.clientId]
        }
    },
    async mounted() {
        const {
            client,
            code,
        } = this
        if (!client) {
            this.state = "クライアント情報が見つかりませんでした。"
            this.showBackLink = true
            return
        }
        if (!code) {
            this.state = "許可してくれ"
            this.showBackLink = true
            return
        }
        const body = Object.entries({
            client_id: client.clientId,
            client_secret: client.clientSecret,
            grant_type: "authorization_code",
            code,
            redirect_uri: location.origin+location.pathname,
            state: client.id
        }).reduce((old, current) => {
            return [...old,
                current[0]+"="+encodeURIComponent(current[1])
            ]
        }, [] as string[]).join("&")
        const req = await fetch("https://"+client.instance+"/oauth/token", {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
        if (!req.ok) {
            this.state = "HTTPエラー "+req.status+" です。リトライしてみてください"
            this.showBackLink = true
            return
        }
        const tokenInfo = await req.json()
        const accessToken = tokenInfo.access_token
        console.log(tokenInfo)
        const infoReq = await fetch("https://"+client.instance+"/api/v1/accounts/verify_credentials", {
            headers: {
                "Authorization": "Bearer "+accessToken,
            }
        })
        if (!infoReq.ok) {
            this.state = "情報取得時にHTTPエラー "+infoReq.status +"です。リトライしてみてください"
            this.showBackLink = true
            return
        }
        const userInfo = await infoReq.json()
        this.$store.commit("registerToken", {
            accessToken,

            userId: userInfo.id,
            name: userInfo.display_name == "" ? userInfo.username : userInfo.display_name,
            screenName: userInfo.username,
            hostName: client.instance,
            avatarUrl: userInfo.avatar,
            avatarStaticUrl: userInfo.avatar_static
        } as UserToken)
        this.state = "登録できました。"
        this.showBackLink = true
    }
})
</script>
