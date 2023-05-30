import {Component, createSignal} from "solid-js";
import Flex from "../components/layouts/Flex";
import Box from "../components/layouts/Box";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";
import {setStudentForm} from "../components/forms/RegisterStudentForm";

const [stat, setStat] = createSignal(true)
const Drop: Component = () => {
    const handle_submit_drop = (event: Event): void => {
        event.preventDefault();
        if(stat()) {
            //submit_drop()
        }
    }

    return (
        <Flex w="80%" jc="space-evenly">
            <Flex bgc="#444444" p="20px 0" br="10px" w="40%" h="50%" direction="row" jc="space-evenly" ai="center">
                <form>
                    <Flex direction="row" jc="space-around" w="100%" h="70%">
                        <Flex direction="column" w="100%" jc="space-evenly" ai="center">
                            <Flex direction="column" mt="2%" w="100%">
                                <InputCustom id="name" label="URL of the project" type="url" placeholder="URL of the project"/>
                            </Flex>
                            <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="DROP" />


                        </Flex>
                    </Flex>
                </form>
            </Flex>
        </Flex>
    )
}

export default Drop