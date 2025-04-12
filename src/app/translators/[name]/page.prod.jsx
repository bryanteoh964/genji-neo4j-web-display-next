'use client'
import React, { useState, useEffect } from 'react';
import FormatText from "../../../components/FormatText.prod"

const TranslatorPage = ({ params }) => {
    const { name } = params;
    const [bio, setBio] = useState(null);

    useEffect(() => {
        const fetchBio = async () => {
            const res = await fetch(`/api/translators?name=${name}`);
            const data = await res.json();
            setBio(data.bio);
        };
        fetchBio();
    }, [name]);

    return (
        <div>
            <h1>{name}</h1>
            <FormatText content={bio} />
        </div>
    )
}

export default TranslatorPage;
