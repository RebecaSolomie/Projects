import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "./DataContext";

const EditProperty = () => {
    const { properties, updateProperty, currentUser } = useData();
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const propertyId = Number(id);
    const property = properties.find(p => p.id === propertyId);

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        price: "",
        size: "",
        bedrooms: "",
        description: "",
        img: "",
        tags: ""
    });

    // Initialize form with existing property data
    useEffect(() => {
        if (property) {
            setFormData({
                name: property.name || "",
                location: property.location || "",
                price: property.price || "",
                size: property.size || "",
                bedrooms: property.bedrooms || "",
                description: property.description || "",
                img: property.img || "",
                tags: property.tags ? property.tags.join(", ") : ""
            });
        }
    }, [property]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Format price and size consistently
    const formatPrice = (price) => {
        const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
        if (price.includes("M")) return numericPrice + "M";
        if (price.includes("K")) return numericPrice + "K";
        return numericPrice.toLocaleString();
    };

    const formatSize = (size) => {
        const numericSize = parseInt(size.replace(/\D/g, ""), 10);
        return numericSize.toLocaleString() + " sq ft";
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!currentUser) {
            setError("You must be logged in to edit a property");
            return;
        }

        try {
            // Validate required fields
            const { name, location, price, size, bedrooms, tags } = formData;
            if (!name || !location || !price || !size || !bedrooms) {
                throw new Error("Please fill in all required fields");
            }

            // Format the data
            const updatedData = {
                ...formData,
                price: formatPrice(price),
                size: formatSize(size),
                tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag) // Clean and trim tags
            };

            // Update the property
            await updateProperty(propertyId, updatedData);

            // Navigate back to account page on success
            navigate("/account");
        } catch (err) {
            setError(err.message);
        }
    };

    if (!property) {
        return <div>Property not found</div>;
    }

    return (
        <div className="edit-property">
            <h2>Edit Property</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Location *</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price *</label>
                    <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="e.g., 500K, 1.2M"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Size *</label>
                    <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        placeholder="e.g., 2000 sq ft"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Bedrooms *</label>
                    <input
                        type="text"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Image URL</label>
                    <input
                        type="text"
                        name="img"
                        value={formData.img}
                        onChange={handleChange}
                        placeholder="e.g., house1.png"
                    />
                </div>

                <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g., Modern, Garden, Pool"
                    />
                </div>

                <div className="button-group">
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => navigate("/account")}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditProperty;
