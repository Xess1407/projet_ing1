import { Component, createEffect, createSignal } from "solid-js";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import { studentForm, setStudentForm, submit_student } from "../components/forms/RegisterStudentForm";
import InputCustom from "../components/generals/InputCustom";
import './css/Register.css';
import { form } from "../components/forms/ProfileForm";

const [school_level, setSchool_level] = createSignal("none");
createEffect(() => {
    setStudentForm({ school_level: school_level() });
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
            submit_student(studentForm)
            return
        }
        (document.getElementById("form-not-same-password-message") as HTMLInputElement).innerText = "Erreur: Les deux mots de passes ne sont pas identiques"; 
    }
    
    return (

        <Flex ai="center" jc="space-evenly" w="100%" bg="#111111 no-repeat right/calc(100vh - 140px) url('src/assets/code.jpg')" h="calc(100vh - 140px)" direction="row">
            <Flex direction="column" jc="space-evenly" ai="center" w="50%" h="85%" br="50px" bgc="#3E3E3E" opt="90%" c="white">
                <h3 id="signup-title">Sign up</h3>
                <form onSubmit={ handle_submit }>
                    <Flex direction="row" jc="space-between" ai="center" w="100%" h="80%">
                        <Flex direction="column" w="45%">
                            <Flex direction="column">
                                <InputCustom id="name" label="First name" type="text" placeholder="First name" update={setStudentForm}/>
                            </Flex>
                            <Flex direction="column">
                                <InputCustom id="email" label="E-mail" type="email" placeholder="E-mail" update={setStudentForm}/>
                            </Flex>
                            <Flex direction="column">
                                <InputCustom id="telephone_number" label="Phone number" type="tel" placeholder="Phone number" update={setStudentForm} pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"></InputCustom>
                            </Flex>
                            <Flex direction="column">
                                <InputCustom id="password" label="Password" type="password" placeholder="Password" update={setStudentForm}/>
                            </Flex>
                        </Flex>
                        <Flex direction="column" w="45%">
                            <Flex direction="column" >
                                <InputCustom id="family_name" label="Surname" type="text" placeholder="Surname" update={setStudentForm}/>
                            </Flex>
                            <Flex direction="row" jc="space-evenly" ai="center">
                                <Flex direction="column" w="40%">
                                    <select id="school_level" required>
                                        <option id="default-select" value="" disabled selected hidden>Study level</option>
                                        <option value="L1">Licence 1</option>
                                        <option value="L2">Licence 2</option>
                                        <option value="L3">Licence 3</option>
                                        <option value="M1">Master 1</option>
                                        <option value="M2">Master 2</option>
                                        <option value="D">Doctorate</option>
                                    </select>
                                    <label for="school_level" class="school_level_label">Level</label>
                                </Flex>
                                <Flex direction="column" w="57%">
                                    <input id="school2" type="text" placeholder="Etablishment"  value={form.school}/>
                                </Flex>
                            </Flex>
                            <Flex direction="column">
                                <input id="city2" placeholder="City" value={form.city} />
                            </Flex>
                            <Flex direction="column" mt="9%">
                                <InputCustom id="password_2" label="Confirmation" type="text" placeholder="Confirmation" empty/>
                            </Flex>
                            <span id="form-not-same-password-message"></span>
                        </Flex>
                    </Flex>
                    <Flex jc="center" ai="center">
                        <ButtonCustom class="form-submit" type="submit" value="submit" h="71px" w="373px" mt="3%" ff="Roboto" text="Validation" />
                    </Flex>
                </form>
            </Flex>
        </Flex>

    )
}

export default Register