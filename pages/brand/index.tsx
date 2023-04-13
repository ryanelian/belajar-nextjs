import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { BelajarNextJsBackEndClient, Brand } from '@/functions/swagger/BelajarNextJsBackEnd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';
import { Alert, Modal } from 'antd';
import { format, parseISO } from 'date-fns';
import { id as indonesianTime } from 'date-fns/locale';
import Link from 'next/link';
import useSwr from 'swr';

const BrandTableRow: React.FC<{
    brand: Brand,
    onDeleted: () => void
}> = ({ brand, onDeleted }) => {

    function onClickDelete() {
        Modal.confirm({
            title: `Confirm delete brand`,
            content: `Delete brand ${brand.name}?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                if (!brand?.id) {
                    return;
                }
                try {
                    const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be');
                    await client.deleteBrand(brand.id);
                    onDeleted();
                } catch (err) {
                    console.error(err);
                }

            },
        });
    }

    function formatDateTime() {
        const dt = brand.createdAt?.toString();
        if (!dt) {
            return;
        }


        const isoDate = parseISO(dt);
        return format(isoDate, 'd MMM yyy HH:mm:ss', {
            locale: indonesianTime
        });
    }

    return (
        <tr>
            <td className="border px-4 py-2">{brand.id}</td>
            <td className="border px-4 py-2">{brand.name}</td>
            <td className="border px-4 py-2">{formatDateTime()}</td>
            <td className="border px-4 py-2">
                <Link href={`/brand/edit/${brand.id}`} className="mr-2 py-1 px-2 text-xs bg-blue-500 text-white rounded-lg">
                    <FontAwesomeIcon className='mr-1' icon={faEdit}></FontAwesomeIcon>
                    Edit
                </Link>
                <button className="py-1 px-2 text-xs bg-red-500 text-white rounded-lg" onClick={onClickDelete}>
                    <FontAwesomeIcon className='mr-1' icon={faRemove}></FontAwesomeIcon>
                    Delete
                </button>
            </td>
        </tr>
    );
};

const IndexPage: Page = () => {
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data, error, mutate } = useSwr<Brand[]>('/api/be/api/Brands', swrFetcher);

    return (
        <div>
            <Title>Manage Brand</Title>
            <div>
                <Link href='/brand/create' className='mb-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    <FontAwesomeIcon className='mr-1' icon={faPlus}></FontAwesomeIcon>
                    Create New Brand
                </Link>
            </div>

            {Boolean(error) && <Alert type='error' message='cannot get province data' description={error}></Alert>}
            {/* <pre>{JSON.stringify(data, undefined, 4)}</pre> */}
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>ID</th>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Created At</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((x, i) => <BrandTableRow key={i} brand={x} onDeleted={() => mutate()}></BrandTableRow>)}
                </tbody>
            </table>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;