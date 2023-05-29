import { Component } from "solid-js";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import { Navigate, Outlet, useNavigate } from "@solidjs/router";


const Dashboard: Component = () => {
    const nav = useNavigate()
    return (
        <Flex bgc="#000000" w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden" direction="row" jc="space-evenly">
            <Flex direction="column" bgc="#555555" br="10px" w="18%" h="60%" jc="space-evenly" ai="center" c="#FFFFFF" ff="Roboto">
                <h2>Dashboard</h2>
                <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" br="10px">
                    <img class="icons" src="../src/img/analytics.png" alt="icon" />
                    <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Analytics"/>
                </Flex>
                <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
                    <img class="icons" src="../src/img/user.png" alt="icon" />
                    <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Users" onclick={() => nav("/dashboard/", {replace:true})}/>
                </Flex>
                <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" br="10px">
                    <img class="icons" src="../src/img/team.png" alt="icon" />
                    <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Teams" onclick={() => nav("/dashboard/rank", {replace:true})}/>
                </Flex>
                <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" br="10px">
                    <img class="icons" src="../src/img/challenge.png" alt="icon" />
                    <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Data Challenges" onclick={() => nav("/dashboard/challenge", {replace:true})}/>
                </Flex>
            </Flex>
            <Outlet/>
        </Flex>
    )
}

export default Dashboard