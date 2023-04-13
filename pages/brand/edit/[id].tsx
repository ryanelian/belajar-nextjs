import { WithDefaultLayout } from '@/components/DefautLayout';
import { SubmitButton } from '@/components/SubmitButton';
import { Title } from '@/components/Title';
import { BelajarNextJsBackEndClient, Brand } from '@/functions/swagger/BelajarNextJsBackEnd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useSwr from 'swr';
import { Spin, notification } from 'antd';
import Link from 'next/link';

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    })
});
type FormDataType = z.infer<typeof FormSchema>;

const EditForm: React.FC<{
    id: string,
    name: string,
    onEdit: () => void
}> = ({ id, name, onEdit }) => {

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset
    } = useForm<FormDataType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: name
        }
    });

    async function onSubmit(data: FormDataType) {
        try {
            const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
            await client.updateBrand(id, {
                name: data.name
            });
            reset({
                name: data.name
            });
            onEdit();
            notification.success({
                message: 'Success',
                description: 'Successfully Edited Brand Data',
                placement: 'bottomRight'
            })

        } catch (error) {
            console.error(error);
        }
    }
    return (
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
    );
}


const IndexPage: Page = () => {
    const router = useRouter();
    const { id } = router.query;
    const fetcher = useSwrFetcherWithAccessToken();
    const brandDetailUrl = id ? `/api/be/api/Brands/${id}` : undefined;
    const { data, mutate } = useSwr<Brand>(brandDetailUrl, fetcher);

    function renderForm() {
        if (!id) {
            return (
                <Spin tip="Loading..." size='large'></Spin>
            );
        }
        if (typeof id !== 'string') {
            return (
                <Spin tip="Loading..." size='large'></Spin>
            );
        }
        const name = data?.name;
        if (!name) {
            return (
                <Spin tip="Loading..." size='large'></Spin>
            );
        }
        return (
            <EditForm id={id} name={name} onEdit={() => mutate} />
        );
    }

    return (
        <div>
            <Title>Edit Brands Data</Title>
            <Link href='/brand'>Return to Index</Link>

            <h2>Edit Brands Data</h2>
            {renderForm()}
            {/* {JSON.stringify(data)} */}
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
