import {Link} from "@kobalte/core"
import { useNavigate } from "@solidjs/router"

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