import { Component } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import ButtonCustom from "../components/generals/ButtonCustom";

const Dashboard: Component = () => {
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
                    <Flex directon="column" w="60%" jc="space-evenly" ai="center">
                        <Box w="60%" h="60%" bgc="#222222" br="10px" c="#FFFFFF" ta="center">
                            <h3>Total students</h3>
                            <p>6527</p>
                        </Box>
                    </Flex>
                    <Flex w="40%" direction="column" jc="space-evenly" ai="center">
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Student"/>
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Student"/>
                    </Flex>
                </Flex>
                <Flex w="100%" h="50%">
                    <Flex directon="column" w="60%" jc="space-evenly" ai="center">
                        <Box w="60%" h="60%" bgc="#222222" br="10px" c="#FFFFFF" ta="center">
                            <h3>Total Managers</h3>
                            <p>6527</p>
                        </Box>
                    </Flex>
                    <Flex w="40%" direction="column" jc="space-evenly" ai="center">
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Manager"/>
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Manager"/>
                    </Flex>
                </Flex>
            </Flex>
            <Flex bgc="#444444" br="10px" w="40%" h="80%">

            </Flex>
        </Flex>
    )
}

export default Dashboard