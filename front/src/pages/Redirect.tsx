import { Component } from "solid-js";
import Flex from "../components/layouts/Flex";
import { useNavigate } from "@solidjs/router";

const Redirect: Component = () => {
    const nav = useNavigate()
    nav("/", {replace: true})
    return <Flex jc="center">Redirect...</Flex>
}

export default Redirect