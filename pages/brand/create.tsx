import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SubmitButton } from '@/components/SubmitButton';
import { BelajarNextJsBackEndClient } from '@/functions/swagger/BelajarNextJsBackEnd';
import { InputText } from '@/components/FormControl';
import { notification } from 'antd';

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    })
});

type FormDataType = z.infer<typeof FormSchema>;

const CreatePage: Page = () => {
    const { handleSubmit, register, formState: { errors }, reset } = useForm<FormDataType>({
        resolver: zodResolver(FormSchema)
    });

    async function onSubmit(data: FormDataType) {
        try {
            const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
            await client.createBrand({
                name: data.name
            })
            reset();
            notification.success({
                message: 'Success',
                description: 'Data Brand Berhasil Ditambahkan',
                placement: 'bottomRight'
            })
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div>
            <Title>Manage Brand</Title>
            <h2 className='mb-5 text-3xl'>Create Brand</h2>
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
        </div>
    );
}

CreatePage.layout = WithDefaultLayout;
export default CreatePage;
