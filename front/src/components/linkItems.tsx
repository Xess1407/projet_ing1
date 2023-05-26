import {Link} from "@kobalte/core"
import { useNavigate } from "@solidjs/router"
import { Component } from "solid-js"

/*
function linkItems(s: string, link: string){
    return(
        <Link.Root class="link" href={"http://localhost:3000/" + link}>
            {s}
        </Link.Root>
    )
}
*/

const LinkItems = (props: any) => {
    const nav = useNavigate()
    const handle_nav = () => {
        nav(props.path, {replace: true})
    }
    return(
        <Link.Root class="link" onclick={handle_nav}>
            {props.text}
        </Link.Root>
    )
}

export default LinkItems