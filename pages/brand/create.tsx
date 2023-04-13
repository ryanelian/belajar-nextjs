import Link from 'next/link';
import { InputText } from '@/components/FormControl';
import { BelajarNextJsBackEndClient } from '@/functions/swagger/BelajarNextJsBackEnd';
import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '@/components/SubmitButton';
import { z } from 'zod';


// C- Create
// R- Read
// U- Update
// D- Delete

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    })
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
        // console.log(data);

        try {
            const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
            await client.createBrand({
                name: data.name,
            });
            reset();
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
                    <InputText id='name' {...register('name')}></InputText>
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
