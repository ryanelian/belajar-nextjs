import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '@/components/SubmitButton';
import { BelajarNextJsBackEndClient, Product, ProductDetailModel, Brand } from '@/functions/swagger/BelajarNextJsBackEnd';
import Link from 'next/link';
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
    desc: z.string().nonempty({
        message: 'Deskripsi tidak boleh kosong'
    }),
    price: z.number()
    .int({
        message: 'Harga tidak boleh kosong dan harus angka'
    })
    .nonnegative({
        message: 'Harga tidak boleh kurang dari 0'
    })
    .max(1000000000, {
        message: 'Harga tidak boleh lebih dari 100.000.000'
    }),
    qty: z.number()
    .int({
        message: 'Kuantitas tidak boleh kosong dan harus angka'
    })
    .nonnegative({
        message: 'Kuantitas tidak boleh kurang dari 0'
    })
    .max(1000, {
        message: 'Harga tidak boleh lebih dari 1000'
    }),
    brandId: z.string().nonempty({
        message: 'Brand tidak boleh kosong'
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
        defaultValues: {
            name: product.name,
            desc: product.description,
            price: product.price,
            qty: product.quantity,
            brandId: product.brandId
        },
        resolver: zodResolver(FormSchema)
    });

    async function onSubmit(data: FormDataType) {
        try {
            const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
            await client.updateProduct(id, {
                name: data.name,
                description: data.desc,
                price: data.price,
                quantity: data.qty,
                brandId: data.brandId
            });
            reset(data);
            onEdited();
            notification.success({
                message: 'Success',
                description: 'Successfully edited product data',
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
            <div>
                <label htmlFor='desc'>Description</label>
                <InputText id='desc' {...register('desc')}></InputText>
                <p className='text-red-500'>{errors['desc']?.message}</p>
            </div>
            <div>
                <label htmlFor='price'>Price</label>
                <InputText id='price' {...register('price', {valueAsNumber: true})}></InputText>
                <p className='text-red-500'>{errors['price']?.message}</p>
            </div>
            <div>
                <label htmlFor='qty'>Quantity</label>
                <InputText id='qty' {...register('qty', {valueAsNumber: true})}></InputText>
                <p className='text-red-500'>{errors['qty']?.message}</p>
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
    );
};

const IndexPage: Page = () => {

    const router = useRouter();
    const { id } = router.query;
    const productDetailUri = id ? `/api/be/api/Products/${id}` : undefined;
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, mutate } = useSwr<ProductDetailModel>(productDetailUri, fetcher);

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
            <Link href='/product'>Return to Index</Link>

            <h2 className='mb-5 text-3xl'>Edit Product Data</h2>
            {renderForm()}
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
