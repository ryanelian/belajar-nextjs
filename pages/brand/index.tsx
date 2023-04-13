import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import useSwr from 'swr';
import Link from 'next/link';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Alert, Modal } from 'antd';
import { BelajarNextJsBackEndClient, Brand } from '@/functions/swagger/BelajarNextJsBackEnd';
import { format, parseISO } from 'date-fns';
import { id as indonesianTime } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';

const BrandTableRow: React.FC<{
    brand: Brand,
    onDeleted: () => void
}> = ({ brand, onDeleted }) => {

    function onClickDelete() {
        Modal.confirm({
            title: 'Confirm Delete',
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
            onCancel() {
                console.log('No');
            },
        });
    }

    function formatDateTime() {
        const dt = brand.createdAt?.toString();
        if (!dt) {
            return;
        }
        const isoDate = parseISO(dt);

        return format(isoDate, 'd MMMM yyy HH:mm:ss', {
            locale: indonesianTime
        });
    }

    return (
        <tr>
            <td className="border px-4 py-2">{brand.id}</td>
            <td className="border px-4 py-2">{brand.name}</td>
            <td className="border px-4 py-2">{formatDateTime()}</td>
            <td className="border px-4 py-2">
                <Link href={`/brand/edit/${brand.id}`} className="inline-block py-1 px-2 text-xs bg-blue-500 text-white rounded-lg">
                    <FontAwesomeIcon className='mr-1' icon={faEdit}></FontAwesomeIcon>
                    Edit
                </Link>
                <button onClick={onClickDelete} className="ml-1 py-1 px-2 text-xs bg-red-500 text-white rounded-lg">
                    <FontAwesomeIcon className='mr-1' icon={faRemove}></FontAwesomeIcon>
                    Delete
                </button>
            </td>
        </tr>
    );
}

const IndexPage: Page = () => {
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data, error, mutate } = useSwr<Brand[]>('/api/be/api/Brands', swrFetcher);

    return (
        <div>
            <Title>Manage Brand</Title>
            <h2 className='mb-5 text-3xl font-bold text-blue-800'>Manage Brands</h2>
            <div>
                <Link href='/brand/create' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block'>
                    <FontAwesomeIcon icon={faPlus} className='mr-2'></FontAwesomeIcon>
                    Create New Brand
                </Link>
            </div>

            {Boolean(error) && <Alert type='error' message='cannot get provinces data' description={String(error)}></Alert>}
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>ID</th>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>CreatedAt</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((x, value) => <BrandTableRow key={value} brand={x} onDeleted={() => mutate()}></BrandTableRow>)}
                </tbody>
            </table>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
