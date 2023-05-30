import {Component, Show, onMount} from "solid-js"
import Flex from "../components/layouts/Flex"
import ButtonCustom from "../components/generals/ButtonCustom"
import { useNavigate, useParams } from "@solidjs/router"
import { getSessionUser, isAdmin, isConnected } from "../components/Session"
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

export const CaptainGuard = () => {
    const nav = useNavigate()
    if (!isConnected()) nav("/guard-auth")
    let user = getSessionUser()
    const params = useParams();
    let questionnaire_id = params.questionnaire_id

    onMount(async () => {
        const res_questionnaire = await fetch(`http://localhost:8080/api/questionnaire/${questionnaire_id}`, {
            method: "GET",
        });
    
        let status = await res_questionnaire.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get the team! Status:" + status)
            return
        }
        let res_q = await res_questionnaire.json()
    
        const res_team = await fetch(`http://localhost:8080/api/team/${user?.user_id}`, {
            method: "GET",
        });
    
        status = await res_team.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get the team! Status:" + status)
            return
        }
        let res_t = await res_team.json()

        console.log(res_q);
        console.log(res_t);
    
        if (res_q.data_project_id != res_t[0].data_project_id || res_t[0].user_captain_id != user?.user_id)
            nav("/guard-captain", {replace: true})
    })

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