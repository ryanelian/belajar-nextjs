
import Link from 'next/link';
import { WithDefaultLayout } from '../components/DefautLayout';
import { Page } from '../types/Page';
import { notification } from 'antd';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { FormControl } from '@/components/FormControl';
import { SubmitButton } from '@/components/SubmitButton';

const Form = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong!'
    }).min(2, 'Panjang nama minimal 2 karakter'),
});

type FormData = z.infer<typeof Form>;

const FormPage: Page = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>({
        resolver: zodResolver(Form)
    });

    const [notify, contextHolder] = notification.useNotification();

    async function onSubmit(data: FormData) {
        try {
            await fetch('/api/fake', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name
                })
            });
            notify.success({
                message: 'Form Submit Success',
                placement: 'bottomRight'
            });

            reset();
        } catch (err) {
            notify.error({
                message: 'An unhandled exception has occurred when submitting form',
                description: String(err),
                placement: 'bottomRight'
            });
        }
    }

    return (
        <div>
            <div>
                <Link href='/'>Ke Halaman Index</Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mt-5'>
                    <label className='font-bold' htmlFor='name'>Name</label>
                    <FormControl {...register('name')}  id='name' type='text'></FormControl>
                    <p className='mt-2 text-red-500'>{errors.name?.message}</p>
                </div>
                <div className='mt-5'>
                    <label className='font-bold' htmlFor='email'>Email</label>
                    <FormControl id='email' type='text'></FormControl>
                    <p className='mt-2 text-red-500'></p>
                </div>
                <div className='mt-5'>
                    <SubmitButton></SubmitButton>
                </div>
            </form>

            {contextHolder}
        </div>
    );
}

FormPage.layout = WithDefaultLayout;
export default FormPage;
