import { Component } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import ButtonCustom from "../components/generals/ButtonCustom";

const Dashboard: Component = () => {
    return (
        <Flex bgc="#000000" w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden" direction="row" jc="space-evenly">
            <Flex bgc="#555555" br="10px" w="18%" h="50%">
                <ul>
                    <Flex>
                        <img class="icons" src="src/img/analytics.png" alt="icon" />
                        <li>Analytics</li>
                    </Flex>      
                    <Flex>
                        <img class="icons" src="src/img/user.png" alt="icon" />
                        <li>Users</li>
                    </Flex>           
                    <Flex>
                        <img class="icons" src="src/img/team.png" alt="icon" />
                        <li>Teams</li>
                    </Flex>                
                    <Flex>
                        <img class="icons" src="src/img/challenge.png" alt="icon" />
                        <li>Challenges</li>
                    </Flex>
                </ul>
            </Flex>
            <Flex bgc="#555555" br="10px" w="75%" h="90%">
            </Flex>
        </Flex>
    )
}

export default Dashboard