export const formRegex = {
    firstName: /^[a-z ,.'-]+$/i,
    lastName: /^[a-z ,.'-]+$/i,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
    email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
};


interface RegexProps {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPass: string
}

const useFormRegex = (formData: RegexProps) => {
    const firstNameCheck = formRegex.firstName.test(formData.firstName);
    const lastNameCheck = formRegex.lastName.test(formData.lastName);
    const emailCheck = formRegex.email.test(formData.email);
    const passwordCheck = formRegex.password.test(formData.password);
    const confirmPasswordCheck = formRegex.password.test(formData.confirmPass);

    if (!firstNameCheck) {
        return "First name is missing or invalid"
    }

    if (!lastNameCheck) {
        return "Last name is missing or invalid"
    }

    if (!emailCheck) {
        return "Email is missing or invalid"
    }

    if (!passwordCheck) {
        return "Password is missing or invalid"
    }

    if (!confirmPasswordCheck) {
        return "Confirm Password is missing or invalid"
    }
}
