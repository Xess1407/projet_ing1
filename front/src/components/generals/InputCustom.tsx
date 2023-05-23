import { TextField } from "@kobalte/core"
import style_parser from "../StyleParser"
import './scss/inputCustom.css'
import {update_form_field} from "../RegisterForm";

const InputCustom = (props: any) => {
    let s = ""+style_parser(props)
    return <TextField.Root class="input" style={s}>
        <TextField.Label class="input_label" for={props.id}></TextField.Label>
        <TextField.Input class="input_textfield" type={props.type} id={props.id} onChange={update_form_field(props.id)} required/> {/* or <TextField.TextArea /> */}
        <TextField.Description>{props.description}</TextField.Description>
        <TextField.ErrorMessage />
    </TextField.Root>
}

export default InputCustom