import { Component, createSignal, Show} from "solid-js";
import Flex from "./layouts/Flex";
import Box from "./layouts/Box";
import linkItems from "./linkItems";
import "./css/Header.css";

const Header: Component = () => {
    const [boxData, setBoxData] = createSignal(false);

    const handle = () => {
        setBoxData(!boxData());
        const img = document.getElementById("down")
        if (img) {
            if (boxData()) {
                img.style.transform = "rotate(180deg)"
            } else {
                img.style.transform = "rotate(0deg)"
            }
        }
    };

    return (
        <Box bgc="rgba(0, 0, 0, 0.9)" h="140px" m="0" p="0">
            <Flex jc="center" w="100%" m="0" p="0" h="100%" ai="center" td="none" ff="Roboto">
                <img src="src/img/logo.png" alt="logo" height="100px" />
                <ul>{linkItems("Accueil", "")}</ul>
                <ul>{linkItems("Profil", "connect")}</ul>
                <ul>{linkItems("Equipe", "register")}</ul>
                <Flex ff="Roboto" direction="column">
                    <ul classList={{ "data-challenge": true, active: boxData() }}>
                        {linkItems("Data Challenges", "")}
                    </ul>
                    <Show when={boxData()}>
                        <ul classList={{ "data-project": true, active: boxData()}} style={{ display: "block", position: "absolute", top: "8%" }} >
                            {linkItems("Data Projects", "")}
                        </ul>
                    </Show>
                </Flex>
                <ul>
                    <img class="down" id="down" src="src/img/down.png" alt="down" onClick={handle}/>
                </ul>
                <ul>{linkItems("Messagerie", "contact")}</ul>
            </Flex>
        </Box>
    );
};

export default Header;