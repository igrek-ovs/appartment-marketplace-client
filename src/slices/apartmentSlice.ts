import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IApartment, IApartmentDto } from '../models/apartment';
import { instance } from '../store/api';
import { toast } from 'react-toastify';

interface ApartmentState {
    apartments: IApartment[];
    selectedApartment: IApartment | null;
    loading: boolean;
    error: string | null;
}

const initialState: ApartmentState = {
    apartments: JSON.parse(localStorage.getItem('apartments') || '[]'),
    selectedApartment: null,
    loading: false,
    error: null,
};

export const getApartmentsByFilter = createAsyncThunk(
    'apartments/getByFilter',
    async ({ priceSort, rooms }: { priceSort: string; rooms?: number }, { rejectWithValue }) => {
        try {
            const response = await instance.get<IApartment[]>('/apartments', {
                params: {
                    priceSort,
                    rooms,
                },
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                toast.error("Response data:", error.response.data);
                toast.error("Response status:", error.response.status);
                toast.error("Response headers:", error.response.headers);
            } else if (error.request) {
                toast.error("Request data:", error.request);
            } else {
                toast.error("Error message:", error.message);
            }
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getApartmentById = createAsyncThunk(
    'apartments/getById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await instance.get<IApartment>(`/apartments/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                toast.error("Response data:", error.response.data);
                toast.error("Response status:", error.response.status);
                toast.error("Response headers:", error.response.headers);
            } else if (error.request) {
                toast.error("Request data:", error.request);
            } else {
                toast.error("Error message:", error.message);
            }
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addApartment = createAsyncThunk(
    'apartments/add',
    async (apartmentDto: IApartmentDto, { rejectWithValue }) => {
        try {
            const response = await instance.post<IApartment>('/apartments', apartmentDto);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data && Array.isArray(error.response.data)) {
                const errorMessages: string[] = error.response.data;
                toast.error('Error adding apartment:');
                errorMessages.forEach(errorMessage => toast.error(errorMessage));
            } else {
                console.error('Error adding apartment:', error);
                toast.error('Failed to add apartment');
            }
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteApartment = createAsyncThunk(
    'apartments/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await instance.delete(`/apartments/${id}`);
            toast.success('Apartment deleted successfully');
            return id;
        } catch (error: any) {
            toast.error('Error deleting apartment:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const updateApartment = createAsyncThunk(
    'apartments/update',
    async ({ id, apartmentDto }: { id: string; apartmentDto: IApartmentDto }, { rejectWithValue }) => {
        try {
            const response = await instance.put<IApartment>(`/apartments/${id}`, apartmentDto);
            toast.success('Apartment updated successfully');
            return response.data;
        } catch (error: any) {
            console.error('Error updating apartment:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const apartmentSlice = createSlice({
    name: 'apartments',
    initialState,
    reducers: {
        setSelectedApartment: (state, action: PayloadAction<IApartment | null>) => {
            state.selectedApartment = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getApartmentsByFilter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getApartmentsByFilter.fulfilled, (state, action: PayloadAction<IApartment[]>) => {
                state.loading = false;
                state.apartments = action.payload;
            })
            .addCase(getApartmentsByFilter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getApartmentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getApartmentById.fulfilled, (state, action: PayloadAction<IApartment>) => {
                state.loading = false;
                state.selectedApartment = action.payload;
            })
            .addCase(getApartmentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addApartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addApartment.fulfilled, (state, action: PayloadAction<IApartment>) => {
                state.loading = false;
                state.apartments.push(action.payload);
                localStorage.setItem('apartments', JSON.stringify(state.apartments));
            })
            .addCase(addApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteApartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteApartment.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.apartments = state.apartments.filter(apartment => apartment.id !== action.payload);
                localStorage.setItem('apartments', JSON.stringify(state.apartments));
            })
            .addCase(deleteApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateApartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateApartment.fulfilled, (state, action: PayloadAction<IApartment>) => {
                state.loading = false;
                const index = state.apartments.findIndex(apartment => apartment.id === action.payload.id);
                if (index !== -1) {
                    state.apartments[index] = action.payload;
                    localStorage.setItem('apartments', JSON.stringify(state.apartments));
                }
            })
            .addCase(updateApartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSelectedApartment } = apartmentSlice.actions;

export default apartmentSlice.reducer;
