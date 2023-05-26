import { Component, createEffect, createSignal } from "solid-js";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import { submit, form, setForm } from "../components/forms/ConnectForm";
import Box from "../components/layouts/Box";
import InputCustom from "../components/generals/InputCustom";
import { useNavigate } from "@solidjs/router";
import { setConnected } from "../components/Header";

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
            <Flex jc="space-evenly" ai="center" w="915px" h="661px" br="50px" m="2vh" bgc="#3E3E3E" opt="90%" p="1em 3em" c="white" direction="column" ff="Roboto">
                <h1>Connexion</h1>
                <form onSubmit={ handle_submit }>
                    <Flex direction="row">
                        <span id="form-invalid-identifiers"></span>
                        <Flex direction="column" jc="space-evenly" ai="center">
                            <Flex direction="column" m="0 0 50px 0" ff="Roboto">
                                <InputCustom ff="Roboto" id="email" type="email" placeholder="E-mail" update={setForm}/>
                            </Flex>
                            <Flex direction="column" m="0 0 100px 0" ff="Roboto">
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