import { createStore } from "solid-js/store";
import { setConfirmed } from "../../pages/DashboardProject";

type ProjectFormFields = {
    data_challenge_id: number, 
    description: string, 
    image: string,
    name: string;
};

type ResourceFormFields = {
    name: string;
    url: string;
    data_project_id: number;
};

export const [projectForm, setProjectForm] = createStore<ProjectFormFields>({
    data_challenge_id: 1,
    name: "",
    description: "",
    image: ""
});

export const [resourceForm, setResourceForm] = createStore<ResourceFormFields>({
    name: "",
    url: "",
    data_project_id: 1,
});

export const submit_project = async (form: ProjectFormFields) => {
    console.log(`submitting ${JSON.stringify(form)}`);
  
    // Fetch data project
    const res_register_project = await fetch(`http://localhost:8080/api/project`, {
      method: "POST",
      body: JSON.stringify({data_challenge_id: form.data_challenge_id, name: form.name, description: form.description, image: "default", password: "admin"}),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
  
    let status = await res_register_project.status
    if (status != 200) {
      console.log("[ERROR] Couldn't register the project! Status:" + status)
      return status
    }

    let res = await res_register_project.json()
    submit_image(res.id)

    // Fetch data project
    const res_register_project_r = await fetch(`http://localhost:8080/api/project`, {
      method: "POST",
      body: JSON.stringify({id: res.id, data_challenge_id: form.data_challenge_id, name: form.name, description: form.description, image: "mproject"+res.id, password: "admin"}),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
  
    status = await res_register_project_r.status
    if (status != 200) {
      console.log("[ERROR] Couldn't modify the project! Status:" + status)
      return status
    }
    setConfirmed(true)
};

export const submit_resource = async (form: ResourceFormFields) => {
  const res_register_resource = await fetch(`http://localhost:8080/api/resource-project`, {
      method: "POST",
      body: JSON.stringify({name: resourceForm.name, url: resourceForm.url, data_project_id: resourceForm.data_project_id, password: "admin"}),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
  
    let status = await res_register_resource.status
    if (status != 200) {
      console.log("[ERROR] Couldn't register the challenge! Status:" + status)
      return status
    }
    setConfirmed(true)
}

function renameFile(originalFile:any, newName:any) {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}

export const submit_image = async (id: number) => {
    let data = new FormData()
    let file = (document.getElementById("project_img") as HTMLInputElement).files
    if (file === null) return


    data.append("file", renameFile(file[0], "project"+id))
    console.log(data.get("file"));
    
  
    // Fetch data project
    const res_register_image = await fetch(`http://localhost:8080/api/file`, {
      method: "POST",
      body: data,
    });
  
    let status = await res_register_image.status
    if (status != 201) {
        console.log(await res_register_image);
        
      console.log("[ERROR] Couldn't register the challenge! Status:" + status)
      return status
    }
};