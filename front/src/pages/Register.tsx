import { Component, createEffect, createSignal } from "solid-js";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import { submit, form, update_form_field, setForm } from "../components/RegisterForm";
import Box from "../components/layouts/Box";
import InputCustom from "../components/generals/InputCustom";

const [school_level, setSchool_level] = createSignal("none");
createEffect(() => {
    setForm({ school_level: school_level() });
});

function handle_same_password() {
    let password_1 = (document.getElementById("password_1") as HTMLInputElement).value;
    let password_2 = (document.getElementById("password_2") as HTMLInputElement).value;
    return password_1 == password_2;
}

const Register: Component = () => {
    const handle_submit = (event: Event): void => {
        event.preventDefault();
        if (handle_same_password()) {
            (document.getElementById("form-not-same-password-message") as HTMLInputElement).innerHTML = "";
            submit(form)
            return
        }
        (document.getElementById("form-not-same-password-message") as HTMLInputElement).innerText = "Erreur: Les deux mots de passes ne sont pas identiques"; 
    }
    
    return (

        <Flex ac="center" jc="center" bg="#111111 no-repeat right/calc(100vh - 142px) url('src/assets/code.jpg')" h="calc(100vh - 142px)" direction="row">
            <Box w="50vw" br="50px" m="2vh" bgc="#3E3E3E" opt="90%" p="1em 3em" c="white">
                <h3>Inscription</h3>
                <form onSubmit={ handle_submit }>
                    <Flex direction="row">
                        <Flex direction="column" w="30em" mr="3em">
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="name" label="Nom" type="text" placeholder="Nom"></InputCustom>
                            </Flex>
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="email" label="E-mail" type="email" placeholder="E-mail" pattern=".+@[a-z]{2,32}\.[a-z]{2,10}"></InputCustom>
                            </Flex>
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="telephone_number" label="Téléphone" type="tel" placeholder="Téléphone" pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"></InputCustom>
                            </Flex>





                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="password_1" label="Mot de passe" type="password" placeholder="Mot de passe"></InputCustom>
                            </Flex>

                        </Flex>
                        <Flex direction="column" w="30em">
                            <Flex direction="column" m="0 0 15px 0">
                                <label for="family_name">Prénom <span class="red">*</span></label>
                                <input
                                    type="text"
                                    id="surname"
                                    width="auto"
                                    onChange={update_form_field("family_name")}
                                    required
                                />
                            </Flex>
                            <Flex direction="row">
                                <Flex direction="column" m="0 2.9em 15px 0">
                                    <label for="school_level">Niveau d'étude <span class="red">*</span></label>
                                    <select id="school_level" onChange={update_form_field("school_level")} required>
                                        <option value="L1">Licence 1</option>
                                        <option value="L2">Licence 2</option>
                                        <option value="L3">Licence 3</option>
                                        <option value="M1">Master 1</option>
                                        <option value="M2">Master 2</option>
                                        <option value="D">Doctorat</option>
                                    </select>
                                </Flex>
                                <Flex direction="column" m="0 0 15px 0" w="17em">
                                    <label for="school">École <span class="red">*</span></label>
                                    <input
                                        type="text"
                                        id="school"
                                        width="auto"
                                        onChange={update_form_field("school")}
                                        required
                                    />
                                </Flex>
                            </Flex>
                            <Flex direction="column" m="0 0 15px 0">
                                <label for="city">Ville <span class="red">*</span></label>
                                <input
                                    type="text"
                                    id="city"
                                    width="auto"
                                    onChange={update_form_field("city")}
                                    required
                                />
                            </Flex>
                            <Flex direction="column" m="0 0 15px 0">
                                <label for="password_2">Confirmer le mot de passe <span class="red">*</span></label>
                                <input
                                    type="password"
                                    id="password_2"
                                    width="auto"
                                    required
                                />
                            </Flex>
                            <span id="form-not-same-password-message"></span>
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

export default Register