import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '@/components/SubmitButton';
import { BelajarNextJsBackEndClient } from '@/functions/swagger/BelajarNextJsBackEnd';
import Link from 'next/link';
import { notification } from 'antd';

// C- Create
// R- Read
// U- Update
// D- Delete

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama must not be empty'
    }).min(3,{
        message: 'Brand Name Characters Must be greater than or equal to 3'
    }).max(255,{
        message: 'Brand Name Characters Must be less than or equal to 255'
    }),
});

type FormDataType = z.infer<typeof FormSchema>;

const IndexPage: Page = () => {

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset
    } = useForm<FormDataType>({
        resolver: zodResolver(FormSchema)
    });

    async function onSubmit(data: FormDataType) {

        try {
            const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
            await client.createBrand({
                name: data.name
            });
            reset();
            notification.success({
                message: 'Success',
                description: 'Successfully create Brand data',
                placement: 'bottomRight',
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <Title>Create New Brand</Title>
            <Link href='/brand'>Return to Index</Link>
            
            <h2 className='mb-5 text-3xl'>Create New Brand</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' id='name' {...register('name')}></input>
                    <p className='text-red-500'>{errors['name']?.message}</p>
                </div>
                <div className='mt-5'>
                    <SubmitButton>Submit</SubmitButton>
                </div>
            </form>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
