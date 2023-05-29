import { Component, Show } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Home.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import { isConnected } from "../components/Session";
import { useNavigate } from "@solidjs/router";

const Error404: Component = () => {
    const nav = useNavigate()


    return (
        <Box w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden">
            <img src="/src/img/fond.jpg" alt="background" class="background"/>
            <Flex jc="center" ai="center">
                <h1 class="text" style="margin: 8% 0 0 0">
                    <span>404 Not Found</span>
                </h1>
            </Flex>
            <Flex direction="row" jc="center" ai="center">

                <Flex direction="column" ta="center">
                    <p style="color: #FFFFFF;font-size: 40px;font-family: 'abel';">Are you lost?</p>
                    <ButtonCustom text="GET BACK HOME" ff="Roboto black" fsz="16px" w="183px" h="48px" br="16px" bgc="#3BCFA3" mb="10%" onclick={() => {nav("/", {replace:true})}}/>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Error404