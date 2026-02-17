import React, { useState, useEffect } from "react";
import { useData } from "./DataContext";
import {Link} from "react-router-dom";

const Search = () => {
    const { properties, isLoading, error, fetchProperties} = useData();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [priceRange, setPriceRange] = useState([100000, 5000000]);
    const [sqftRange, setSqftRange] = useState([400, 5000]);
    const [filteredProperties, setFilteredProperties] = useState([]);

    // Fetch properties when component mounts
    useEffect(() => {
        const loadProperties = async () => {
            try {
                await fetchProperties();
                setCurrentPage(1); // Reset to first page when properties change
            } catch (err) {
                console.error("Error loading properties:", err);
            }
        };
        loadProperties();
    }, [fetchProperties]);

    // Available Tags
    const availableTags = ["Pool", "Spacious", "Modern", "Historical", "Water View", "Mountain", "Garden"];

    // Toggle selected tags
    const toggleTag = (tag) => {
        setSelectedTags((prevTags) =>
            prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
        );
    };

    // Parse price
    const parsePrice = (price) => {
        if (typeof price === "number") return price;
        const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
        if (price.includes("K")) return numericPrice * 1000;
        if (price.includes("M")) return numericPrice * 1000000;
        // Default to assuming millions if no suffix
        return numericPrice >= 1000 ? numericPrice : numericPrice * 1000000;
    };

    // Parse square footage
    const parseSize = (size) => {
        if (typeof size === 'number') return size;
        return parseInt(size.replace(/\D/g, "")) || 0;
    };

    // Update filtered properties whenever properties or filters change
    useEffect(() => {
        if (!isLoading && properties && Array.isArray(properties)) {
            let results = [...properties];

            // Apply search term filter
            if (searchTerm) {
                results = results.filter(p => 
                    p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Apply tag filters
            if (selectedTags.length > 0) {
                results = results.filter(p => {
                    // Handle both string tags and object tags
                    const propertyTags = Array.isArray(p.tags)
                        ? p.tags.map(tag => typeof tag === 'string' ? tag : tag.name)
                        : [];
                    return selectedTags.every(tag => propertyTags.includes(tag));
                });
            }

            // Apply price range filter
            results = results.filter(p => {
                const price = parsePrice(p.price);
                return price >= priceRange[0] && price <= priceRange[1];
            });

            // Apply square footage filter
            results = results.filter(p => {
                const sqft = parseSize(p.size);
                return sqft >= sqftRange[0] && sqft <= sqftRange[1];
            });

            setFilteredProperties(results);
        }
    }, [properties, searchTerm, selectedTags, priceRange, sqftRange, isLoading]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [propertiesPerPage, setPropertiesPerPage] = useState(15); // Default to 15 per page

    // Calculate the total number of pages
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);


    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Handle properties per page change
    const handlePropertiesPerPageChange = (event) => {
        setPropertiesPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    if (isLoading) {
        return <div className="search-container">Loading properties...</div>;
    }

    if (error) {
        return <div className="search-container">Error: {error}</div>;
    }

    return (
        <div className="search-container">
            <div className="search-header">
                <h1>Find Your Dream Home</h1>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for a location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => {
                    // Handle search button click
                }}>🔍 Search</button>
            </div>

            {/* Filters */}
            <div className="filters">
                {/* Tags */}
                <div className="tags">
                    <span>Tags:</span>
                    {availableTags.map((tag) => (
                        <button
                            key={tag}
                            className={`filter-tag ${selectedTags.includes(tag) ? "selected" : ""}`}
                            onClick={() => toggleTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Price Range */}
                <div className="filter-range">
                    <label>Price:</label>
                    <input
                        type="range"
                        min="100000"
                        max="5000000"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    />
                    <input
                        type="range"
                        min="100000"
                        max="5000000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    />
                    <span>{priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}</span>
                </div>

                {/* Square Footage Range */}
                <div className="filter-range">
                    <label>Sq. ft:</label>
                    <input
                        type="range"
                        min="400"
                        max="5000"
                        value={sqftRange[0]}
                        onChange={(e) => setSqftRange([Number(e.target.value), sqftRange[1]])}
                    />
                    <input
                        type="range"
                        min="400"
                        max="5000"
                        value={sqftRange[1]}
                        onChange={(e) => setSqftRange([sqftRange[0], Number(e.target.value)])}
                    />
                    <span>{sqftRange[0]} - {sqftRange[1]} sq. ft</span>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <label>Properties per page:</label>
                <select value={propertiesPerPage} onChange={handlePropertiesPerPageChange}>
                    <option value="6">6</option>
                    <option value="12">12</option>
                    <option value="21">21</option>
                </select>
            </div>

            {/* Property Listings */}
            <div className="property-list">
                {currentProperties.length > 0 ? (
                    currentProperties.map((prop) => (
                        <div key={prop.id} className="property-card">
                            <img src={prop.img} alt={prop.name} />
                            <p>{prop.name}</p>
                            <p>{prop.location}</p>
                            <p style={{ fontWeight: "bold" }}>
                                Price: {prop.price}
                            </p>
                            <p>{prop.size}</p>
                            <Link to={`/property/${prop.id}`}>
                                <button className="view-property">View Property</button>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No properties found.</p>
                )}
            </div>

            {/* Pagination Navigation */}
            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    ← Prev
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next →
                </button>
            </div>
        </div>
    );
};

export default Search;
