import { Component } from "solid-js";
import Flex from "./layouts/Flex";
import Box from "./layouts/Box";
import linkItems from "./linkItems";
import "./Header.css"
import dMenuInit from "./dropdownMenu";



const Header: Component = () => {
    return (
        <Box b="1px solid" bgc="black" opt="89%" >
            <Flex justify="center" ml="23%">
                <a href="http://localhost:3000"><img src="src/logo.png" alt="logo" height="100px"/></a>
                <Flex ai="center" c="white" td="none">
                    <ul>{linkItems("Accueil" ,"")}</ul>
                    <ul>{linkItems("Profil", "connect")}</ul>
                    <ul>{linkItems("Equipe", "register")}</ul>
                    <ul>
                        {dMenuInit()}
                    </ul>
                    <ul>{linkItems("Messagerie", "contact")}</ul>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Header