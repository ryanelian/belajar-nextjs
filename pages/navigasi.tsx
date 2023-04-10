import { WithDefaultLayout } from '@/components/DefautLayout';
import { Page } from '@/types/Page';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const pinkButton: React.CSSProperties = {
    border: 1,
    borderStyle: 'solid',
    backgroundColor: '#fee',
    padding: 16,
    borderColor: '#fdd',
    borderRadius: 8
};

const NavigasiPage: Page = () => {

    const router = useRouter();

    function pindahHalaman() {
        router.push('/');
    }

    return (
        <div>
            <div style={{
                marginBottom: 64
            }}>
                Ini Product Page!!
            </div>
            <div style={{
                marginBottom: 64
            }}>
                <Link href='/'>Ke Halaman Index</Link>
            </div>
            <div style={{
                marginBottom: 64
            }}>
                <button style={pinkButton} onClick={pindahHalaman} type='button'>Ke Halaman Index</button>
            </div>
        </div>
    );
};

NavigasiPage.layout = WithDefaultLayout;

export default NavigasiPage;
