import { Component } from "solid-js";
import Flex from "./layouts/Flex";
import Box from "./layouts/Box";
import linkItems from "./linkItems";
import "./css/Header.css"


const Header: Component = () => {
    return (
        <Box b="1px solid" bgc="black" opt="90%" h="140px">
            <Flex jc="center" h="100%" ai="center" c="#FFFFFF" td="none" ff="Roboto">
                    <img src="src/img/logo.png" alt="logo" height="100px"/>
                    <ul>{linkItems("Accueil" ,"")}</ul>
                    <ul>{linkItems("Profil", "connect")}</ul>
                    <ul>{linkItems("Equipe", "register")}</ul>
                    <ul>{linkItems("Data Challenges", "register")}</ul>
                    <ul>{linkItems("Messagerie", "contact")}</ul>
            </Flex>
        </Box>
    )
}

export default Header