import { Component, createEffect, createSignal } from "solid-js";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import { submit, form, update_form_field, setForm } from "../components/RegisterForm";
import Box from "../components/layouts/Box";

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
        }
        (document.getElementById("form-not-same-password-message") as HTMLInputElement).innerText = "Erreur: Les deux mots de passes ne sont pas identiques"; 
    }
    
    return (

        <Flex ac="center" jc="center" bg="#111111 no-repeat right/calc(100vh - 240px) url('src/assets/code.jpg')" h="calc(100vh - 240px)" direction="row">
            <Box w="50vw" br="50px" m="2vh" bgc="#3E3E3E" opt="90%" p="1em 3em" c="white">
            <h3>Inscription</h3>
                <form onSubmit={ handle_submit }>
                    <Flex direction="row">
                    <Flex direction="column" w="30em" mr="3em">
                        <Flex direction="column" m="0 0 15px 0">

                            <label for="name">Nom <span class="red">*</span></label>
                            <input
                            type="text"
                            id="name"
                            width="auto"
                            onChange={update_form_field("name")}
                            required
                            />

                        </Flex>
                        <Flex direction="column" m="0 0 15px 0">
                            <label for="mail">Email <span class="red">*</span></label>
                            <input
                                type="email"
                                id="email"
                                width="auto"
                                onChange={update_form_field("email")}
                                required
                            />
                        </Flex>
                        <Flex direction="column" m="0 0 15px 0">
                            <label for="telephone_number">Numéro de téléphone <span class="red">*</span></label>
                            <input
                            type="text"
                            id="telephone_number"
                            width="auto"
                            onChange={update_form_field("telephone_number")}
                            required
                            />
                        </Flex>





                        <Flex direction="column" m="0 0 15px 0">
                            <label for="password_1">Mot de passe <span class="red">*</span></label>
                            <input
                            type="password"
                            id="password_1"
                            width="auto"
                            onChange={update_form_field("password")}
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
                        <Flex direction="column" m="0 0 15px 0">
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
                        <Flex direction="column" m="0 0 15px 0">
                            <label for="school">École <span class="red">*</span></label>
                            <input
                                type="text"
                                id="school"
                                width="auto"
                                onChange={update_form_field("school")}
                                required
                            />
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
                        <ButtonCustom class="form-submit" type="submit" value="submit" m="0 0 20px 0" text="Validation"></ButtonCustom>
                    </Flex>
                    </Flex>

            </form>
            </Box>
        </Flex>

    )
}

export default Register