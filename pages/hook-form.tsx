import { Page } from "@/types/Page";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from "next/link";
import { WithDefaultLayout } from "@/components/DefautLayout";
import { notification } from "antd";

const Form = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
});

type FormData = z.infer<typeof Form>;

const FormPage: Page = () => {
    const { register,
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
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    confirmPassword: data.confirmPassword
                })
            });
            notify.success({
                message: 'Success',
                description: 'Form has been submitted',
            });
            reset();
        } catch (error) {
            notify.error({
                message: 'Error',
                description: 'Form has not been submitted',
            });

        }
    }

    const inputBox = "mt-3 px-2 py-3 block w-1/2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50";
    const submitBox = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5";

    return (
        <div className="p-5">
            <div>
                <Link href='/'>Ke Halaman Belajar</Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <h1 className="mb-5 p-2 font-bold">Forms Page</h1>
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" className={inputBox} {...register('name')} />
                    <p className="mt-2 text-red-500">{errors.name?.message}</p>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className={inputBox} {...register('email')} />
                    <p className="mt-2 text-red-500">{errors.email?.message}</p>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" className={inputBox} {...register('password')} />
                    <p className="mt-2 text-red-500">{errors.password?.message}</p>
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" className={inputBox} {...register('confirmPassword')} />
                    <p className="mt-2 text-red-500">{errors.confirmPassword?.message}</p>
                </div>
                <button type="submit" className={submitBox}>Submit</button>
            </form>
            {contextHolder}

        </div>
    );

}





FormPage.layout = WithDefaultLayout;
export default FormPage;