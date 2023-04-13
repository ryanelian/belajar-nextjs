import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { BelajarNextJsBackEndClient, Brand } from '@/functions/swagger/BelajarNextJsBackEnd';
import Link from 'next/link';
import { InputText } from '@/components/FormControl';
import { Select, Spin } from 'antd';
import { useState } from 'react';
import useSwr from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import debounce from 'lodash.debounce';
import { SubmitButton } from '@/components/SubmitButton';
import { notification } from 'antd';

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    }),
    brandId: z.string({
        invalid_type_error:'Brand tidak boleh kosong'
    }).nonempty({
        message: 'Brand tidak boleh kosong',
    }),
    description: z.string().nonempty({
        message: 'description tidak boleh kosong'
    }),
    price: z.number({
        invalid_type_error: 'Harga tidak boleh kosong'
    }).nonnegative()
        .max(100000000, "Harga tidak bisa lebih dari 100 juta rupiah")
        .min(100, "Angka tidak bisa kurang dari 100 rupiah"),
    quantity: z.number({
        invalid_type_error: 'Jumlah tidak boleh kosong'
    }).nonnegative()
        .max(100, "Stok barang tidak boleh lebih dari 1000")
        .min(10, "Stok barang harus lebih dari 10")
});

type FormDataType = z.infer<typeof FormSchema>;

const IndexPage: Page = () => {

    const [notify, contextHolder] = notification.useNotification();

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
                price: data.price,
                quantity: data.quantity
            });
            notify.success({
                message: `Successfully added ${data.name}`,
                placement: 'bottomRight'
            });
            reset();
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
            value: Q.id
        };
    }) ?? [];

    return (
        <div>
            <Title>Create New Product</Title>
            <Link href='/Product'>Return to Index</Link>

            <h2 className='mb-5 text-3xl'>Create New Product</h2>
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
                    <label htmlFor='price'>Price</label>
                    <InputText type='number' id='price'{...register('price', { valueAsNumber: true })}>

                    </InputText>
                    <p className='text-red-500'>{errors['price']?.message}</p>
                </div>
                <div>
                    <label htmlFor='quantity'>Quantity</label>
                    <InputText type='number' id='quantity' {...register('quantity', { valueAsNumber: true })}></InputText>
                    <p className='text-red-500'>{errors['quantity']?.message}</p>
                </div>
                <div className='mt-5'>
                    <SubmitButton>Submit</SubmitButton>
                </div>
            </form>
            {contextHolder}
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
