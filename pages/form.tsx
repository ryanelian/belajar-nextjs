
import Link from 'next/link';
import { WithDefaultLayout } from '../components/DefautLayout';
import { Page } from '../types/Page';
import { FormEventHandler, useState } from 'react';
import { Alert, notification } from 'antd';

const FormPage: Page = () => {

    const [notify, contextHolder] = notification.useNotification();

    const [inputName, setInputName] = useState('');
    const [inputNameValidation, setInputNameValidation] = useState('');
    const [error, setError] = useState('');

    function validate() {
        if (!inputName) {
            setInputNameValidation('Nama tidak boleh kosong!');
            return false;
        } else { // -->
            if (inputName.length < 2) {
                setInputNameValidation('Panjang nama minimal 2 karakter!');
                return false;
            } else {
                setInputNameValidation('');
            }
        }

        return true;
    }

    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        setError('');

        e.preventDefault();

        const valid = validate();
        if (!valid) {
            return;
        }

        try {
            await fetch('/api/fake', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: inputName
                })
            });
            notify.success({
                message: 'Form Submit Success',
                placement: 'bottomRight'
            });

            // reset form
            setInputName('');
        } catch (err) {

            // 1
            notify.error({
                message: 'An unhandled exception has occurred when submitting form',
                description: String(err),
                placement: 'bottomRight'
            });

            // 2
            setError(String(err));
        }

    };

    return (
        <div>
            <div>
                <Link href='/'>Ke Halaman Index</Link>
            </div>

            <div>
                Name: {inputName}
            </div>

            {
                error && <div className='mt-5 bg-red-200 text-red-600 border-red-600 p-5'>
                    {error}
                </div>
            }

            {
                error &&
                <Alert
                    className='mt-5'
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                />
            }

            <form onSubmit={onSubmit}>
                <div className='mt-5'>
                    <label className='font-bold' htmlFor='name'>Name</label>
                    <input value={inputName} onChange={t => setInputName(t.target.value)} className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' id='name' type='text'></input>
                    {
                        inputNameValidation && <p className='mt-2 text-red-500'>{inputNameValidation}</p>
                    }
                </div>
                <div className='mt-5'>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type='submit'>Submit</button>
                </div>
            </form>

            {contextHolder}
        </div>
    );
}

FormPage.layout = WithDefaultLayout;
export default FormPage;
