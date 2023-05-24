import { Component, createEffect, createSignal } from "solid-js";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import { submit, form, setForm } from "../components/forms/ConnectForm";
import Box from "../components/layouts/Box";
import InputCustom from "../components/generals/InputCustom";

const [stat, setStat] = createSignal(true)


const Connect: Component = () => {
    const handle_submit = async (event: Event) => {
        event.preventDefault();
        setStat(await submit(form))
    }

    createEffect(() => {
        if (stat())
            (document.getElementById("form-invalid-identifiers") as HTMLInputElement).innerHTML = "";
        else 
            (document.getElementById("form-invalid-identifiers") as HTMLInputElement).innerHTML = "Wrong identifiers";
    })

    return (
        <Flex ac="center" jc="center" bg="#111111 no-repeat right/calc(100vh - 142px) url('src/assets/code.jpg')" h="calc(100vh - 142px)" direction="row">
            <Box w="915px" h="661px" br="50px" m="2vh" bgc="#3E3E3E" opt="90%" p="1em 3em" c="white">
                <h2>Connexion</h2>
                <form onSubmit={ handle_submit }>
                    <Flex direction="row">
                        <span id="form-invalid-identifiers"></span>
                        <Flex direction="column" w="30em" mr="3em">
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="email" label="E-mail" type="email" placeholder="E-mail" update={setForm} />
                            </Flex>
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="password" label="Password" type="password" placeholder="Password" update={setForm}/>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex jc="center" ai="center">
                        <ButtonCustom class="form-submit" type="submit" value="submit" m="20px 0" w="12em" text="Validation" />
                    </Flex>
                </form>
            </Box>
        </Flex>
    )
}

export default Connect