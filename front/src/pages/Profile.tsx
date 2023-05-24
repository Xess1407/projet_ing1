import { Component } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import { Image } from "@kobalte/core";
import "./css/Profile.css";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";

const Profile: Component = () => {
    return (/*#222222*/
        <Flex bgc="black" direction="row" w="100%" h="100vh">
            <Flex direction="column" w="50%" h="100%">
                <Flex bgc="black" w="100%" jc="center">
                    <Image.Root fallbackDelay={600} class="image">
                        <Image.Img
                            class="image__img"
                            src="./src/img/profil.jpg"
                            alt="PP"
                        />
                        <Image.Fallback class="image__fallback">MG</Image.Fallback>
                    </Image.Root>
                </Flex>
                <Flex w="100%" h="100%" jc="space-around">
                    <Box h="262px" w="309px" c="white">
                        Team
                        <Box b="2px solid white" h="100%" br="8px"></Box>
                    </Box>
                    <Box h="262px" w="309px" c="white">
                        Challenges
                        <Box b="2px solid white" h="100%" br="8px"></Box>
                    </Box>
                </Flex>
            </Flex>
            <Box w="50%" >
                <Flex direction="row" jc="space-around" h="600px">
                    <Flex c="white" mb="20%">
                        <Flex direction="column" jc="space-around">
                            <InputCustom id="surname" label="Surname" type="text" placeholder="Surname"></InputCustom>
                            <InputCustom id="email" label="Email" type="text" placeholder="Email"></InputCustom>
                            <InputCustom id="phoneNumber" label="Phone number" type="text" placeholder="Phone number"></InputCustom>
                            <InputCustom id="name" label="Password" type="password" placeholder="Password"></InputCustom>
                        </Flex>
                    </Flex>
                    <Flex c="white" mb="20%">
                        <Flex direction="column" jc="space-around">
                            <InputCustom id="firstName" label="First name" type="text" placeholder="First name"></InputCustom>
                            <InputCustom id="studyLevel" label="Study level" type="text" placeholder="Study level"></InputCustom>
                            <InputCustom id="establishment" label="Establishment" type="text" placeholder="Establishment"></InputCustom>
                            <InputCustom id="city" label="City" type="text" placeholder="City"></InputCustom>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex jc="center">
                    <ButtonCustom class="profile-submit" type="submit" value="submit" m="20px 0" w="12em" text="Edit profile"></ButtonCustom>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Profile