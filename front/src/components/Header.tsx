import { A, NavLink } from "@solidjs/router";
import { Component } from "solid-js";
import Flex from "./layouts/Flex";
import Box from "./layouts/Box";
import { Link } from "@kobalte/core";
import { DropdownMenu } from "@kobalte/core";
import "./Header.css"

function items(s: string, link: string){
    return(
        <Link.Root class="link" href={"http://localhost:3000/" + link}>
            {s}
        </Link.Root>
    )
}

function menuD(s: string, link: string){
    return(
        <DropdownMenu.Item class="dropdown-menu__item">
            {items(s, link)}
        </DropdownMenu.Item>
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
                    <ul>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger class="dropdown-menu__trigger">
                                <span>MenuD</span>
                                <DropdownMenu.Icon class="dropdown-menu__trigger-icon">
                                    v
                                </DropdownMenu.Icon>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content class="dropdown-menu__content">
                                    {menuD("Accueil", "")}
                                    {menuD("Profil", "connect")}
                                    {menuD("Equipe", "register")}
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </ul>
                    <ul>{items("Messagerie", "contact")}</ul>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Header