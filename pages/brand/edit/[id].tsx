import { WithDefaultLayout } from '@/components/DefautLayout';
import { InputText } from '@/components/FormControl';
import { Title } from '@/components/Title';
import { BelajarNextJsBackEndClient, Brand } from '@/functions/swagger/BelajarNextJsBackEnd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spin, notification } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useSwr from 'swr';
import { z } from 'zod';

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
        register,
        handleSubmit,
        formState: { errors },
        reset } = useForm<FormDataType>({
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
            })
            reset({
                name: data.name
            });
            onEdit();
            notification.success({
                message: 'Success',
                description: 'Succesfully edited brand data',
                placement: 'bottomRight'
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor='name'>Name</label>
                <InputText id='name' {...register('name')}></InputText>
                <p className='mt-2 text-red-500'>{errors['name']?.message}</p>
            </div>
            <div className='mt-5'>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type='submit'>Submit</button>
            </div>
        </form>
    );
};

const IndexPage: Page = () => {
    const router = useRouter();
    const { id } = router.query;

    const fetcher = useSwrFetcherWithAccessToken();
    const brandDetailUri = id ? `/api/be/api/Brands/${id}` : undefined;
    const { data, mutate } = useSwr<Brand>(brandDetailUri, fetcher);

    function renderForm() {
        if (!id || typeof id !== 'string') {
            return (
                <Spin tip='Loading...' size='large'></Spin>
            );
        }

        const name = data?.name;
        if (!name) {
            return (
                <Spin tip='Loading...' size='large'></Spin>
            );
        }

        return (<
            EditForm id={id} name={name} onEdit={() => mutate()}></EditForm>
        );
    }

    return (
        <div>
            <Title>Edit Brand Data</Title>
            <Link href='/brand'>Return to index</Link>
            <h2 className='mb-5 text-3xl'>Edit Brand Data</h2>
            {renderForm()}
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
