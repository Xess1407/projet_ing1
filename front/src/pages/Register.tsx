import { Component, createEffect, createSignal } from "solid-js";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import { submit, form, setForm } from "../components/forms/RegisterForm";
import Box from "../components/layouts/Box";
import InputCustom from "../components/generals/InputCustom";

const [school_level, setSchool_level] = createSignal("none");
createEffect(() => {
    setForm({ school_level: school_level() });
});

function handle_same_password() {
    let password_1 = (document.getElementById("password") as HTMLInputElement).value;
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

        <Flex ai="center" jc="center" bg="#111111 no-repeat right/calc(100vh - 142px) url('src/assets/code.jpg')" h="calc(100vh - 142px)" direction="row">
            <Flex direction="column" jc="center" ai="center" w="1063px" h="799px" br="50px" m="2vh" bgc="#3E3E3E" opt="90%" c="white">
                <h3>Inscription</h3>
                <form onSubmit={ handle_submit }>
                    <Flex direction="row" jc="space-between" ai="center" w="100%" h="80%">
                        <Flex direction="column" w="45%">
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="name" label="Nom" type="text" placeholder="Nom" update={setForm}/>
                            </Flex>
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="email" label="E-mail" type="email" placeholder="E-mail" pattern=".+@[a-z]{2,32}\.[a-z]{2,10}" update={setForm}/>
                            </Flex>
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="telephone_number" label="Téléphone" type="tel" placeholder="Téléphone" update={setForm} pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"></InputCustom>
                            </Flex>
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="password" label="Mot de passe" type="password" placeholder="Mot de passe" update={setForm}/>
                            </Flex>

                        </Flex>
                        <Flex direction="column" w="45%">
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="family_name" label="Nom de famille" type="text" placeholder="Nom de famille" update={setForm}/>
                            </Flex>
                            <Flex direction="row">
                                <Flex direction="column" m="0 2.9em 15px 0">
                                    <label for="school_level">Niveau d'étude <span class="red">*</span></label>
                                </Flex>
                                <Flex direction="column" m="0 0 15px 0" w="17em">
                                    <InputCustom id="school" label="Ecole" type="text" placeholder="Ecole" update={setForm}/>
                                </Flex>
                            </Flex>
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="city" label="Ville" type="text" placeholder="Ville" update={setForm}/>
                                
                            </Flex>
                            <Flex direction="column" m="0 0 15px 0">
                                <InputCustom id="password_2" label="Confirmer mot de passe" type="text" placeholder="Mot de passe" empty/>
                            </Flex>
                            <span id="form-not-same-password-message"></span>
                        </Flex>
                    </Flex>
                    <Flex jc="center" ai="center">
                        <ButtonCustom class="form-submit" type="submit" value="submit" m="20px 0" h="71px" w="373px"  text="Validation" />
                    </Flex>
                </form>
            </Flex>
        </Flex>

    )
}

export default Register