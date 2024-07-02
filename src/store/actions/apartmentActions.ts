import {instance} from "../api";
import {IApartment, IApartmentDto} from "../../models/apartment";
import {toast} from "react-toastify";
import {Dispatch} from "redux";


export const FETCH_APARTMENTS_SUCCESS = 'FETCH_APARTMENTS_SUCCESS';
export const ADD_APARTMENT_SUCCESS = 'ADD_APARTMENT_SUCCESS';
export const DELETE_APARTMENT_SUCCESS = 'DELETE_APARTMENT_SUCCESS';
export const UPDATE_APARTMENT_SUCCESS = 'UPDATE_APARTMENT_SUCCESS';

export const fetchApartmentsSuccess = (apartments: IApartment[]) => ({
    type: FETCH_APARTMENTS_SUCCESS,
    payload: apartments,
});

export const addApartmentSuccess = (apartment: IApartment) => ({
    type: ADD_APARTMENT_SUCCESS,
    payload: apartment,
});

export const deleteApartmentSuccess = (id: string) => ({
    type: DELETE_APARTMENT_SUCCESS,
    payload: id,
});


export const updateApartmentSuccess = (apartment: IApartment) => ({
    type: UPDATE_APARTMENT_SUCCESS,
    payload: apartment,
});

export const fetchApartments = () => async (dispatch: Dispatch) => {
    try {
        const response = await getApartmentsByFilter('asc');
        dispatch(fetchApartmentsSuccess(response));
    } catch (error:any) {
        toast.error('Error fetching apartments:', error);
    }
};

export const getApartmentsByFilter = async (priceSort: string, rooms?: number): Promise<IApartment[]> => {
    try {
        const response = await instance.get<IApartment[]>(`/apartments`, {
            params: {
                priceSort,
                rooms,
            },
        });
        return response.data;
    } catch (error: any) {
        toast.error("Error fetching apartments:", error);
        if (error.response) {
            toast.error("Response data:", error.response.data);
            toast.error("Response status:", error.response.status);
            toast.error("Response headers:", error.response.headers);
        } else if (error.request) {
            toast.error("Request data:", error.request);
        } else {
            // Произошла ошибка при настройке запроса
            toast.error("Error message:", error.message);
        }
        throw error;
    }
};

export const getApartmentById = async (id: string): Promise<IApartment> => {
    try {
        const response = await instance.get<IApartment>(`/apartments/${id}`);
        return response.data;
    } catch (error: any) {
        toast.error("Error fetching apartment:", error);
        if (error.response) {
            toast.error("Response data:", error.response.data);
            toast.error("Response status:", error.response.status);
            toast.error("Response headers:", error.response.headers);
        } else if (error.request) {
            toast.error("Request data:", error.request);
        } else {
            toast.error("Error message:", error.message);
        }
        throw error;
    }
}

export const addApartment = async (apartmentDto: IApartmentDto): Promise<IApartment> => {
    try {
        const response = await instance.post<IApartment>('/apartments', apartmentDto);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && Array.isArray(error.response.data)) {
            const errorMessages:string[] = error.response.data;
            toast.error('Error adding apartment:');
            errorMessages.forEach(errorMessage => toast.error(errorMessage));
        } else {
            console.error('Error adding apartment:', error);
            toast.error('Failed to add apartment');
        }
        throw new Error(error.response);
    }
};


export const deleteApartment = async (id: string): Promise<boolean> => {
    try {
        const response = await instance.delete(`/apartments/${id}`);
        toast.success('Apartment deleted successfully');
        return response.data;
    } catch (error: any) {
        toast.error('Error deleting apartment:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete apartment');
    }
}

export const updateApartment = async (id: string, apartmentDto: IApartmentDto): Promise<IApartment> => {
    try {
        const response = await instance.put<IApartment>(`/apartments/${id}`, apartmentDto);
        toast.success('Apartment updated successfully');
        return response.data;
    } catch (error: any) {
        console.error('Error updating apartment:', error);
        throw new Error(error.response?.data?.message || 'Failed to update apartment');
    }
};










