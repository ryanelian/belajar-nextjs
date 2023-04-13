import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { SubmitButton } from '@/components/SubmitButton';
import { BelajarNextJsBackEndClient, Brand, Product } from '@/functions/swagger/BelajarNextJsBackEnd';
import { InputText } from '@/components/FormControl';
import { Select, Spin, notification } from 'antd';
import { useState } from 'react';
import useSwr from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    }),
    brandId: z.string({
        required_error: 'Brand Id tidak boleh kosong'
    }),
    description: z.string().nonempty({
        message: 'Description tidak boleh kosong'
    }),
    quantity: z.number({
        invalid_type_error: 'Quantity tidak boleh kosong'
    }).nonnegative({
        message: 'Quantity tidak boleh negatif'
    }).max(100, {
        message: 'Quantity tidak boleh lebih dari 100'
    }).min(0, {
        message: 'Quantity tidak boleh kurang dari 0'
    }),
    price: z.number({
        invalid_type_error: 'Price tidak boleh kosong'
    }).nonnegative({
        message: 'Quantity tidak boleh negatif'
    }).min(100, {
        message: 'Harga minimal 100'
    }).max(100000000, {
        message: 'Harga tidak boleh lebih dari 100 Juta'
    })
});

type FormDataType = z.infer<typeof FormSchema>;

const EditForm: React.FC<{
    id: string,
    product: Product,
    onEdit: () => void
}> = ({ id, product, onEdit }) => {
    const { handleSubmit, register, formState: { errors }, reset, control } = useForm<FormDataType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: product.name,
            brandId: product.brandId,
            description: product.description,
            quantity: product.quantity,
            price: product.price
        }
    });

    async function onSubmit(data: FormDataType) {
        try {
            const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
            await client.updateProduct(id, {
                name: data.name,
                brandId: data.brandId,
                description: data.description,
                quantity: data.quantity,
                price: data.price
            })
            reset(data);
            onEdit();
            notification.success({
                message: 'Success',
                description: 'Data Product Berhasil Diedit',
                placement: 'bottomRight'
            })
        } catch (error) {
            console.log(error)
        }

    }

    const [search, setSearch] = useState('');
    const params = new URLSearchParams();
    params.append('search', search);
    const brandsUri = '/api/be/api/Brands?' + params.toString();
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, isLoading, isValidating } = useSwr<Brand[]>(brandsUri, fetcher);

    // const options: { label: string, value: string }[] = [{
    //     label: 'Jakarta',
    //     value: '1234'
    // }]
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
            <div className="my-2">
                <label className="font-bold" htmlFor='name'>Name</label>
                <InputText id='name' {...register('name')}></InputText>
                <p className='text-red-500'>{errors['name']?.message}</p>
            </div>
            <div className='my-2'>
                <label className="font-bold" htmlFor='description'>Description</label>
                <InputText id='description' {...register('description')}></InputText>
                <p className='text-red-500'>{errors['description']?.message}</p>
            </div>
            <div className='my-2'>
                <label className="font-bold" htmlFor='brand'>Brand</label>
                <Controller control={control}
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
            <div className='my-2'>
                <label className="font-bold" htmlFor='quantity'>Quantity</label>
                <input type="number" inputMode='decimal' className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='quantity' {...register('quantity', { valueAsNumber: true })}></input>
                <p className='text-red-500'>{errors['quantity']?.message}</p>
            </div>
            <div className='my-2'>
                <label className="font-bold" htmlFor='price'>Price</label>
                <input type="number" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='price' {...register('price', { valueAsNumber: true })}></input>
                <p className='text-red-500'>{errors['price']?.message}</p>
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
    const productDetailUri = id ? `/api/be/api/Products/${id}` : undefined;
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, mutate } = useSwr<Product>(productDetailUri, fetcher);

    function renderForm() {
        if (!id || !data || typeof id !== 'string') {
            return;
        }

        return (
            <EditForm onEdit={() => mutate()} id={id} product={data}></EditForm>
        );
    }

    return (
        <div>
            <Title>Update Product</Title>
            <h2 className='mb-5 text-3xl'>Edit Product</h2>
            {renderForm()};
        </div>
    );
}

CreatePage.layout = WithDefaultLayout;
export default CreatePage;
