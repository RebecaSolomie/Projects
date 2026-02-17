import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useData } from "../DataContext";
import PropertyDetail from "../PropertyDetail";

// Mock the DataContext and its useData hook
jest.mock("../DataContext", () => ({
    useData: jest.fn(),
}));

const mockProperties = [
    {
        id: 1,
        name: "Modern Villa",
        location: "Miami",
        price: "$1,200,000",
        size: "2000 sqft",
        bedrooms: 4,
        description: "A beautiful modern villa in Miami",
        tags: ["Pool", "Spacious", "Modern"],
        img: "villa.jpg",
    },
    {
        id: 2,
        name: "Beach House",
        location: "Miami",
        price: "$2,500,000",
        size: "3000 sqft",
        bedrooms: 5,
        description: "A luxurious beach house",
        tags: ["Beach", "Luxury", "Waterfront"],
        img: "beachhouse.jpg",
    },
];

describe("PropertyDetail", () => {
    beforeEach(() => {
        useData.mockReturnValue({
            properties: mockProperties,
        });
    });

    test("renders property details correctly when valid property ID is provided", () => {
        render(
            <MemoryRouter initialEntries={["/property/1"]}>
                <PropertyDetail />
            </MemoryRouter>
        );

        expect(screen.getByText("Modern Villa")).toBeInTheDocument();
        expect(screen.getByText("Miami")).toBeInTheDocument();
        expect(screen.getByText(/Price: \$1,200,000/)).toBeInTheDocument();
        expect(screen.getByText(/Size: 2000 sqft/)).toBeInTheDocument();
        expect(screen.getByText(/Bedrooms: 4/)).toBeInTheDocument();
        expect(screen.getByText(/Description: A beautiful modern villa in Miami/)).toBeInTheDocument();
        expect(screen.getByText(/Tags: Pool, Spacious, Modern/)).toBeInTheDocument();

        // Check if the image URL is correct
        expect(screen.getByAltText("Modern Villa")).toHaveAttribute("src", `${process.env.PUBLIC_URL}/villa.jpg`);
    });

    test("displays 'Property not found' when property is not found", () => {
        render(
            <MemoryRouter initialEntries={["/property/999"]}>
                <Routes>
                    <Route path="/property/:id" element={<PropertyDetail />} />
                </Routes>
            </MemoryRouter>
        );

        // Ensure the message "Property not found" is displayed
        expect(screen.getByText("Property not found.")).toBeInTheDocument();
    });

    test("renders property details correctly for another valid property", () => {
        render(
            <MemoryRouter initialEntries={["/property/2"]}>
                <Routes>
                    <Route path="/property/:id" element={<PropertyDetail />} />
                </Routes>
            </MemoryRouter>
        );

        // Check if the second property's details are rendered correctly
        expect(screen.getByText("Beach House")).toBeInTheDocument();
        expect(screen.getByText("Miami")).toBeInTheDocument();
        expect(screen.getByText("Price: $2,500,000")).toBeInTheDocument();
        expect(screen.getByText("Size: 3000 sqft")).toBeInTheDocument();
        expect(screen.getByText("Bedrooms: 5")).toBeInTheDocument();
        expect(screen.getByText("Description: A luxurious beach house")).toBeInTheDocument();
        expect(screen.getByText("Tags: Beach, Luxury, Waterfront")).toBeInTheDocument();

        // Check if the image URL is correct
        expect(screen.getByAltText("Beach House")).toHaveAttribute("src", `${process.env.PUBLIC_URL}/beachhouse.jpg`);
    });

    test("handles missing image URL gracefully", () => {
        // Mock a property without an image
        useData.mockReturnValue({
            properties: [
                {
                    id: 1,
                    name: "Property Without Image",
                    location: "Location",
                    price: "$1,000,000",
                    size: "1500 sqft",
                    bedrooms: 3,
                    description: "This property has no image.",
                    tags: ["Luxury"],
                    img: "", // No image
                },
            ],
        });

        render(
            <MemoryRouter initialEntries={["/property/1"]}>
                <Routes>
                    <Route path="/property/:id" element={<PropertyDetail />} />
                </Routes>
            </MemoryRouter>
        );

        // The image element should be missing or have a fallback behavior
        expect(screen.getByAltText("Property Without Image")).toHaveAttribute("src", "");
    });

    test("displays 'Property not found' when the property list is empty", () => {
        useData.mockReturnValue({
            properties: [],
        });

        render(
            <MemoryRouter initialEntries={["/property/1"]}>
                <Routes>
                    <Route path="/property/:id" element={<PropertyDetail />} />
                </Routes>
            </MemoryRouter>
        );

        // Ensure the message "Property not found" is displayed when there are no properties
        expect(screen.getByText("Property not found.")).toBeInTheDocument();
    });

    test("checks if useParams is correctly fetching the property ID from the URL", () => {
        render(
            <MemoryRouter initialEntries={["/property/2"]}>
                <Routes>
                    <Route path="/property/:id" element={<PropertyDetail />} />
                </Routes>
            </MemoryRouter>
        );

        // Ensure the correct property (with id 2) is fetched and displayed
        expect(screen.getByText("Beach House")).toBeInTheDocument();
    });

    test("renders correct price format", () => {
        render(
            <MemoryRouter initialEntries={["/property/1"]}>
                <Routes>
                    <Route path="/property/:id" element={<PropertyDetail />} />
                </Routes>
            </MemoryRouter>
        );

        // Ensure that price is displayed correctly
        expect(screen.getByText("Price: $1,200,000")).toBeInTheDocument();
    });
});
