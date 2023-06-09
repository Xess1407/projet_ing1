import {Component, createEffect, createSignal} from "solid-js";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import { submit, form, setForm } from "../components/forms/ConnectForm";
import Box from "../components/layouts/Box";
import InputCustom from "../components/generals/InputCustom";
import { useNavigate } from "@solidjs/router";
import { setConnected } from "../components/Header";
import { isConnected } from "../components/Session";

const [stat, setStat] = createSignal(true)


const Connect: Component = () => {
    const nav = useNavigate()
    
    const handle_submit = async (event: Event) => {
        event.preventDefault();
        setStat(await submit(form))
        if (stat()) {
            setConnected(true)
            nav("/redirect", {replace: true})
        }
    }

    createEffect(() => {
        if (stat())
            (document.getElementById("form-invalid-identifiers") as HTMLInputElement).innerHTML = "";
        else 
            (document.getElementById("form-invalid-identifiers") as HTMLInputElement).innerHTML = "Wrong identifiers";
    })

    return (
        <Flex jc="center" ai="center" pos="absolute" bg="#111111 no-repeat right/calc(100vh - 142px) url('src/assets/code.jpg')" w="100%" h="calc(100vh - 140px)" m="0" p="0">
            <Flex jc="space-evenly" ai="center" w="35%" h="70%" br="50px" m="2vh" bgc="#3E3E3E" opt="90%" p="1em 3em" c="white" direction="column" ff="Roboto">
                <h1>Connexion</h1>
                <span id="form-invalid-identifiers"></span>
                <form onSubmit={ handle_submit }>
                    <Flex direction="row">
                        <Flex direction="column" jc="space-evenly" ai="center" w="100%">
                            <Flex direction="column" mb="15%" ff="Roboto" jc="center" ai="center">
                                <InputCustom ff="Roboto" id="email" type="email" placeholder="E-mail" update={setForm}/>
                            </Flex>
                            <Flex direction="column" mb="15%" ff="Roboto">
                                <InputCustom ff="Roboto" id="password" type="password" placeholder="Password" update={setForm}/>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex jc="center" ai="center" ff="Roboto">
                        <ButtonCustom bgc="#11A9A2" ff="Roboto" w="23.3em" h="4.4em" class="form-submit" type="submit" value="submit" text="Validation" />
                    </Flex>
                </form>
            </Flex>
        </Flex>
    )
}

export default Connect


export const GuardAlreadyConnect = () => {
    const nav = useNavigate()
    if (isConnected()) 
        nav("/guard-connected")
    return <div></div>
}

export const AlreadyConnect = () => {
    const nav = useNavigate()
    return (
        <Box w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden">
            <img src="/src/img/fond.jpg" alt="background" class="background"/>
            <Flex jc="center" ai="center">
                <h1 class="text" style="margin: 8% 0 4% 0" >
                    <span>You are already connected</span>
                </h1>
            </Flex>
            <Flex direction="row" jc="center" ai="center">
                <Flex direction="column">
                    <ButtonCustom text="GET BACK HOME" ff="Roboto black" fsz="16px" w="183px" h="48px" br="16px" bgc="#3BCFA3" mb="10%" onclick={() => {nav("/", {replace:true})}}/>
                </Flex>
            </Flex>
        </Box>
        )
}