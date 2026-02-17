import React from "react";
import { useParams } from "react-router-dom";
import { useData } from "./DataContext";

const PropertyDetail = () => {
    const { id } = useParams();  // Get the property ID from the URL
    const { properties } = useData();

    const property = properties.find((prop) => prop.id === parseInt(id));

    if (!property) {
        return <p>Property not found.</p>;
    }

    // Extract tag names whether tags are strings or objects
    const tagNames = property.tags
        ? property.tags.map(tag => typeof tag === 'string' ? tag : tag.name)
        : [];

    const imageUrl = `${process.env.PUBLIC_URL}/${property.img}`;

    return (
        <div className="property-detail-container">
            <div className="property-detail-header">
                <h1>{property.name}</h1>
                <p>{property.location}</p>
                <p><strong>Price:</strong> {property.price}</p>
            </div>

            <div className="property-detail-body">
                <img src={imageUrl} alt={property.name} />
                <div className="property-info">
                    <p><strong>Size:</strong> {property.size}</p>
                    <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                    <p><strong>Description:</strong> {property.description}</p>
                    <p><strong>Tags:</strong> {tagNames.join(", ")}</p>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
