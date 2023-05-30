import { Component, Match, Show, createEffect, createSignal } from "solid-js";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import { Navigate, Outlet, useNavigate } from "@solidjs/router";
import { getSessionUser, isAdmin, isManager, isStudent } from "../components/Session";

const [currentPath, setCurrentPath] = createSignal("/dashboard/", {equals: false})


const getBackground = (path: string) => {
    return ("/dashboard"+path) == currentPath()
}

const DashAdmin: Component = () => {
    const nav = useNavigate()
    return <Flex direction="column" bgc="#555555" br="10px" w="18%" h="60%" jc="space-evenly" ai="center" c="#FFFFFF" ff="Roboto">
        <h2>Dashboard</h2>

<Show when={getBackground("/user")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="/src/img/user.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Users" onclick={() => {setCurrentPath("/dashboard/user/user"); nav("/dashboard/user", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/user")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/user.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Users" onclick={() => {setCurrentPath("/dashboard/user"); nav("/dashboard/user", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/rank")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="/src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Teams" onclick={() => {setCurrentPath("/dashboard/rank");nav("/dashboard/rank", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/rank")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Teams" onclick={() => {setCurrentPath("/dashboard/rank");nav("/dashboard/rank", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/challenge")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="/src/img/challenge.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Data Challenges" onclick={() => {setCurrentPath("/dashboard/challenge");nav("/dashboard/challenge", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/challenge")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/challenge.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Data Challenges" onclick={() => {setCurrentPath("/dashboard/challenge");nav("/dashboard/challenge", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/project")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="/src/img/analytics.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Project" onclick={() => {setCurrentPath("/dashboard/project"); nav("/dashboard/project", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/project")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/analytics.png" alt="icon" />
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
        <img class="icons" src="/src/img/analytics.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Analytics" onclick={() => {setCurrentPath("/dashboard/analyse"); nav("/dashboard/analyse", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/analyse")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/analytics.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Analytics" onclick={() => {setCurrentPath("/dashboard/analyse"); nav("/dashboard/analyse", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/questionnaire")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="/src/img/user.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Create questionnaire" onclick={() => {setCurrentPath("/dashboard/questionnaire"); nav("/dashboard/questionnaire", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/questionnaire")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/user.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Create questionnaire" onclick={() => {setCurrentPath("/dashboard/questionnaire"); nav("/dashboard/questionnaire", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/rank")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="/src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Teams" onclick={() => {setCurrentPath("/dashboard/rank");nav("/dashboard/rank", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/rank")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Teams" onclick={() => {setCurrentPath("/dashboard/rank");nav("/dashboard/rank", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/correction")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="/src/img/challenge.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Correction" onclick={() => {setCurrentPath("/dashboard/correction");nav("/dashboard/correction", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/correction")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/challenge.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Correction" onclick={() => {setCurrentPath("/dashboard/correction");nav("/dashboard/correction", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/contact")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="/src/img/challenge.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Contact" onclick={() => {setCurrentPath("/dashboard/contact");nav("/dashboard/contact", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/contact")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/challenge.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Contact" onclick={() => {setCurrentPath("/dashboard/contact");nav("/dashboard/contact", {replace:true})}}/>
    </Flex>
</Show>
</Flex>
}

const DashStudent: Component = () => {
    const nav = useNavigate()
    return <Flex direction="column" bgc="#555555" br="10px" w="18%" h="60%" jc="space-evenly" ai="center" c="#FFFFFF" ff="Roboto">
        <h2>Dashboard</h2>
    <Show when={getBackground("/analyse")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="/src/img/analytics.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Analytics" onclick={() => {setCurrentPath("/dashboard/analyse"); nav("/dashboard/analyse", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/analyse")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/analytics.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Analytics" onclick={() => {setCurrentPath("/dashboard/analyse"); nav("/dashboard/analyse", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/rank")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="/src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Rank" onclick={() => {setCurrentPath("/dashboard/rank");nav("/dashboard/rank", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/rank")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Rank" onclick={() => {setCurrentPath("/dashboard/rank");nav("/dashboard/rank", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/profile")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="/src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Profile" onclick={() => {setCurrentPath("/dashboard/profile");nav("/dashboard/profile", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/profile")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Profile" onclick={() => {setCurrentPath("/dashboard/profile");nav("/dashboard/profile", {replace:true})}}/>
    </Flex>
</Show>

<Show when={getBackground("/team")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
        <img class="icons" src="/src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Team" onclick={() => {setCurrentPath("/dashboard/team");nav("/dashboard/team", {replace:true})}}/>
    </Flex>
</Show>
<Show when={!getBackground("/team")}>
    <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
        <img class="icons" src="/src/img/team.png" alt="icon" />
        <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Team" onclick={() => {setCurrentPath("/dashboard/team");nav("/dashboard/team", {replace:true})}}/>
    </Flex>
</Show>

</Flex>
}



const Dashboard: Component = () => {
    return (
        <Flex bgc="#000000" w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden" direction="row" jc="space-evenly">
            <Show when={isAdmin()} ><DashAdmin/> </Show>
            <Show when={isManager()} ><DashManager/> </Show>
            <Show when={isStudent()} ><DashStudent/> </Show>
            <Outlet/>
        </Flex>
    )
}

export default Dashboard