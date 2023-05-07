import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useUpdate = () => {

    const { user } = useAuthContext();

    const [error, setError] = useState(null);

    const update = async (fname, lname, email, password, confirmPassword) => {
        setError(null);

        const response = await fetch('http://localhost:4000/api/user/' + user.id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fname, lname, email, password, confirmPassword })
        })
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        }
        if (response.ok) {
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json));
        }
    }

    return { update, error };

}