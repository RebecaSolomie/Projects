import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "./DataContext";

const AddProperty = () => {
    const { addProperty, currentUser } = useData();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        location: "",
        price: "",
        size: "",
        bedrooms: "",
        description: "",
        img: "", // Keep as string for filename
        tags: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setFormData(prev => ({
                ...prev,
                img: file.name // Store just the filename
            }));
        }
    };

    const handleTagChange = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (!currentUser) {
                throw new Error("You must be logged in to add a property");
            }

            if (!formData.img) {
                throw new Error("Please upload an image");
            }

            if (!formData.tags.length) {
                throw new Error("Please select at least one tag");
            }

            // Prepare the final property data
            const propertyData = {
                id: formData.id.trim(),
                name: formData.name,
                location: formData.location,
                price: formData.price,
                size: formData.size,
                bedrooms: formData.bedrooms,
                img: formData.img,
                description: formData.description,
                userId: currentUser.id,
                tags: formData.tags
            };

            console.log("Property data:", propertyData);
            await addProperty(propertyData);
            navigate("/account");
        } catch (err) {
            setError(err.message);
            console.error("Add property error:", err);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="add-property">
            <h2>Add New Property</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>ID:</label>
                    <input
                        type="number"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Size:</label>
                    <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Bedrooms:</label>
                    <input
                        type="text"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    {previewImage && (
                        <div className="image-preview">
                            <img src={previewImage} alt="Preview" />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Tags:</label>
                    <div className="tags-container">
                        {["Modern", "Spacious", "Pool", "Garden", "Water View", "Historical", "Mountain"].map(tag => (
                            <label key={tag} className="tag-label">
                                <input
                                    type="checkbox"
                                    checked={formData.tags.includes(tag)}
                                    onChange={() => handleTagChange(tag)}
                                />
                                {tag}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="button-group">
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Adding..." : "Add Property"}
                    </button>
                    <button type="button" onClick={() => navigate("/account")} disabled={isLoading}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProperty;
