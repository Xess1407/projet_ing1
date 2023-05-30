import {Component, createSignal} from "solid-js";
import Flex from "../components/layouts/Flex";
import Box from "../components/layouts/Box";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";
import {setStudentForm, studentForm, submit_student} from "../components/forms/RegisterStudentForm";
import {dropForm, setDropForm, submit_drop} from "../components/forms/DropForm";

const [stat, setStat] = createSignal(true)
const Drop: Component = () => {

    const handle_submit_drop = async (event: Event): Promise<void> => {
        event.preventDefault();
        await submit_drop(dropForm)
    }

    return (
        <Flex w="80%" jc="space-evenly">
            <Flex bgc="#444444" p="20px 0" br="10px" w="40%" h="50%" direction="row" jc="space-evenly" ai="center">
                <form onSubmit={handle_submit_drop}>
                    <Flex direction="row" jc="space-around" w="100%" h="70%">
                        <Flex direction="column" w="100%" jc="space-evenly" ai="center">
                            <Flex direction="column" mt="2%" w="100%">
                            <InputCustom id="file_url" label="URL of the project" type="url" placeholder="URL of the project" update={setDropForm}/>
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