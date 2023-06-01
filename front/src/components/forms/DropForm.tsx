import {createStore} from "solid-js/store";
import { getSessionUser } from "../Session";

type DropFormField = {
    data_project_id: number
}
export const submit_drop = async (form: DropFormField) => {
    let file = (document.getElementById("python_file") as HTMLInputElement).files
    if(file === null) return

    let file_name = file[0].name;

    var reader = new FileReader();
    reader.readAsText(file[0], "UTF-8");

    reader.onload = async function (e: any) {
        let file_content = e.target.result;

        const res_analyze = await fetch(`http://localhost:8001/analyze`, {
            method: "POST",
            body: JSON.stringify({data_project_id: form.data_project_id, user_id: getSessionUser()?.user_id, file_name: file_name, file_content: file_content}),
            headers: {"Content-type": "application/json; charset=UTF-8"} 
        });

        let status = await res_analyze.status
        if(status != 200) {
            console.log("[ERROR] Couldn't analyze the file! Status:" + status)
            return status
        }
    }
}

export const [dropForm, setDropForm] = createStore<DropFormField>({
    data_project_id: 1
});