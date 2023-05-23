import {DropdownMenu} from "@kobalte/core"
import linkItems from "./linkItems";
import "./Header.css"

function dropdownMenu(s: string, link: string){
    return(
        <DropdownMenu.Item class="dropdown-menu__item">
            {linkItems(s, link)}
        </DropdownMenu.Item>
    )
}


function dMenuInit(){
    return(
        <DropdownMenu.Root>
            <DropdownMenu.Trigger class="dropdown-menu__trigger">
                <span></span>
                <DropdownMenu.Icon class="dropdown-menu__trigger-icon">
                    v
                </DropdownMenu.Icon>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content class="dropdown-menu__content">
                    {dropdownMenu("Data Projets", "")}
                    {dropdownMenu("Profil", "connect")}
                    {dropdownMenu("Equipe", "register")}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}

export default dMenuInit