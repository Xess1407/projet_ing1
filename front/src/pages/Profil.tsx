import { Component } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import { Image } from "@kobalte/core";
import "./Profile.css";
import ButtonCustom from "../components/generals/ButtonCustom";

const Profile: Component = () => {
    return (/*#222222*/
        <Box bgc="white" pos="absolute" tp="140px" bm="0px" w="100%">
            <Box b="1px solid" bgc="black" pos="absolute" tp="0px" bm="45%" w="40%">
                <Image.Root fallbackDelay={600} class="image">
                    <Image.Img
                        class="image__img"
                        src="./src/img/profil.jpg"
                        alt="Nicole Steeves"
                    />
                    <Image.Fallback class="image__fallback">MG</Image.Fallback>
                </Image.Root>
            </Box>
            <Box b="1px solid"  pos="absolute" tp="55%" bm="0px" w="40%">
                <Flex ml="5%"><label for="team">Team</label></Flex>
                <Box class="team" b="1px solid"  pos="absolute" tp="10%" bm="10%" w="40%" ml="5%">

                </Box>

                <Box b="1px solid" pos="absolute" tp="0%" bm="10%" w="40%" ml="55%">
                    <Flex><label for="challenge">Challenge</label></Flex>
                    <Box class="challenge" b="1px solid"  pos="absolute" tp="10%" bm="0%" w="100%" ml="0%">

                    </Box>
                </Box>
            </Box>
            <Box b="1px solid" pos="absolute" tp="0px" bm="0px" ml="40%" w="60%">

            </Box>
        </Box>
    )
}

export default Profile