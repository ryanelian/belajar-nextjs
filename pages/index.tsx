import { Link } from 'tabler-icons-react';
import { WithDefaultLayout } from '../components/DefautLayout';
import { Title } from '../components/Title';
import { Page } from '../types/Page';

const IndexPage: Page = () => {
    return (
        <div>
            <Title>Home</Title>
            Hello World!
            <ul>
                <li>
                    <Link href='/navigasi'>Ke Halaman Belajar Navigasi</Link>
                </li>
                <li>
                    <Link href='/tailwind'>Ke Halaman Belajar Tailwind</Link>
                </li>
                <li>
                    <Link href='/form'>Ke Halaman Belajar Form</Link>
                </li>
                <li>
                    <Link href='/hook-form'>Ke Halaman Belajar Hook Form</Link>
                </li>
                <li>
                    <Link href='/swr'>Ke Halaman Belajar SWR</Link>
                </li>
                <li>
                    <Link href='/province'>Ke Halaman Province</Link>
                </li>
            </ul>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
