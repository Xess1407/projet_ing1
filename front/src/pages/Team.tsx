import { Component } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Team.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";

const Team: Component = () => {
    return (
        <Flex direction="row" w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden" bgc="#FFFFFF"> 
            <Box w="40%">
                <h1 class="text">
                    <span>Your Team</span>
                </h1>
                <Flex direction="column" ml="30%">
                    <Box ff="Roboto" fsz="18px" mb="5%">You don't have a team yet, create it !</Box>
                    <a href="/connect"><ButtonCustom text="CREATE YOUR TEAM" ff="Roboto black" fsz="16px" w="300px" h="60px" br="16px" bgc="#3BCFA3" ></ButtonCustom></a>
                </Flex>
            </Box>
            <Flex w="60%">
                <Flex w="100%" direction="column" jc="space-evenly" ai="center">
                    <h1>CREATION</h1>
                    <label>Search students</label>
                    <input type="search" class="search"/>
                    <label>Your Team</label>
                    <Box w="80%" h="60%" b="2px solid black" br="30px"></Box>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Team