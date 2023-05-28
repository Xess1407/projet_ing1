import { Component } from "solid-js"
import Flex from "../components/layouts/Flex"
import ButtonCustom from "../components/generals/ButtonCustom"
import { useNavigate } from "@solidjs/router"
import { isAdmin, isConnected } from "../components/Session"

export const Guard = () => {
    const nav = useNavigate()
    if (!isConnected()) 
        nav("/guard-auth")
    return <div></div>
}

export const AdminGuard = () => {
    const nav = useNavigate()
    if (!isAdmin()) 
        nav("/guard-auth-admin")
    return <div></div>
}

export const Auth: Component = () => {
    const nav = useNavigate()
    return (
    <Flex jc="center">
        <p>You must be login to access this page</p>
        <button onclick={() => {nav("/", {replace:true})}}>Get back home</button>
    </Flex>
    )
}

export const AdminAuth: Component = () => {
    const nav = useNavigate()
    return (
    <Flex jc="center">
        <p>You must be an administrator to access this page</p>
        <button onclick={() => {nav("/", {replace:true})}}>Get back home</button>
    </Flex>
    )
}