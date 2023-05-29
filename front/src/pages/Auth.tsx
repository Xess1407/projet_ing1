import {Component, Show} from "solid-js"
import Flex from "../components/layouts/Flex"
import ButtonCustom from "../components/generals/ButtonCustom"
import { useNavigate } from "@solidjs/router"
import { isAdmin, isConnected } from "../components/Session"
import Box from "../components/layouts/Box";

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
    <Box w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden">
        <img src="/src/img/fond.jpg" alt="background" class="background"/>
        <Flex jc="center" ai="center">
        <h1 class="text" style="margin: 8% 0 5% 0">
            <span>You must be login to access this page</span>
        </h1>
        </Flex>
        <Flex direction="row" jc="center" ai="center">
            <Flex direction="column">
                <Show when={!isConnected()}>
                    <ButtonCustom text="SIGN-IN" ff="Roboto black" fsz="16px" w="183px" h="48px" br="16px" bgc="#3BCFA3" mb="10%" onclick={() => {nav("/connect", {replace: true})}}/>
                    <ButtonCustom text="SIGN-UP" ff="Roboto black" fsz="16px" w="183px" h="48px" br="16px" bgc="#3BCFA3" mb="10%" onclick={() => {nav("/register", {replace: true})}}/>
                    <ButtonCustom text="GET BACK HOME" ff="Roboto black" fsz="16px" w="183px" h="48px" br="16px" bgc="#3BCFA3" mb="10%" onclick={() => {nav("/", {replace:true})}}/>
                </Show>
            </Flex>
        </Flex>
    </Box>
    )
}

export const AdminAuth: Component = () => {
    const nav = useNavigate()
    return (
    <Box w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden">
        <img src="/src/img/fond.jpg" alt="background" class="background"/>
        <Flex jc="center" ai="center">
            <h1 class="text" style="margin: 8% 0 5% 0;font-size: 85px" >
                <span>You must be an administrator to access this page</span>
            </h1>
        </Flex>
        <Flex direction="row" jc="center" ai="center">
            <Flex direction="column">
                <Show when={!isConnected()}>
                    <ButtonCustom text="GET BACK HOME" ff="Roboto black" fsz="16px" w="183px" h="48px" br="16px" bgc="#3BCFA3" mb="10%" onclick={() => {nav("/", {replace:true})}}/>
                </Show>
            </Flex>
        </Flex>
    </Box>
    )
}