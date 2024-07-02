export const validateApartmentName = (name: string): string | undefined => {
    if (!name.trim()) {
        return 'Apartment name cannot be empty';
    }
    if (name.length > 99) {
        return 'Apartment name exceeds maximum length (99 characters)';
    }
    return undefined;
};

export const validateNumberOfRooms = (rooms: number): string | undefined => {
    if (!rooms || rooms <= 0) {
        return 'Number of rooms must be greater than 0';
    }
    return undefined;
};

export const validatePrice = (price: number): string | undefined => {
    if (!price || price <= 0) {
        return 'Price must be greater than 0';
    }
    return undefined;
};

export const validateDescription = (description: string): string | undefined => {
    if (description.length > 999) {
        return 'Description exceeds maximum length (999 characters)';
    }
    return undefined;
};
