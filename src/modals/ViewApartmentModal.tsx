import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';
import { IApartment } from '../models/apartment';

interface ViewApartmentModalProps {
    open: boolean;
    onClose: () => void;
    apartment: IApartment | null;
}

const ViewApartmentModal: React.FC<ViewApartmentModalProps> = ({ open, onClose, apartment }) => {
    if (!apartment) return null;

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="view-apartment-modal-title">
            <DialogTitle id="view-apartment-modal-title">Apartment Details</DialogTitle>
            <DialogContent dividers>
                <Typography variant="h6">Name: {apartment.name}</Typography>
                <Typography variant="body1">Rooms: {apartment.rooms}</Typography>
                <Typography variant="body1">Price: ${apartment.price}</Typography>
                <Typography variant="body1">Description: {apartment.description}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewApartmentModal;
