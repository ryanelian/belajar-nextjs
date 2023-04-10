import { WithDefaultLayout } from '../components/DefautLayout';
import { Page } from '../types/Page';
import { useRouter } from 'next/router';
import styles from './tailwind.module.css';

const TailwindPage: Page = () => {

    const router = useRouter();

    function pindahHalaman() {
        router.push('/');
    }

    return (
        <div>
            <div className={styles['red']}>
                Hello!
            </div>
            <div className='text-red-500 hover:text-green-500 mt-5'>
                Hello Tailwind!
            </div>
            <div className='w-[100px] h-[100px] bg-black mt-5'>

            </div>
            <button className='mt-5 relative inline-flex text-sm sm:text-base rounded-full font-medium border-2 border-transparent transition-colors outline-transparent focus:outline-transparent disabled:opacity-50 disabled:pointer-events-none disabled:hover:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        text-white bg-[#4040F2] hover:bg-[#3333D1] focus:border-[#B3B3FD] focus:bg-[#4040F2] px-4 py-1 sm:py-1.5 sm:px-5' onClick={pindahHalaman} type='button'>Ke Halaman Index</button>
        </div>
    );
}

TailwindPage.layout = WithDefaultLayout;
export default TailwindPage;
