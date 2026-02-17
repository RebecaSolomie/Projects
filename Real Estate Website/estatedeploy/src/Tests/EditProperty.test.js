import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useData } from "../DataContext";
import EditProperty from "../EditProperty";

// Mock the DataContext and its updateProperty function
jest.mock("../DataContext", () => ({
    useData: jest.fn(),
}));

// Mock useNavigate
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

const mockUpdateProperty = jest.fn();
const mockNavigate = jest.fn();

const mockProperties = [
    {
        id: 1,
        name: "Modern Villa",
        location: "Miami",
        price: "$1,200,000",
        size: "2000 sqft",
        bedrooms: 4,
        description: "A beautiful modern villa in Miami",
        img: "villa.jpg",
        tags: ["Modern", "Luxury"]
    },
    {
        id: 2,
        name: "Beach House",
        location: "Miami",
        price: "$2,500,000",
        size: "3000 sqft",
        bedrooms: 5,
        description: "A luxurious beach house",
        img: "beach.jpg",
        tags: ["Beach", "Luxury"]
    },
];

const mockCurrentUser = {
    id: 1,
    name: "Test User",
    properties: [1, 2]
};

describe("EditProperty", () => {
    beforeEach(() => {
        useData.mockReturnValue({
            properties: mockProperties,
            updateProperty: mockUpdateProperty,
            currentUser: mockCurrentUser,
            error: null,
            isLoading: false
        });
        useNavigate.mockReturnValue(mockNavigate);
        mockUpdateProperty.mockClear();
        mockNavigate.mockClear();
    });

    test("renders form with existing property data", () => {
        render(
            <MemoryRouter initialEntries={["/edit-property/1"]}>
                <EditProperty />
            </MemoryRouter>
        );

        // Check if the correct property data is loaded into the form
        expect(screen.getByLabelText("Name *")).toHaveValue("Modern Villa");
        expect(screen.getByLabelText("Location *")).toHaveValue("Miami");
        expect(screen.getByLabelText("Price *")).toHaveValue("$1,200,000");
        expect(screen.getByLabelText("Size *")).toHaveValue("2000 sqft");
        expect(screen.getByLabelText("Bedrooms *")).toHaveValue("4");
        expect(screen.getByLabelText("Description")).toHaveValue("A beautiful modern villa in Miami");
        expect(screen.getByLabelText("Image URL")).toHaveValue("villa.jpg");
        expect(screen.getByLabelText("Tags (comma-separated)")).toHaveValue("Modern, Luxury");
    });

    test("redirects to /account if property not found", () => {
        render(
            <MemoryRouter initialEntries={["/edit/999"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                    <Route path="/account" element={<div>Account Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Account Page")).toBeInTheDocument();
    });

    test("updates form data on input change", () => {
        render(
            <MemoryRouter initialEntries={["/edit/1"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                </Routes>
            </MemoryRouter>
        );

        // Test all input fields
        const inputs = [
            { name: "name", value: "New Villa Name" },
            { name: "location", value: "New Location" },
            { name: "price", value: "$2,000,000" },
            { name: "size", value: "2500 sqft" },
            { name: "bedrooms", value: "5" },
            { name: "description", value: "New description" },
            { name: "img", value: "new-image.jpg" },
            { name: "tags", value: "New, Tags" }
        ];

        inputs.forEach(({ name, value }) => {
            const input = screen.getByLabelText(name === "name" ? "Property Name" :
                name === "location" ? "Location" :
                name === "price" ? "Price (e.g. 500K, 2M)" :
                name === "size" ? "Size" :
                name === "bedrooms" ? "Bedrooms" :
                name === "description" ? "Description" :
                name === "img" ? "Image URL" :
                "Tags (comma-separated)");
            fireEvent.change(input, { target: { value } });
            expect(input).toHaveValue(value);
        });
    });

    test("handles form submission successfully", async () => {
        render(
            <MemoryRouter initialEntries={["/edit/1"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                </Routes>
            </MemoryRouter>
        );

        // Fill in all required fields
        fireEvent.change(screen.getByLabelText("Name:"), { target: { value: "Updated Property" } });
        fireEvent.change(screen.getByLabelText("Location:"), { target: { value: "Updated Location" } });
        fireEvent.change(screen.getByLabelText("Price:"), { target: { value: "600K" } });
        fireEvent.change(screen.getByLabelText("Size:"), { target: { value: "2500 sq ft" } });
        fireEvent.change(screen.getByLabelText("Bedrooms:"), { target: { value: "4" } });
        fireEvent.change(screen.getByLabelText("Description:"), { target: { value: "Updated Description" } });

        // Submit the form
        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(mockUpdateProperty).toHaveBeenCalledWith(1, expect.objectContaining({
                name: "Updated Property",
                location: "Updated Location",
                price: "$600K",
                size: "2500 sq ft",
                bedrooms: 4,
                description: "Updated Description",
                img: "villa.jpg",
                tags: ["Modern", "Luxury"]
            }));
            expect(mockNavigate).toHaveBeenCalledWith("/account");
        });
    });

    test("handles form submission with validation errors", async () => {
        render(
            <MemoryRouter initialEntries={["/edit/1"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                </Routes>
            </MemoryRouter>
        );

        // Clear required fields
        fireEvent.change(screen.getByLabelText("Name:"), { target: { value: "" } });

        // Submit the form
        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(screen.getByText("Please fill in all required fields")).toBeInTheDocument();
            expect(mockUpdateProperty).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    test("handles updateProperty error", async () => {
        mockUpdateProperty.mockRejectedValueOnce(new Error("Update failed"));

        render(
            <MemoryRouter initialEntries={["/edit/1"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                </Routes>
            </MemoryRouter>
        );

        // Submit the form
        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(screen.getByText("Update failed")).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    test("handles cancel button click", () => {
        render(
            <MemoryRouter initialEntries={["/edit/1"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Cancel"));

        expect(mockNavigate).toHaveBeenCalledWith("/account");
    });

    test("handles loading state", () => {
        useData.mockReturnValue({
            properties: mockProperties,
            updateProperty: mockUpdateProperty,
            currentUser: mockCurrentUser,
            error: null,
            isLoading: true
        });

        render(
            <MemoryRouter initialEntries={["/edit/1"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("handles error state", () => {
        useData.mockReturnValue({
            properties: mockProperties,
            updateProperty: mockUpdateProperty,
            currentUser: mockCurrentUser,
            error: "Test error",
            isLoading: false
        });

        render(
            <MemoryRouter initialEntries={["/edit/1"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Test error")).toBeInTheDocument();
    });

    test("handles unauthorized access", () => {
        useData.mockReturnValue({
            properties: mockProperties,
            updateProperty: mockUpdateProperty,
            currentUser: null,
            error: null,
            isLoading: false
        });

        render(
            <MemoryRouter initialEntries={["/edit/1"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("You must be logged in to edit a property")).toBeInTheDocument();
    });

    test("handles property not owned by current user", () => {
        useData.mockReturnValue({
            properties: mockProperties,
            updateProperty: mockUpdateProperty,
            currentUser: { ...mockCurrentUser, properties: [2] }, // User only owns property 2
            error: null,
            isLoading: false
        });

        render(
            <MemoryRouter initialEntries={["/edit/1"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("You do not have permission to edit this property")).toBeInTheDocument();
    });

    test("handles invalid property ID in URL", () => {
        render(
            <MemoryRouter initialEntries={["/edit/invalid"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Account Page")).toBeInTheDocument();
    });

    test("handles concurrent property updates", async () => {
        render(
            <MemoryRouter initialEntries={["/edit/1"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                </Routes>
            </MemoryRouter>
        );

        // Make multiple changes
        fireEvent.change(screen.getByLabelText("Name:"), { target: { value: "Updated Name" } });
        fireEvent.change(screen.getByLabelText("Location:"), { target: { value: "Updated Location" } });

        // Submit the form
        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(mockUpdateProperty).toHaveBeenCalledWith(1, expect.objectContaining({
                name: "Updated Name",
                location: "Updated Location"
            }));
        });
    });

    test("handles tag input with various formats", () => {
        render(
            <MemoryRouter initialEntries={["/edit/1"]}>
                <Routes>
                    <Route path="/edit/:id" element={<EditProperty />} />
                </Routes>
            </MemoryRouter>
        );

        const tagInput = screen.getByLabelText("Tags (comma-separated)");
        
        // Test different tag formats
        const testCases = [
            { input: "Tag1, Tag2", expected: ["Tag1", "Tag2"] },
            { input: "Tag1,Tag2", expected: ["Tag1", "Tag2"] },
            { input: "Tag1, Tag2, Tag3", expected: ["Tag1", "Tag2", "Tag3"] },
            { input: "Single Tag", expected: ["Single Tag"] }
        ];

        testCases.forEach(({ input, expected }) => {
            fireEvent.change(tagInput, { target: { value: input } });
            expect(tagInput).toHaveValue(input);
        });
    });
});
