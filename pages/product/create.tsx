import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '@/components/SubmitButton';
import { BelajarNextJsBackEndClient, Brand } from '@/functions/swagger/BelajarNextJsBackEnd';
import Link from 'next/link';
import { InputText } from '@/components/FormControl';
import { Select, Spin, notification } from 'antd';
import { useState } from 'react';
import useSwr from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import debounce from 'lodash.debounce';

// C- Create
// R- Read
// U- Update
// D- Delete

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama must not be empty'
    }).min(3,{
        message: 'Product Name Must be greater than or equal to 3'
    }).max(255,{
        message: 'Product Name Must be less than or equal to 255'
    }),

    brandId: z.string({
        required_error: "Brand is required",
    })
    .nonempty({
        message: 'Brand must not be empty'
    }),

    description: z.string().nonempty({
        message: 'Description must not be empty'
    }).min(5,{
        message: 'Product Description Must be greater than or equal to 5'

    }).max(9999,{
        message: 'Product Description Must be less than or equal to 9999'
    }),

    quantity: z
    .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
    })
    .int('Quantity must be an integer')
    .min(1, {
        message: 'Quantity Must be greater than or equal to 1'
    })
    .max(9999,{
        message: 'Quantity must be less than or equal to 9999'
    })
    .positive('Value must be positive'),

    price: z
    .number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
    })
    .min(0,{
        message: 'Price Must be greater than or equal to 0'
    })
    .max(99999999.99,{
        message: 'Quantity must be less than or equal to 99999999.99'
    })
    .positive('Value must be positive'),
});

type FormDataType = z.infer<typeof FormSchema>;

const IndexPage: Page = () => {

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control
    } = useForm<FormDataType>({
        resolver: zodResolver(FormSchema)
    });

    async function onSubmit(data: FormDataType) {
        // console.log(data);

        try {
            const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
            await client.createProduct({
                name: data.name,
                brandId: data.brandId,
                description: data.description,
                quantity: data.quantity,
                price: data.price
            });
            reset();
            notification.success({
                message: 'Success',
                description: 'Successfully create product data',
                placement: 'bottomRight',
            });
        } catch (error) {
            console.error(error);
        }
    }

    const [search, setSearch] = useState('');
    const params = new URLSearchParams();
    params.append('search', search);
    const brandsUri = '/api/be/api/Brands?' + params.toString();
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, isLoading, isValidating } = useSwr<Brand[]>(brandsUri, fetcher);

    const setSearchDebounced = debounce((t: string) => setSearch(t), 300);

    const options = data?.map(Q => {
        return {
            label: Q.name,
            value: Q.id,
        };
    }) ?? [];

    return (
        <div>
            <Title>Create New Product</Title>
            <Link href='/product'>Return to Index</Link>

            <h2 className='mb-5 text-3xl'>Create New product</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <InputText id='name' {...register('name')}></InputText>
                    <p className='text-red-500'>{errors['name']?.message}</p>
                </div>
                <div className='mt-5'>
                    <label htmlFor='brand'>Brand</label>
                    <Controller
                        control={control}
                        name='brandId'
                        render={({ field }) => (
                            <Select
                                className='block'
                                showSearch
                                optionFilterProp="children"
                                {...field}
                                onSearch={t => setSearchDebounced(t)}
                                options={options}
                                filterOption={false}
                                notFoundContent={(isLoading || isValidating) ? <Spin size="small" /> : null}
                            />
                        )}
                    ></Controller>

                    <p className='text-red-500'>{errors['brandId']?.message}</p>
                </div>
                <div>
                    <label htmlFor='description'>Description</label>
                    <InputText id='description' {...register('description')}></InputText>
                    <p className='text-red-500'>{errors['description']?.message}</p>
                </div>

                <div>
                    <label htmlFor='quantity'>Quantity</label>
                    <InputText id='quantity' {...register('quantity', {valueAsNumber: true})}></InputText>
                    {errors.quantity && (<p className='text-red-500'>{errors['quantity']?.message}</p>)}
                </div>

                <div>
                    <label htmlFor='price'>Price</label>
                    <InputText id='price' {...register('price', {valueAsNumber: true})}></InputText>
                    <p className='text-red-500'>{errors['price']?.message}</p>
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
