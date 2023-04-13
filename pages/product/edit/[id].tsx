import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { InputText } from '@/components/FormControl';
import { Select, Spin, notification } from 'antd';
import { useState } from 'react';
import useSwr from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import { BelajarNextJsBackEndClient, Brand, Product } from '@/functions/swagger/BelajarNextJsBackEnd';

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    }),
    description: z.string().nonempty({
        message: 'Deskripsi tidak boleh kosong'
    }),
    price: z.number().min(1000, {
        message: 'Harga harus lebih dari 1000'
    }).max(100000000, {
        message: 'Harga tidak boleh lebih dari 100000000'
    }),
    quantity: z.number().min(1, {
        message: 'Quantity harus lebih dari 1'
    }).max(100, {
        message: 'Quantity tidak boleh lebih dari 100'
    }),
    brandId: z.string().nonempty({
        message: 'Brand tidak boleh kosong'
    })
});

type FormDataType = z.infer<typeof FormSchema>;

const EditForm: React.FC<{
    id: string,
    product: Product,
    onEdited: () => void
}> = ({ id, product, onEdited }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control } = useForm<FormDataType>({
            resolver: zodResolver(FormSchema),
            defaultValues: {
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                brandId: product.brandId
            }
        });

    async function onSubmit(data: FormDataType) {
        try {
            const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
            await client.updateProduct(id, {
                name: data.name,
                description: data.description,
                price: data.price,
                quantity: data.quantity,
                brandId: data.brandId
            });
            reset(data);
            onEdited();
            notification.success({
                message: 'Success',
                description: 'Succesfully edited product data',
                placement: 'bottomRight'
            })
        } catch (error) {
            console.error(error);
        }
    }

    const [search, setSearch] = useState('');
    const params = new URLSearchParams();
    params.append('search', search);
    const brandUri = '/api/be/api/Brands?' + params.toString();
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, isLoading, isValidating } = useSwr<Brand[]>(brandUri, fetcher);


    const setSearchDebounced = debounce((t: string) => setSearch(t), 300);

    const options = data?.map(Q => {
        return {
            label: Q.name,
            value: Q.id
        };
    }) ?? [{
        label: product.name,
        value: product.id
    }];

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor='name'>Name</label>
                <InputText {...register('name')} id='name'></InputText>
                <p className='mt-2 text-red-500'>{errors['name']?.message}</p>
            </div>
            <div>
                <label htmlFor='description'>Description</label>
                <InputText {...register('description')} id='description'></InputText>
                <p className='mt-2 text-red-500'>{errors['description']?.message}</p>
            </div>
            <div>
                <label htmlFor='price'>Price</label>
                <InputText {...register('price', { valueAsNumber: true })} id='price' type='number'></InputText>
                <p className='mt-2 text-red-500'>{errors['price']?.message}</p>
            </div>
            <div>
                <label htmlFor='quantity'>Quantity</label>
                <InputText {...register('quantity', { valueAsNumber: true })} id='quantity' type='number'></InputText>
                <p className='mt-2 text-red-500'>{errors['quantity']?.message}</p>
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
                            defaultValue={product.brandId}
                            optionFilterProp='children'
                            {...field}
                            onSearch={t => setSearchDebounced(t)}
                            options={options}
                            filterOption={false}
                            notFoundContent={(isLoading || isValidating) ? <Spin size='small' /> : null}
                        />
                    )}
                ></Controller>

                <p className='mt-2 text-red-500'>{errors['provinceId']?.message}</p>
            </div>
            <div className='mt-5'>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type='submit'>Submit</button>
            </div>
        </form>
    );
}

const IndexPage: Page = () => {

    const router = useRouter();
    const { id } = router.query;
    const productDetailUri = id ? `/api/be/api/Products/${id}` : undefined;
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, mutate } = useSwr<Product>(productDetailUri, fetcher);

    function renderForm() {
        if (!id || !data || typeof id !== 'string') {
            return;
        }
        return (
            <EditForm id={id} product={data} onEdited={() => mutate()}></EditForm>
        );
    }

    return (
        <div>
            <Title>Edit Product Data</Title>
            <Link href='/product'>Return to index</Link>
            <h2 className='mb-5 text-3xl'>Edit Product Data</h2>
            {renderForm()}
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
