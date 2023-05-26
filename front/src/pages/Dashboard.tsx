import { Component, createEffect, createSignal } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import { submit, form, setForm } from "../components/forms/RegisterForm";
import InputCustom from "../components/generals/InputCustom";

const [stat, setStat] = createSignal(true)

const Dashboard: Component = () => {
    const handle_submit = (event: Event): void => {
        event.preventDefault();
        if (stat()) {
            (document.getElementById("form-not-same-password-message") as HTMLInputElement).innerHTML = "";
            submit(form)
            return
        }
        (document.getElementById("form-not-same-password-message") as HTMLInputElement).innerText = "Erreur: Les deux mots de passes ne sont pas identiques"; 
    }
    return (
        <Flex bgc="#000000" w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden" direction="row" jc="space-evenly">
            <Flex direction="column" bgc="#555555" br="10px" w="18%" h="60%" jc="space-evenly" ai="center" c="#FFFFFF" ff="Roboto">
                <h2>Dashboard</h2>
                <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
                    <img class="icons" src="src/img/analytics.png" alt="icon" />
                    <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Analytics"/>
                </Flex>
                <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
                    <img class="icons" src="src/img/user.png" alt="icon" />
                    <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Users"/>
                </Flex>
                <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
                    <img class="icons" src="src/img/team.png" alt="icon" />
                    <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Teams"/>
                </Flex>
                <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
                    <img class="icons" src="src/img/challenge.png" alt="icon" />
                    <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Data Challenges"/>
                </Flex>
            </Flex>
            <Flex bgc="#444444" br="10px" w="30%" h="80%" direction="column">
                <Flex w="100%" h="50%" direction="">
                    <Flex directon="column" w="50%" jc="space-evenly" ai="center">
                        <Box w="60%" h="60%" bgc="#222222" br="10px" c="#FFFFFF" ta="center">
                            <h3>Total students</h3>
                            <p>6527</p>
                        </Box>
                    </Flex>
                    <Flex w="50%" direction="column" jc="space-evenly" ai="center">
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Student"/>
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Student"/>
                    </Flex>
                </Flex>
                <Flex w="100%" h="50%">
                    <Flex directon="column" w="50%" jc="space-evenly" ai="center">
                        <Box w="60%" h="60%" bgc="#222222" br="10px" c="#FFFFFF" ta="center">
                            <h3>Total Managers</h3>
                            <p>6527</p>
                        </Box>
                    </Flex>
                    <Flex w="50%" direction="column" jc="space-evenly" ai="center">
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Manager"/>
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Manager"/>
                    </Flex>
                </Flex>
            </Flex>
            <Flex bgc="#444444" br="10px" w="40%" h="80%">
                <form onSubmit={ handle_submit }>
                    <Flex direction="row" jc="space-around" ai="center" w="100%" h="70%" mt="5%">
                        <Flex direction="column" w="40%" jc="space-around" ai="center">
                            <Flex direction="column" m="0 0 30px 0">
                                <InputCustom id="family-name" label="Surname" type="text" placeholder="Surname" update={setForm}/>
                            </Flex>
                            <Flex direction="column" m="0 0 30px 0">
                                <InputCustom id="email" label="E-mail" type="email" placeholder="E-mail" pattern=".+@[a-z]{2,32}\.[a-z]{2,10}" update={setForm}/>
                            </Flex>
                            <Flex direction="column" m="0 0 30px 0">
                                <InputCustom id="telephone_number" label="Number" type="tel" placeholder="Number" update={setForm} pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"></InputCustom>
                            </Flex>
                        </Flex>
                        <Flex direction="column" w="40%" jc="space-around">
                            <Flex direction="column" m="0 0 30px 0">
                                <InputCustom id="firstname" label="Firstname" type="text" placeholder="Firstname" update={setForm}/>
                            </Flex>
                            <Flex direction="row">
                                <Flex direction="column" m="0 2.9em 15px 0">
                                    <label for="school_level">Study Level<span class="red"></span></label>
                                </Flex>
                                <Flex direction="column" m="0 0 30px 0" w="17em">
                                    <InputCustom id="school" label="Etablishment" type="text" placeholder="Etablishement" update={setForm}/>
                                </Flex>
                            </Flex>
                            <Flex direction="column" m="0 0 30px 0">
                                <InputCustom id="city" label="City" type="text" placeholder="City" update={setForm}/>
                                
                            </Flex>
                            <span id="form-not-same-password-message"></span>
                        </Flex>
                    </Flex>
                    <Flex jc="center" ai="center">
                        <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="ADD" />
                    </Flex>
                </form>
            </Flex>
        </Flex>
    )
}

export default Dashboard