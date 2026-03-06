export async function request(endpoint: string, options: RequestInit = {}) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (data.status !== 200) {
            throw data;
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const clinicService = {
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/clinic/add', {
            method: 'POST',
            body: params,
        });
    },
};

export const geoService = {
    getStates: () => {
        return request('/state');
    },
    getCities: (stateId: string | number) => {
        return request(`/city/${stateId}`);
    },
};
