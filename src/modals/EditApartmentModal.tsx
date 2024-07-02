import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from '@mui/material';
import { IApartment, IApartmentDto } from '../models/apartment';
import { updateApartment } from '../store/actions/apartmentActions';
import { toast } from 'react-toastify';
import {
    validateApartmentName,
    validateDescription,
    validateNumberOfRooms,
    validatePrice,
} from '../validation/apartmentValidation';

interface EditApartmentModalProps {
    open: boolean;
    onClose: () => void;
    apartment: IApartment;
    onSave: (updatedApartment: IApartment) => void;
}

const EditApartmentModal: React.FC<EditApartmentModalProps> = ({ open, onClose, apartment, onSave }) => {
    const [editedApartment, setEditedApartment] = useState<Partial<IApartmentDto>>({
        rooms: apartment?.rooms ?? 0,
        name: apartment?.name ?? '',
        price: apartment?.price ?? 0,
        description: apartment?.description ?? '',
    });

    useEffect(() => {
        setEditedApartment({
            rooms: apartment?.rooms ?? 0,
            name: apartment?.name ?? '',
            price: apartment?.price ?? 0,
            description: apartment?.description ?? '',
        });
    }, [apartment]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedApartment({ ...editedApartment, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const nameError = validateApartmentName(editedApartment.name || '');
        const roomsError = validateNumberOfRooms(Number(editedApartment.rooms));
        const priceError = validatePrice(Number(editedApartment.price));
        const descriptionError = validateDescription(editedApartment.description || '');

        if (nameError || roomsError || priceError || descriptionError) {
            if (nameError) toast.error(nameError);
            if (roomsError) toast.error(roomsError);
            if (priceError) toast.error(priceError);
            if (descriptionError) toast.error(descriptionError);
            return;
        }

        try {
            const updatedApartment = await updateApartment(apartment.id, {
                rooms: Number(editedApartment.rooms),
                name: editedApartment.name || '',
                price: Number(editedApartment.price),
                description: editedApartment.description || '',
            });
            onSave(updatedApartment);
            onClose();
        } catch (error) {
            console.error('Error updating apartment:', error);
            toast.error('Failed to update apartment');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Apartment</DialogTitle>
            <DialogContent>
                <TextField
                    label="Apartment Name"
                    name="name"
                    value={editedApartment.name || ''}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!validateApartmentName(editedApartment.name || '')}
                    helperText={validateApartmentName(editedApartment.name || '')}
                />

                <TextField
                    label="Number of Rooms"
                    name="rooms"
                    type="number"
                    value={editedApartment.rooms || ''}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!validateNumberOfRooms(Number(editedApartment.rooms))}
                    helperText={validateNumberOfRooms(Number(editedApartment.rooms))}
                />

                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={editedApartment.price || ''}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!validatePrice(Number(editedApartment.price))}
                    helperText={validatePrice(Number(editedApartment.price))}
                />

                <TextField
                    label="Description"
                    name="description"
                    value={editedApartment.description || ''}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!validateDescription(editedApartment.description || '')}
                    helperText={validateDescription(editedApartment.description || '')}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditApartmentModal;
