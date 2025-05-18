export { };
declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        status: string;
        statusCode: number;
        data?: T;
    }
    interface ILogin {
        access_token: string;
        user: {
            email: string;
            username: string;
            fullName: string;
            role: string;
            id: string;
        }
    }
    interface IRegister {
        id: string;
        email: string;
        fullName: string;
    }

    interface IUser {
        email: string;
        username: string;
        fullName: string;
        role: string;
        id: string;
    }

    interface IFetchAccount {
        user: IUser
    }
}