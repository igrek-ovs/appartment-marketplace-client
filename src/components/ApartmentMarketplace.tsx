import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    SelectChangeEvent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { IApartment, IApartmentDto } from '../models/apartment';
import {
    getApartmentsByFilter,
    addApartment,
    deleteApartment,
    setSelectedApartment,
} from '../slices/apartmentSlice';
import { RootState, AppDispatch } from '../store/store';
import { toast } from 'react-toastify';
import {
    validateApartmentName,
    validateDescription,
    validateNumberOfRooms,
    validatePrice,
} from '../validation/apartmentValidation';
import EditApartmentModal from '../modals/EditApartmentModal';
import ViewApartmentModal from '../modals/ViewApartmentModal';

const ApartmentMarketplace: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { apartments, selectedApartment, loading, error } = useSelector((state: RootState) => state.apartments);
    const [newApartment, setNewApartment] = useState<IApartmentDto>({
        rooms: 0,
        name: '',
        price: 0,
        description: '',
    });
    const [priceSort, setPriceSort] = useState<string>('asc');
    const [filterRooms, setFilterRooms] = useState<number | undefined>(undefined);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getApartmentsByFilter({ priceSort, rooms: filterRooms }));
    }, [dispatch, priceSort, filterRooms]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewApartment({ ...newApartment, [e.target.name]: e.target.value });
    };

    const handleAddApartment = async () => {
        const nameError = validateApartmentName(newApartment.name);
        const roomsError = validateNumberOfRooms(newApartment.rooms);
        const priceError = validatePrice(newApartment.price);
        const descriptionError = validateDescription(newApartment.description);

        if (nameError || roomsError || priceError || descriptionError) {
            if (nameError) toast.error(nameError);
            if (roomsError) toast.error(roomsError);
            if (priceError) toast.error(priceError);
            if (descriptionError) toast.error(descriptionError);
            return;
        }

        dispatch(addApartment(newApartment));
        setNewApartment({ rooms: 0, name: '', price: 0, description: '' });
    };

    const handleDeleteApartment = (id: string) => {
        dispatch(deleteApartment(id));
    };

    const handleEditApartment = (apartment: IApartment) => {
        dispatch(setSelectedApartment(apartment));
        setIsEditModalOpen(true);
    };

    const handleSaveEditedApartment = (updatedApartment: IApartment) => {
        setIsEditModalOpen(false);
    };

    const handleViewApartment = (apartment: IApartment) => {
        dispatch(setSelectedApartment(apartment));
        setIsViewModalOpen(true);
    };

    const handleSortChange = (e: SelectChangeEvent<string>) => {
        setPriceSort(e.target.value as string);
    };

    const handleRoomsFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setFilterRooms(value === 0 ? undefined : value);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        dispatch(setSelectedApartment(null));
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        dispatch(setSelectedApartment(null));
    };

    return (
        <Container>
            <Box mb={4}>
                <Typography variant="h4" gutterBottom>
                    Add New Apartment
                </Typography>
                <TextField
                    label="Apartment Name"
                    name="name"
                    value={newApartment.name}
                    onChange={handleInputChange}
                    margin="normal"
                    sx={{ marginRight: '20px' }}
                />
                <TextField
                    label="Number of Rooms"
                    name="rooms"
                    type="number"
                    value={newApartment.rooms}
                    onChange={handleInputChange}
                    margin="normal"
                    sx={{ marginRight: '20px' }}
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={newApartment.price}
                    onChange={handleInputChange}
                    margin="normal"
                />
                <TextField
                    label="Description"
                    name="description"
                    value={newApartment.description}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddApartment}
                    disabled={loading}
                >
                    Add
                </Button>
            </Box>
            <Box mb={4}>
                <Typography variant="h4" gutterBottom>
                    Available Apartments ({apartments.length})
                </Typography>
                <FormControl margin="normal" sx={{ marginRight: '20px' }}>
                    <InputLabel>Sort by Price</InputLabel>
                    <Select value={priceSort} onChange={handleSortChange}>
                        <MenuItem value="asc">Price - lowest to highest</MenuItem>
                        <MenuItem value="desc">Price - highest to lowest</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Filter by Rooms"
                    type="number"
                    value={filterRooms || ''}
                    onChange={handleRoomsFilterChange}
                    margin="normal"
                />
                <List>
                    {apartments.map(apartment => (
                        <ListItem key={apartment.id}>
                            <ListItemText
                                primary={apartment.name}
                                secondary={`Rooms: ${apartment.rooms}, Price: ${apartment.price}, Description: ${apartment.description}`}
                            />
                            <IconButton edge="end" aria-label="view" onClick={() => handleViewApartment(apartment)}>
                                <InfoIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEditApartment(apartment)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteApartment(apartment.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <EditApartmentModal
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                apartment={selectedApartment as IApartment}
                onSave={handleSaveEditedApartment}
            />
            <ViewApartmentModal
                open={isViewModalOpen}
                onClose={handleCloseViewModal}
                apartment={selectedApartment as IApartment}
            />
        </Container>
    );
};

export default ApartmentMarketplace;
