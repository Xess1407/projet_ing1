import { A, NavLink } from "@solidjs/router";
import { Component } from "solid-js";
import Flex from "./layouts/Flex";
import ButtonCustom from "./generals/ButtonCustom"

const Header: Component = () => {
    return (
        <Flex>
            <A href="/connect">Connexion</A>
        </Flex>
    )
}

export default Header