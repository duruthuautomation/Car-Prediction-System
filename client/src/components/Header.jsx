import React from "react";
import { useEffect } from 'react';
import { useState } from "react";

export default function Header() {

    const [data, setData] = useState("");

    useEffect(() => {
        fetch("/http-call", {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                setData(responseData.data);
                console.log(data);
            });
    });
    return <h4>
        {data ? data : "Hello"}
    </h4>
}