import { Component, createSignal, Show } from "solid-js";
import Flex from "./layouts/Flex";
import Box from "./layouts/Box";
import linkItems from "./linkItems";
import "./css/Header.css"


const Header: Component = () => {
    const [boxData, setBoxData] = createSignal(false)
    return (
        <Box b="1px solid" bgc="black" opt="90%" h="140px">
            <Flex jc="center" h="100%" ai="center" td="none" ff="Roboto">
                    <img src="src/img/logo.png" alt="logo" height="100px"/>
                    <ul>{linkItems("Accueil" ,"")}</ul>
                    <ul>{linkItems("Profil", "connect")}</ul>
                    <ul>{linkItems("Equipe", "register")}</ul>
                    <Flex ff="Roboto" direction="column" >
                        <ul class="data-challenge">{linkItems("Data Challenges", "")}</ul>
                        <Show when={boxData()}>
                            <ul class="data-project">{linkItems("Data Projects", "")}</ul>
                        </Show>
                    </Flex>
                    <ul><img class="down" src="src/img/down.png" alt="down" onClick={() => {setBoxData(!boxData())}}/></ul>
                    <ul>{linkItems("Messagerie", "contact")}</ul>
            </Flex>
        </Box>
    )
}

export default Header