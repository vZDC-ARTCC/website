import React from 'react';
import logo from '@/public/img/logo.png';
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/">
            <Image src={logo} alt={"Washington ARTCC Logo"} width={215} height={39}/>
        </Link>
    );
}