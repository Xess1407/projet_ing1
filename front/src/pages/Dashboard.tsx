import { Component, Show, createEffect, createSignal } from "solid-js";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import { Navigate, Outlet, useNavigate } from "@solidjs/router";
import { getSessionUser } from "../components/Session";

const [currentPath, setCurrentPath] = createSignal("/dashboard/", {equals: false})


const getBackground = (path: string) => {
    return ("/dashboard"+path) == currentPath()
}

const DashAdmin: Component = () => {
    const nav = useNavigate()
    return <Flex direction="column" bgc="#555555" br="10px" w="18%" h="60%" jc="space-evenly" ai="center" c="#FFFFFF" ff="Roboto">
        <h2>Dashboard</h2>

<Show when={getBackground("/")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="../src/img/user.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Users" onclick={() => {setCurrentPath("/dashboard/"); nav("/dashboard/", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="../src/img/user.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Users" onclick={() => {setCurrentPath("/dashboard/"); nav("/dashboard/", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/rank")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="../src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Teams" onclick={() => {setCurrentPath("/dashboard/rank");nav("/dashboard/rank", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/rank")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="../src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Teams" onclick={() => {setCurrentPath("/dashboard/rank");nav("/dashboard/rank", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/challenge")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="../src/img/challenge.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Data Challenges" onclick={() => {setCurrentPath("/dashboard/challenge");nav("/dashboard/challenge", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/challenge")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="../src/img/challenge.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Data Challenges" onclick={() => {setCurrentPath("/dashboard/challenge");nav("/dashboard/challenge", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/project")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="../src/img/analytics.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Project" onclick={() => {setCurrentPath("/dashboard/project"); nav("/dashboard/project", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/project")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="../src/img/analytics.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Project" onclick={() => {setCurrentPath("/dashboard/project"); nav("/dashboard/project", {replace:true})}}/>
    </Flex>
</Show>
</Flex>
}

const DashManager: Component = () => {
    const nav = useNavigate()
    return <Flex direction="column" bgc="#555555" br="10px" w="18%" h="60%" jc="space-evenly" ai="center" c="#FFFFFF" ff="Roboto">
        <h2>Dashboard</h2>
    <Show when={getBackground("/analyse")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="../src/img/analytics.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Analytics" onclick={() => {setCurrentPath("/dashboard/analyse"); nav("/dashboard/analyse", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/analyse")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="../src/img/analytics.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Analytics" onclick={() => {setCurrentPath("/dashboard/analyse"); nav("/dashboard/analyse", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="../src/img/user.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Users" onclick={() => {setCurrentPath("/dashboard/"); nav("/dashboard/", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="../src/img/user.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Users" onclick={() => {setCurrentPath("/dashboard/"); nav("/dashboard/", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/rank")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="../src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Teams" onclick={() => {setCurrentPath("/dashboard/rank");nav("/dashboard/rank", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/rank")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="../src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Teams" onclick={() => {setCurrentPath("/dashboard/rank");nav("/dashboard/rank", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/challenge")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="../src/img/challenge.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Data Challenges" onclick={() => {setCurrentPath("/dashboard/challenge");nav("/dashboard/challenge", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/challenge")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="../src/img/challenge.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Data Challenges" onclick={() => {setCurrentPath("/dashboard/challenge");nav("/dashboard/challenge", {replace:true})}}/>
    </Flex>
</Show>
</Flex>
}

const Dashboard: Component = () => {
    const nav = useNavigate()
    let user = getSessionUser()

    return (
        <Flex bgc="#000000" w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden" direction="row" jc="space-evenly">
            <DashAdmin/> 
            <Outlet/>
        </Flex>
    )
}

export default Dashboard