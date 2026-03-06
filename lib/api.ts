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


export const patientService = {
    // Sabhi patients ki list
    getAll: () => request('/patient/list'),

    // Naya patient add karo
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/patient/add', {
            method: 'POST',
            body: params,
        });
    },

    // ID se ek patient ka detail
    getById: (id: string) => request(`/patient/${id}`),

    // Patient update karo
    update: (id: string, formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/patient/update/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // Patient delete karo
    delete: (id: string) => request(`/patient/delete/${id}`, {
        method: 'DELETE',
    }),
}; 



export const doctorService = {
    // Sabhi doctors ki list
    getAll: () => request('/doctor/list'),

    // Naya doctor add karo
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/doctor/add', {
            method: 'POST',
            body: params,
        });
    },

    // ID se ek doctor ka detail
    getById: (id: string) => request(`/doctor/${id}`),

    // Doctor update karo
    update: (id: string, formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/doctor/update/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // Doctor delete karo
    delete: (id: string) => request(`/doctor/delete/${id}`, {
        method: 'DELETE',
    }),
}; 


export const billingService = {
    // Sabhi bills ki list
    getAll: () => request('/billing/list'),

    // Naya bill create karo
    add: (formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request('/billing/add', {
            method: 'POST',
            body: params,
        });
    },

    // ID se ek bill ka detail
    getById: (id: string) => request(`/billing/${id}`),

    // Bill update karo
    update: (id: string, formData: any) => {
        const params = new URLSearchParams(formData).toString();
        return request(`/billing/update/${id}`, {
            method: 'PUT',
            body: params,
        });
    },

    // Bill delete karo
    delete: (id: string) => request(`/billing/delete/${id}`, {
        method: 'DELETE',
    }),
};