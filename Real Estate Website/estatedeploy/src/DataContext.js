import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_BASE_URL = "https://rgestate.site/api";

const DataContext = createContext(undefined, undefined);

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [properties, setProperties] = useState(() => {
        const storedProperties = localStorage.getItem('properties');
        return storedProperties ? JSON.parse(storedProperties) : [];
    });

    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem("currentUser");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch properties from backend
    const fetchProperties = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/properties?nocache=${Date.now()}`); // Bypass cache

            if (!response.ok) throw new Error("Failed to fetch properties");

            const data = await response.json();
            setProperties(data);
            console.log("Fetched Properties:", data, "Length:", data.length);

            localStorage.setItem('properties', JSON.stringify(data));
            return data;
        } catch (err) {
            console.error("Fetch error:", err);
            const stored = localStorage.getItem('properties');
            return stored ? JSON.parse(stored) : [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch on mount
    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    // Fetch users only when needed (for login/register)
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data);
            return data;
        } catch (err) {
            console.error("Error fetching users:", err);
            throw err;
        }
    };

    // Add Property (API)
    // Add Property (API)
    const addProperty = async (propertyData) => {
        try {
            console.log("Sending property data:", propertyData); // Debug log

            // Ensure price and size are formatted correctly
            const formattedProperty = {
                ...propertyData,
                price: formatPrice(propertyData.price),
                size: formatSize(propertyData.size),
            };

            const response = await fetch(`${API_BASE_URL}/properties`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedProperty),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Backend error response:", errorData); // Debug log
                throw new Error(errorData.message || errorData.error || "Failed to add property");
            }

            const newProperty = await response.json();

            // Update local state
            setProperties(prev => [...prev, newProperty]);
            localStorage.setItem('properties', JSON.stringify([...properties, newProperty]));

            // Update current user's properties
            if (currentUser) {
                const updatedUser = {
                    ...currentUser,
                    properties: [...currentUser.properties, newProperty.id]
                };
                setCurrentUser(updatedUser);
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            }

            return newProperty;
        } catch (err) {
            console.error("Full error details:", err); // Debug log
            setError(err.message);
            throw err;
        }
    };

// Format price consistently
    const formatPrice = (price) => {
        const numericPrice = parseFloat(price);
        if (numericPrice >= 1000000) return (numericPrice / 1000000).toFixed(1) + "M";
        if (numericPrice >= 1000) return (numericPrice / 1000).toFixed(1) + "K";
        return numericPrice.toString();
    };

// Format size consistently
    const formatSize = (size) => {
        const numericSize = parseInt(size.replace(/\D/g, ""), 10);
        return numericSize.toLocaleString() + " sq ft";
    };


    // Update Property (API)
    const updateProperty = async (id, updatedInfo) => {
        try {
            if (!currentUser) throw new Error("User must be logged in to update property");

            const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...updatedInfo, userId: currentUser.id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update property");
            }

            const updatedProperty = await response.json();
            setProperties(prev => prev.map(p => p.id === id ? updatedProperty : p));
        } catch (err) {
            setError(err.message);
            console.error("Error updating property:", err);
            throw err;
        }
    };

    // Delete Property (API)
    const deleteProperty = async (id) => {
        try {
            if (!currentUser) throw new Error("User must be logged in to delete property");

            const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUser.id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete property");
            }

            setProperties(prev => prev.filter(p => p.id !== id));

            if (currentUser) {
                const updatedUser = {
                    ...currentUser,
                    properties: currentUser.properties.filter(propId => propId !== id),
                };
                setCurrentUser(updatedUser);
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            }
        } catch (err) {
            setError(err.message);
            console.error("Error deleting property:", err);
            throw err;
        }
    };

    // Login User (API)
    const loginUser = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {  // Changed endpoint
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || "Login failed");
            }

            const user = await response.json();

            // Ensure user has properties array
            if (!user.properties) {
                user.properties = [];
            }

            setCurrentUser(user);
            localStorage.setItem("currentUser", JSON.stringify(user));
            return user;
        } catch (err) {
            setError(err.message);
            console.error("Login error:", err);
            throw err;
        }
    };

    // Logout User
    const logoutUser = () => {
        setCurrentUser(null);
        setProperties([]);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("properties");
    };

    // Register User (API)
    const registerUser = async (name, email, phone, address, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, address, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || "Registration failed");
            }

            const newUser = await response.json();

            // Ensure new user has properties array
            if (!newUser.properties) {
                newUser.properties = [];
            }

            await fetchUsers();
            return newUser;
        } catch (err) {
            setError(err.message);
            console.error("Registration error:", err);
            throw err;
        }
    };

    return (
        <DataContext.Provider value={{
            users,
            properties,
            currentUser,
            error,
            isLoading,
            loginUser,
            registerUser,
            logoutUser,
            addProperty,
            updateProperty,
            deleteProperty,
            fetchProperties
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);