import { Component } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import { Image } from "@kobalte/core";
import "./css/Profile.css";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";

const Profile: Component = () => {
    return (/*#222222*/
        <Flex bgc="#111111" direction="row" w="100%" h="100vh">
            <Flex direction="column" w="50%" h="100%">
                <Flex w="100%" jc="center">
                    <Image.Root fallbackDelay={600} class="image">
                        <Image.Img
                            class="image__img"
                            src="/img/profil.jpg"
                            alt="PP"
                        />
                        <Image.Fallback class="image__fallback">MG</Image.Fallback>
                    </Image.Root>
                </Flex>
                <Flex w="100%" h="100%" jc="space-around">
                    <Box h="262px" w="309px" c="white">
                        <h3>Team</h3>
                        <Box b="2px solid white" h="100%" br="8px"></Box>
                    </Box>
                    <Box h="262px" w="309px" c="white">
                        <h3>Challenges</h3>
                        <Box b="2px solid white" h="100%" br="8px"></Box>
                    </Box>
                </Flex>
            </Flex>
            <Box w="50%" >
                <Flex direction="row" jc="space-around" h="600px">
                    <Flex jc="space-evenly" ai="center" c="white" direction="column">
                            <InputCustom id="family_name" label="Surname" type="text" placeholder="Surname"/>
                            <InputCustom id="email" label="Email" type="text" placeholder="Email"/>
                            <InputCustom id="phone" label="Phone" type="text" placeholder="Phone number" pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"/>
                            <InputCustom id="password" label="Password" type="password" placeholder="Password"/>
                    </Flex>
                    <Flex jc="space-evenly" ai="center" c="white" direction="column">
                            <InputCustom id="name" label="first-name" type="text" placeholder="First name"/>
                            <InputCustom id="school_level" label="Study level" type="text" placeholder="Study level"/>
                            <InputCustom id="school" label="Etablishment" type="text" placeholder="Etablishment"/>
                            <InputCustom id="city" label="City" placeholder="City"/>
                    </Flex>
                </Flex>
                <Flex jc="center">
                    <ButtonCustom class="profile-submit" type="submit" value="submit" m="20px 0" w="30%" h="3.5em" text="Edit profile"></ButtonCustom>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Profile