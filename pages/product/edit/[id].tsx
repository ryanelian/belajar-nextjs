import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '@/components/SubmitButton';
import { BelajarNextJsBackEndClient, Brand, Product, ProductDetailModel } from '@/functions/swagger/BelajarNextJsBackEnd';
import Link from 'next/link';
import { InputText } from '@/components/FormControl';
import { Select, Spin, notification } from 'antd';
import useSwr from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import debounce from 'lodash.debounce';
import { useState } from 'react';
import { useRouter } from 'next/router';

// C- Create
// R- Read
// U- Update
// D- Delete

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    }),
    description: z.string().nonempty({
        message: 'Deskripsi tidak boleh kosong'
    }),
    price: z.number().int({
        message: 'Harga harus angka dan tidak boleh kosong'
    }).nonnegative({
        message: 'Harga tidak boleh negative'
    }).max(100000000, {
        message: 'Harga tidak boleh lebih dari 1000000000'
    }),
    quantity: z.number().nonnegative({
        message: 'Kuantitas tidak boleh negative'
    }),
    brandId: z.string().nonempty({
        message: 'Brand Id tidak boleh kosong'
    })
});

type FormDataType = z.infer<typeof FormSchema>;


const EditForm: React.FC<{
    id: string,
    product: Product,
    onEdited: () => void,
}> = ({ id, product, onEdited }) => {

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control
    } = useForm<FormDataType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            brandId: product.brandId,
        }
    });

    async function onSubmit(data: FormDataType) {
        // console.log(data);

        try {
            const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
            await client.updateProduct(id, {
                name: data.name,
                description: data.description,
                price: data.price,
                quantity: data.quantity,
                brandId: data.brandId,

            });
            reset(data);
            onEdited();
            notification.success({
                message: 'Success',
                description: 'Successfully update product',
                placement: 'bottomRight',
            });
        } catch (error) {
            console.error(error);
        }
    }

    const [search, setSearch] = useState('');
    const params = new URLSearchParams();
    params.append('search', search);
    const provincesUri = '/api/be/api/Brands?' + params.toString();
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, isLoading, isValidating } = useSwr<Brand[]>(provincesUri, fetcher);

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
                <InputText id='name' {...register('name')}></InputText>
                <p className='text-red-500'>{errors['name']?.message}</p>
            </div>
            <div className='mt-2'>
                <label htmlFor='description'>Description</label>
                <InputText id='description' {...register('description')}></InputText>
                <p className='text-red-500'>{errors['description']?.message}</p>
            </div>
            <div className='mt-2'>
                <label htmlFor='price'>Price</label>
                <InputText id='price' {...register('price', { valueAsNumber: true })}></InputText>
                <p className='text-red-500'>{errors['price']?.message}</p>
            </div>
            <div className='mt-2'>
                <label htmlFor='quantity'>Quantity</label>
                <InputText id='quantity' {...register('quantity', { valueAsNumber: true })}></InputText>
                <p className='text-red-500'>{errors['quantity']?.message}</p>
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
            <div className='mt-5'>
                <SubmitButton>Submit</SubmitButton>
            </div>
        </form>
    )

}

const IndexPage: Page = () => {

    const router = useRouter();
    const { id } = router.query;
    const productDetailUri = id ? `/api/be/api/Products/${id}` : undefined;
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, mutate } = useSwr<ProductDetailModel>(productDetailUri, fetcher);

    function renderForm() {
        console.log(id);
        if (!id || !data || typeof id !== 'string') {
            return;
        }

        return (
            <EditForm id={id} product={data} onEdited={() => mutate()}></EditForm>
        );
    }

    return (
        <div>
            <Title>Create New Product</Title>
            <Link href='/product'>Return to Index</Link>

            <h2 className='mb-5 text-3xl'>Create New Product</h2>

            {renderForm()}
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
