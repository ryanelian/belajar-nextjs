import { Page } from "@/types/Page";
import { Alert, notification } from "antd";
import Link from "next/link";
import { FormEventHandler, useState } from "react";

const FormPage: Page = () => {
    const [notify, contextHolder] = notification.useNotification();
    const [error, setError] = useState('');
    const [inputName, setInputName] = useState('');
    const [inputNameValidation, setInputNameValidation] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputEmailValidation, setInputEmailValidation] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputPasswordValidation, setInputPasswordValidation] = useState('');
    const [inputConfirmPassword, setInputConfirmPassword] = useState('');
    const [inputConfirmPasswordValidation, setInputConfirmPasswordValidation] = useState('');

    function Validation() {
        if (!inputName) {
            setInputNameValidation('Name is required');
            return;
        } else{
            setInputNameValidation('');
        }
        if(!inputEmail){
            setInputEmailValidation('Email is required');
            return;
        } else{
            setInputEmailValidation('');
        }
        if(!inputPassword){
            setInputPasswordValidation('Password is required');
            return;
        }
        else{
            setInputPasswordValidation('');
        }
        if(!inputConfirmPassword){
            setInputConfirmPasswordValidation('Confirm Password is required');
            return;
        }
        else{
            setInputConfirmPasswordValidation('');
        }
        if(inputPassword !== inputConfirmPassword){
            setInputConfirmPasswordValidation('Password and Confirm Password must be same');
            return;
        }
        else{
            setInputConfirmPasswordValidation('');
        }
        return true;
    }


    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        setError('');
        e.preventDefault();

        const isValid = Validation();
        if(!isValid) return;
        try {
            await fetch('https://example.com/api/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: inputName,
                    email: inputEmail,
                    password: inputPassword,
                    confirmPassword: inputConfirmPassword

                })
            });
            notify.success({
                message: 'Success',
                description: 'Form has been submitted',
                placement: 'bottomRight'
            });

            setInputName('');
            setInputEmail('');
            setInputPassword('');
            setInputConfirmPassword('');
        }
        catch (err) {
            // 1
            notify.error({
                message: 'An unhandled exception has occurred when submitting the form',
                description: String(err),
                placement: 'bottomRight'
            });
            // 2
            setError(String(error));
        }

    }
    const inputBox = "mt-3 px-2 py-3 block w-1/2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50";
    const submitBox = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5";

    return (
        <div className="p-5">
            <div>
                <Link href='/'>Ke Halaman Belajar</Link>
            </div>
            <div>
                Name : {inputName}
            </div>

            {error &&
                <div className="mt-5 bg-red-200 text-red-500 border-red-600 p-5">{error}</div>
            }

            {error &&
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                />
            }


            <form onSubmit={onSubmit}>
                <div>
                    <h1 className="mb-5 p-2 font-bold">Forms Page</h1>
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" className={inputBox} />
                    {inputNameValidation && <div className="text-red-500">{inputNameValidation}</div>}
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" className={inputBox} />
                    {inputEmailValidation && <div className="text-red-500">{inputEmailValidation}</div>}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" className={inputBox} />
                    {inputPasswordValidation && <div className="text-red-500">{inputPasswordValidation}</div>}
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" className={inputBox} />
                    {inputConfirmPasswordValidation && <div className="text-red-500">{inputConfirmPasswordValidation}</div>}
                </div>
                <button type="submit" className={submitBox}>Submit</button>
            </form>
            {contextHolder}
        </div>
    );
}

export default FormPage;