import Link from 'next/link';
import { WithDefaultLayout } from '../components/DefautLayout';
import { Page } from '../types/Page';
import useSwr from 'swr';
import { Alert, Button, Spin } from 'antd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
// import { Authorize } from '@/components/Authorize';

const InnerSwrPage: React.FC = () => {

    // Teknik Tradisional:

    // const [data, setData] = useState<Record<string, string>>({});
    // const isMounted = useRef(false);
    // const [isLoading, setIsloading] = useState(false);
    // const [error, setError] = useState('');

    // useEffect(() => {
    //     isMounted.current = true;
    //     return () => {
    //         isMounted.current = false;
    //     }
    // }, []);

    // useEffect(() => {
    //     async function getData() {
    //         // ketika halaman dibuka...
    //         const apiUri = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json';
    //         try {
    //             setIsloading(true);
    //             const response = await fetch(apiUri);
    //             const value = await response.json();
    //             setIsloading(false);
    //             if (isMounted.current) {
    //                 setData(value);
    //             }
    //         } catch (err) {
    //             setError(String(err));
    //         }
    //     }
    //     getData();
    // }, []);

    // Teknik Modern:

    // const apiUri = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json';
    // const fetcher = url => fetch(url).then(r => r.json());
    const fetcher = useSwrFetcherWithAccessToken();
    const { data, error, isLoading, isValidating, mutate } = useSwr('/api/fake2', fetcher, {
        refreshInterval: 10_000
    });

    return (
        <div>
            <Link href='/'>Ke Halaman Index</Link>

            <p>
                <Button onClick={() => mutate()}>Refresh Data</Button>
            </p>

            {error && <Alert type='error' showIcon message='Error' description={error}></Alert>}
            {isLoading && <Spin size='large'></Spin>}
            {isValidating && <Spin size='large'></Spin>}
            {data && <pre>{JSON.stringify(data, undefined, 4)}</pre>}
        </div>
    );
}

const SwrPage: Page = () => {
    return (
        // <Authorize>
        <InnerSwrPage></InnerSwrPage>
        // </Authorize>
    );
}

SwrPage.layout = WithDefaultLayout;
export default SwrPage;
