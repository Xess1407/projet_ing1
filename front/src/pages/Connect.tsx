import { Component, createEffect, createSignal } from "solid-js";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import { submit, form, update_form_field, setForm } from "../components/ConnectForm";
import Box from "../components/layouts/Box";
import InputCustom from "../components/generals/InputCustom";

const Connect: Component = () => {
    return (
        <Flex ac="center" jc="center" bg="#111111 no-repeat right/calc(100vh - 142px) url('src/assets/code.jpg')" h="calc(100vh - 142px)" direction="row">
            <Box w="915px" h="661px" br="50px" m="2vh" bgc="#3E3E3E" opt="90%" p="1em 3em" c="white">
                <h3>Connexion</h3>
                <form>
                    <Flex direction="row">
                        <Flex direction="column" w="30em" mr="3em">
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="email" label="E-mail" type="email" placeholder="E-mail" pattern=".+@[a-z]{2,32}\.[a-z]{2,10}"></InputCustom>
                            </Flex>
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="password" label="Password" type="password" placeholder="Password"></InputCustom>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex jc="center" ai="center">
                        <ButtonCustom class="form-submit" type="submit" value="submit" m="20px 0" w="12em" text="Validation"></ButtonCustom>
                    </Flex>
                </form>
            </Box>
        </Flex>
    )
}

export default Connect