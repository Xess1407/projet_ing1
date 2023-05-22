import { A, NavLink } from "@solidjs/router";
import { Component } from "solid-js";
import Flex from "./layouts/Flex";
import Box from "./layouts/Box";
import ButtonCustom from "./generals/ButtonCustom"
import { Link } from "@kobalte/core";
import "./Header.css"

function items(s: string, link: string){
    return(
        <Link.Root href={"http://localhost:3000/" + link}>
            {s}
        </Link.Root>
    )
}



const Header: Component = () => {
    return (
        <Box b="1px solid" bgColor="white" opacity="90%" >
            <Flex justify="center" ml="100px">
                <img src="src/logo.png" alt="logo" height="100px"/>
                <Flex ai={"center"}>
                    <ul>{items("lien 1" ,"")}</ul>
                    <ul>{items("lien 2", "connect")}</ul>
                    <ul>{items("lien 3", "register")}</ul>
                    <ul>{items("lien ", "amajfhn")}</ul>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Header