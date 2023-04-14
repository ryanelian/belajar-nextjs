import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '@/components/SubmitButton';
import { BelajarNextJsBackEndClient, CityDetailModel, Province } from '@/functions/swagger/BelajarNextJsBackEnd';
import Link from 'next/link';
import { Select, Spin, notification } from 'antd';
import { useState } from 'react';
import useSwr from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
// C- Create
// R- Read
// U- Update
// D- Delete

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    }),
    provinceId: z.string().nonempty({
        message: 'Province Id tidak boleh kosong'
    }),
});

type FormDataType = z.infer<typeof FormSchema>;

const EditForm: React.FC<{
    id: string
    city: CityDetailModel
    onEdited: () => void
}> = ({ id, city, onEdited }) => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control
    } = useForm<FormDataType>({
        defaultValues: {
            name: city.name,
            provinceId: city.provinceId
        },
        resolver: zodResolver(FormSchema)
    });

    async function onSubmit(data: FormDataType) {
        // console.log(data);

        try {
            const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
            await client.updateCity(id, {
                name: data.name,
                provinceId: data.provinceId
            });
            reset(data);
            onEdited();
            notification.success({
                message: 'Success',
                description: 'Data berhasil diubah',
                placement: 'bottomRight'
            });
        } catch (error) {
            console.error(error);
        }
    }
    const [search, setSearch] = useState('');
    const params = new URLSearchParams();
    params.append('search', search);
    const provinceUri = '/api/be/api/Provinces?' + params.toString();
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, isLoading, isValidating } = useSwr<Province[]>(provinceUri, fetcher);


    const setSearchDebounced = debounce((t: string) => setSearch(t), 300);

    const options = data?.map(Q => {
        return {
            label: Q.name,
            value: Q.id
        };
    }) ?? [{
        label: city.provinceName,
        value: city.provinceId
    }];

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' id='name' {...register('name')}></input>
                    <p className='text-red-500'>{errors['name']?.message}</p>
                </div>
                <div className="mt-5">
                    <label htmlFor='province'>Province</label>
                    <Controller
                        control={control}
                        name='provinceId'
                        render={({ field }) => (
                            <Select
                                className='block'
                                showSearch
                                placeholder='Select a province'
                                optionFilterProp='children'

                                {...field}


                                onSearch={t => setSearchDebounced(t)}
                                options={options}
                                filterOption={false}
                                notFoundContent={(isLoading || isValidating) ? <Spin size='small' /> : null}
                            />
                        )}
                    ></Controller>



                    <p className='text-red-500'>{errors['provinceId']?.message}</p>
                </div>

                <div className='mt-5'>
                    <SubmitButton>Submit</SubmitButton>
                </div>
                <p>
                    {provinceUri}
                </p>
                <p>
                    {JSON.stringify(data)}
                </p>
            </form>
        </div>
    );
}


const IndexPage: Page = () => {
    const router = useRouter();
    const { id } = router.query;
    const cityDetailUri = id ? `/api/be/api/Cities/${id}` : undefined;
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, mutate } = useSwr<CityDetailModel>(cityDetailUri, fetcher);

    function renderForm() {
        if (!id || !data || typeof id !== 'string') {
            return;
        }
        return (
            <EditForm id={id} city={data} onEdited={() => mutate()}></EditForm>
        );
    }

    return (
        <div>
            <Title>Edit City Data</Title>
            <Link href='/city'>Return to Index</Link>

            <h2 className="mb-5 text-3xl">Edit City Data</h2>
            {renderForm()}
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
