interface UserModel {
    id?: string;
    username: string;
    password: string;
    email: string;
    name: string;
    age?: string;
    gender?: string;
    role: string;
}

export default UserModel;