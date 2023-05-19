import { A, NavLink } from "@solidjs/router";
import { Component } from "solid-js";
import Flex from "./layouts/Flex";
import ButtonCustom from "./generals/ButtonCustom"

const Header: Component = () => {
    return (
        <Flex justify="center" m="100px">
            <ButtonCustom text="click"/>
        </Flex>
    )
}

export default Header