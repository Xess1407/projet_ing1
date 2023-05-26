export class User {
    name: string;
    family_name: string;
    email: string;
    password: string;
    telephone_number: number;
    role: string;
  
    constructor(
      name: string,
      family_name: string,
      email: string,
      password: string,
      telephone_number: number,
      role: string
    ) {
      this.name = name;
      this.family_name = family_name;
      this.email = email;
      this.password = password;
      this.telephone_number = telephone_number;
      this.role = role;
    }
  }
  
export class UserEntry {
    id: number;
    name: string;
    family_name: string;
    email: string;
    password: string;
    telephone_number: number;
    role: string;
  
    constructor(
      id: number,
      name: string,
      family_name: string,
      email: string,
      password: string,
      telephone_number: number,
      role: string,
    ) {
      this.id = id;
      this.name = name;
      this.family_name = family_name;
      this.email = email;
      this.password = password;
      this.telephone_number = telephone_number;
      this.role = role;
    }
  }