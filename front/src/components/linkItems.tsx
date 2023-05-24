import {Link} from "@kobalte/core"

function linkItems(s: string, link: string){
    return(
        <Link.Root class="link" href={"http://localhost:3000/" + link}>
            {s}
        </Link.Root>
    )
}

export default linkItems