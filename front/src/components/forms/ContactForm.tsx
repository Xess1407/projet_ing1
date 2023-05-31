import { createStore } from "solid-js/store";
import { sended, setContacted, setSended } from "../../pages/Contact";

type ContactFormFields = {
    object: string;
    content: string;
    receiver: [string, number];
};

export const [contactForm, setContactForm] = createStore<ContactFormFields>({
    object: "",
    content: "",
    receiver: ["challenge", 1],
});

const getEmailFromTeam = async (team_id: any) => {
    const res_member = await fetch(`http://localhost:8080/api/member/team/${team_id}`, {
        method: "GET",
    });

    let status = await res_member.status
    if (status != 200) {
        console.log("[ERROR] Couldn't get the members of the team! Status:" + status)
        return
    }
    let members = await res_member.json()
    let emails = []

    for (let i = 0; i < members.length; i++) {
        const res = await fetch(`http://localhost:8080/api/user/${members[i].user_id}`, {
            method: "GET",
        });
    
        let status = await res.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get the mail from member! Status:" + status)
            return
        }
        let r = await res.json()
        emails.push(r.email)
    }
    return emails
}

const getEmailFromChallenge = async (challenge_id: any) => {
    const res_project = await fetch(`http://localhost:8080/api/project/from-data-challenge/${challenge_id}`, {
        method: "GET",
    });

    let status = await res_project.status
    if (status != 200) {
        console.log("[ERROR] Couldn't get the project of the challenge! Status:" + status)
        return
    }
    let projects = await res_project.json()

    let emails:any[] = []
    for (let i = 0; i < projects.length; i++) {
        const res = await fetch(`http://localhost:8080/api/team/data_project/${projects[i].id}`, {
            method: "GET",
        });
    
        let status = await res.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get the team from data_project! Status:" + status)
            return
        }
        let res_teams = await res.json()

        for (let j = 0; j < res_teams.length; j++) {
            console.log(res_teams[j].id);
            emails = Array.from(new Set(emails.concat(await getEmailFromTeam(res_teams[i].id))))
        }
    }
    return emails
}

export const submit_mail = async (form: ContactFormFields) => {
    let emails;
    if (form.receiver[0] == "team") 
        emails = await getEmailFromTeam(form.receiver[1])
    else 
        emails = await getEmailFromChallenge(form.receiver[1])
    
    setSended(true)
    setContacted(emails)
} 