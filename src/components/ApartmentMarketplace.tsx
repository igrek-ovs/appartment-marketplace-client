import React, { useState, useEffect } from 'react';
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
import { getApartmentsByFilter, addApartment, deleteApartment, updateApartment } from '../store/actions/apartmentActions';
import { toast } from 'react-toastify';
import {
    validateApartmentName,
    validateDescription,
    validateNumberOfRooms,
    validatePrice
} from "../validation/apartmentValidation";
import EditApartmentModal from '../modals/EditApartmentModal';
import ViewApartmentModal from '../modals/ViewApartmentModal';

const ApartmentMarketplace: React.FC = () => {
    const [apartments, setApartments] = useState<IApartment[]>([]);
    const [newApartment, setNewApartment] = useState<IApartmentDto>({
        rooms: 0,
        name: '',
        price: 0,
        description: '',
    });
    const [priceSort, setPriceSort] = useState<string>('asc');
    const [filterRooms, setFilterRooms] = useState<number | undefined>(undefined);
    const [selectedApartment, setSelectedApartment] = useState<IApartment | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false); // Состояние для нового модального окна

    useEffect(() => {
        loadApartments();
    }, [priceSort, filterRooms]);

    const loadApartments = async () => {
        try {
            const data = await getApartmentsByFilter(priceSort, filterRooms);
            setApartments(data);
        } catch (error) {
            toast.error('Failed to load apartments');
        }
    };

    useEffect(() => {
        localStorage.setItem('apartments', JSON.stringify(apartments));
    }, [apartments]);

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

        try {
            const addedApartment = await addApartment(newApartment);
            setApartments([...apartments, addedApartment]);
            setNewApartment({ rooms: 0, name: '', price: 0, description: '' });
        } catch (error) {
            console.error('Error adding apartment:', error);
            toast.error('Failed to add apartment');
        }
    };

    const handleDeleteApartment = async (id: string) => {
        try {
            await deleteApartment(id);
            setApartments(apartments.filter(apartment => apartment.id !== id));
        } catch (error) {
            toast.error('Failed to delete apartment');
        }
    };

    const handleEditApartment = (apartment: IApartment) => {
        setSelectedApartment(apartment);
        setIsEditModalOpen(true);
    };

    const handleViewApartment = (apartment: IApartment) => {
        setSelectedApartment(apartment);
        setIsViewModalOpen(true);
    };

    const handleSaveEditedApartment = (updatedApartment: IApartment) => {
        const updatedApartments = apartments.map(apartment =>
            apartment.id === updatedApartment.id ? updatedApartment : apartment
        );
        setApartments(updatedApartments);
    };

    const handleSortChange = (e: SelectChangeEvent<string>) => {
        setPriceSort(e.target.value as string);
    };

    const handleRoomsFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setFilterRooms(isNaN(value) ? undefined : value);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedApartment(null);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedApartment(null);
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
                    error={!!validateApartmentName(newApartment.name)}
                    helperText={validateApartmentName(newApartment.name)}
                    sx={{ marginRight: '20px' }}
                />

                <TextField
                    label="Number of Rooms"
                    name="rooms"
                    type="number"
                    value={newApartment.rooms}
                    onChange={handleInputChange}
                    margin="normal"
                    error={!!validateNumberOfRooms(newApartment.rooms)}
                    helperText={validateNumberOfRooms(newApartment.rooms)}
                    sx={{ marginRight: '20px' }}
                />

                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={newApartment.price}
                    onChange={handleInputChange}
                    margin="normal"
                    error={!!validatePrice(newApartment.price)}
                    helperText={validatePrice(newApartment.price)}
                />

                <TextField
                    label="Description"
                    name="description"
                    value={newApartment.description}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    error={!!validateDescription(newApartment.description)}
                    helperText={validateDescription(newApartment.description)}
                />

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddApartment}
                >
                    Add
                </Button>
            </Box>

            <Box mb={4}>
                <Typography variant="h4" gutterBottom>
                    Available Apartments
                </Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Sort by Price</InputLabel>
                    <Select value={priceSort} onChange={handleSortChange}>
                        <MenuItem value="asc">Price - lowest to highest</MenuItem>
                        <MenuItem value="desc">Price - highest to lowest</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Filter by Rooms"
                    type="number"
                    value={filterRooms}
                    onChange={handleRoomsFilterChange}
                    fullWidth
                    margin="normal"
                />
                <List>
                    {apartments.map(apartment => (
                        <ListItem key={apartment.id}>
                            <ListItemText
                                primary={apartment.name}
                                secondary={`Rooms: ${apartment.rooms}, Price: ${apartment.price}`}
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
