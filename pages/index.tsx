import { WithDefaultLayout } from '../components/DefautLayout';
import { Title } from '../components/Title';
import { Page } from '../types/Page';
import { Authorize } from '@/components/Authorize';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSwr from 'swr';
import { BelajarNextJsBackEndClient, ProductDataGridItem } from '@/functions/swagger/BelajarNextJsBackEnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { notification } from 'antd';
import { useAuthorizationContext } from '@/functions/AuthorizationContext';

const ProductDisplayItem: React.FC<{
    product: ProductDataGridItem
}> = ({ product }) => {

    const [qty, setQty] = useState(1);

    const { accessToken } = useAuthorizationContext();

    async function addToCart() {
        const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be', {
            fetch(url, init) {
                if (init && init.headers){
                    init.headers['Authorization'] = `Bearer ${accessToken}`
                }
                return fetch(url, init);
            }
        });
        try {
            await client.addToCart({
                productId: product.id,
                qty: qty
            });
            notification.success({
                type: 'success',
                placement: 'bottomRight',
                message: 'Added to cart',
                description: `Added ${qty} ${product.name} to cart`
            });
        } catch (err) {
            notification.error({
                type: 'error',
                placement: 'bottomRight',
                message: 'Failed to add to cart',
                description: String(err)
            });
        }
    }

    return (
        <div className='border border-gray-400 rounded-xl p-6 flex flex-col items-center bg-white shadow-lg'>
            <div className='bg-slate-400 h-[160px] w-full'></div>
            <div className='mt-4 font-bold'>{product.name}</div>
            <div className='mt-4'>{'Rp.' + product.price?.toLocaleString()}</div>
            <div className='mt-4 w-full flex'>
                <div className='flex-[1]'>
                    <input value={qty} type='number' onChange={t => setQty(t.target.valueAsNumber)}
                        className='block w-full p-1 text-sm rounded-md border-gray-500 border-solid border'></input>
                </div>
                <div className='flex-[3] pl-2'>
                    <button onClick={addToCart} className='block w-full p-1 text-sm rounded-md bg-blue-500 active:bg-blue-700 text-white' type='button'>
                        <FontAwesomeIcon icon={faCartPlus} className='mr-3'></FontAwesomeIcon>
                        Add to cart
                    </button>
                </div>

            </div>
        </div>
    );
};

const InnerIndexPage: React.FC = () => {
    const fetcher = useSwrFetcherWithAccessToken();
    const { data } = useSwr<ProductDataGridItem[]>('/api/be/api/Products', fetcher);

    return (
        <div>
            <Title>Home</Title>
            <div className='grid grid-cols-5 gap-5'>
                {data?.map((x, i) => <ProductDisplayItem key={i} product={x} />)}
            </div>
        </div>
    );
}

const IndexPage: Page = () => {
    return (
        <Authorize>
            <InnerIndexPage></InnerIndexPage>
        </Authorize>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
