export const isValidEmail = (email: string) => {
    return email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
};

export const isValidPassword = (password: string) => {
    return (
        password.match(/\d+/g) &&
        password.match(/[a-z]+/g) &&
        password.match(/[A-Z]+/g) &&
        password.match(/[.!#$@%&'*+/=?^_`{|}~-]+/g)
    );
};
