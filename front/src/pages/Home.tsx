import { Component } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./Home.css"
import ButtonCustom from "../components/generals/ButtonCustom";

const Home: Component = () => {
    return (
        <Box w="100%" m="0" p="0" ovy="hidden">
            <img src="src/img/fond.jpg" alt="background" class="background"/>
            <h1 class="text">
                <span>Welcome to MAGGLE</span>
            </h1>
            <Flex direction="row">
                <Flex direction="column" mt="2%" ml="15%">
                    <a href="/connexion"><ButtonCustom text="SIGN-IN" ff="Roboto black" fsz="16px" w="183px" h="48px" br="16px" bgc="#3BCFA3" ></ButtonCustom></a>
                    <a href="/register"><ButtonCustom text="SIGN-UP" ff="Roboto black" fsz="16px" w="183px" h="48px" br="16px" bgc="#3BCFA3"></ButtonCustom></a>
                </Flex>
                <Box c="#FFFFFF" w="37%" ml="30%" mt="2%" fsz="19px" ff="Roboto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu ac tortor dignissim convallis aenean et. 
                    Enim lobortis scelerisque fermentum dui faucibus in ornare. Suspendisse in est ante in nibh mauris cursus. Sodales neque sodales ut etiam. Nibh venenatis cras sed felis eget. 
                    Senectus et netus et malesuada fames ac turpis. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant. Pharetra convallis posuere morbi leo. 
                    Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus.
                </Box>
            </Flex>
        </Box>
    )
}

export default Home