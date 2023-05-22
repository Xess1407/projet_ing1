import { A, NavLink } from "@solidjs/router";
import { Component } from "solid-js";
import Flex from "./layouts/Flex";
import Box from "./layouts/Box";
import ButtonCustom from "./generals/ButtonCustom"
import { Link } from "@kobalte/core";
import "./Header.css"

function items(s: string, link: string){
    return(
        <Link.Root class="link" href={"http://localhost:3000/" + link}>
            {s}
        </Link.Root>
    )
}



const Header: Component = () => {
    return (
        <Box b="1px solid" bgc="black" opt="89%" >
            <Flex justify="center" ml="100px">
                <img src="src/logo.png" alt="logo" height="100px"/>
                <Flex ai="center" c="white" td="none">
                    <ul>{items("Accueil" ,"")}</ul>
                    <ul>{items("Profil", "connect")}</ul>
                    <ul>{items("Equipe", "register")}</ul>
                    <ul>{items("Menudéroulant", "amajfn")}</ul>
                    <ul>{items("Contact", "contact")}</ul>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Header