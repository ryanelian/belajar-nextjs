import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SubmitButton } from '@/components/SubmitButton';
import { BelajarNextJsBackEndClient, Brand } from '@/functions/swagger/BelajarNextJsBackEnd';
import { InputText } from '@/components/FormControl';
import { notification } from 'antd';
import { useRouter } from 'next/router';
import useSwr from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    })
});

type FormDataType = z.infer<typeof FormSchema>;

const EditForm: React.FC<{
    id: string,
    brand: Brand,
    onEdit: () => void
}> = ({ id, brand, onEdit }) => {
    const { handleSubmit, register, formState: { errors }, reset } = useForm<FormDataType>({
        resolver: zodResolver(FormSchema),
        defaultValues: ({
            name: brand.name
        })
    });

    async function onSubmit(data: FormDataType) {
        try {
            const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
            await client.updateBrand(id, {
                name: data.name
            })
            reset();
            onEdit();
            notification.success({
                message: 'Success',
                description: 'Data Brand Berhasil Diedit',
                placement: 'bottomRight'
            })
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label className="font-bold" htmlFor='name'>Name</label>
                <InputText id='name' {...register('name')}></InputText>
                <p className='text-red-500'>{errors['name']?.message}</p>
            </div>
            <div className="mt-5">
                <SubmitButton>Submit</SubmitButton>
            </div>
        </form>
    );
}

const CreatePage: Page = () => {
    const router = useRouter();
    const { id } = router.query;

    const fetcher = useSwrFetcherWithAccessToken();
    const brandDetailUrl = id ? `/api/be/api/Brands/${id}` : undefined;
    const { data, mutate } = useSwr<Brand>(brandDetailUrl, fetcher);

    function renderForm() {
        if (!id || !data || typeof id !== 'string') {
            return;
        }

        return <EditForm brand={data} id={id} onEdit={() => mutate()}></EditForm>
    }

    return (
        <div>
            <Title>Manage Brand</Title>
            <h2 className='mb-5 text-3xl'>Edit Brand</h2>
            {renderForm()}
        </div>
    );
}

CreatePage.layout = WithDefaultLayout;
export default CreatePage;
