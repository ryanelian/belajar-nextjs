import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '@/components/SubmitButton';
import { BelajarNextJsBackEndClient, Brand } from '@/functions/swagger/BelajarNextJsBackEnd';
import Link from 'next/link';
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
        message: 'Nama tidak boleh kosong'
    }),

    brandId: z.string({
        required_error: 'Brand tidak boleh kosong'
    }).nonempty({
        message: 'Brand Id tidak boleh kosong'
    }),

    price: z.number({
        invalid_type_error: 'Price tidak boleh kosong'
    }).positive({
        message: 'Price harus positive harus lebih dari 0'
    }).max(1_000_000_000, {
        message: 'Price tidak boleh lebih dari 1 milyar'
    }),
    // test
    quantity: z.number({
        invalid_type_error: 'Quantity tidak boleh kosong'
    }).positive({
        message: 'Quantity harus positive harus lebih dari 0'
    }).max(1_000_000, {
        message: 'Quantity tidak boleh lebih dari 1 juta'
    }),

    description: z.string().nonempty({
        message: 'Description tidak boleh kosong'
    }),


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
                price: data.price,
                quantity: data.quantity,
                description: data.description
            });
            reset();
            notification.success({
                message: 'Success',
                description: 'Successfully Created Product Data',
                placement: 'bottomRight'
            });
        } catch (error) {
            console.error(error);
        }
    }
    const [search, setSearch] = useState('');
    const params = new URLSearchParams();
    params.append('search', search);
    const productUri = '/api/be/api/Brands?' + params.toString();
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, isLoading, isValidating } = useSwr<Brand[]>(productUri, fetcher);


    const setSearchDebounced = debounce((t: string) => setSearch(t), 300);

    const options = data?.map(Q => {
        return {
            label: Q.name,
            value: Q.id
        };
    }) ?? [];

    return (
        <div>
            <Title>Create New Product</Title>
            <Link href='/product'>Return to Index</Link>

            <h2 className='mb-5 text-3xl'>Create New Product</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' type='text' id='name' {...register('name')}></input>
                    <p className='text-red-500'>{errors['name']?.message}</p>
                </div>
                <div className="mt-5">
                    <label htmlFor='brand'>Brand</label>
                    <Controller
                        control={control}
                        name='brandId'
                        render={({ field }) => (
                            <Select
                                className='block'
                                showSearch
                                placeholder='Select a Brand'
                                optionFilterProp='children'
                                {...field}


                                onSearch={t => setSearchDebounced(t)}
                                options={options}
                                filterOption={false}
                                notFoundContent={(isLoading || isValidating) ? <Spin size='small' /> : null}
                            />
                        )}
                    ></Controller>
                    <p className='text-red-500'>{errors['brandId']?.message}</p>
                </div>

                <div>
                    <label htmlFor='price'>Price</label>
                    <input className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' type='number' id='price' {...register('price', { valueAsNumber: true })} min={0} placeholder='1'></input>
                    <p className='text-red-500'>{errors['price']?.message}</p>
                </div>

                <div>
                    <label htmlFor='quantity'>Quantity</label>
                    <input className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' type='number' id='quantity' {...register('quantity', { valueAsNumber: true })} min={0} placeholder='1'></input>
                    <p className='text-red-500'>{errors['quantity']?.message}</p>
                </div>

                <div>
                    <label htmlFor='description'>Description</label>
                    <input className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' type='text' id='description' {...register('description')} maxLength={100} placeholder='cant do more than 100 characters long'></input>
                    <p className='text-red-500'>{errors['description']?.message}</p>
                </div>

                <div className='mt-5'>
                    <SubmitButton>Submit</SubmitButton>
                </div>
                <p>
                    {productUri}
                </p>
                <p>
                    {JSON.stringify(data)}
                </p>
            </form>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
