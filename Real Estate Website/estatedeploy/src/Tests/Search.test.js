import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Search from "../Search";
import { useData } from "../DataContext";

// Mock useData hook to provide mock properties
jest.mock("../DataContext", () => ({
    useData: jest.fn(),
}));

describe("Search", () => {
    const mockProperties = [
        {
            id: 1,
            name: "Modern Villa",
            location: "Miami",
            price: "$1,200,000",
            size: "2000 sqft",
            bedrooms: 4,
            tags: ["Modern", "Pool"],
            img: "villa.jpg",
            description: "A beautiful modern villa in Miami"
        },
        {
            id: 2,
            name: "Beach House",
            location: "Miami",
            price: "$2,500,000",
            size: "3000 sqft",
            bedrooms: 5,
            tags: ["Spacious", "Water View"],
            img: "beachhouse.jpg",
            description: "A luxurious beach house"
        },
        {
            id: 3,
            name: "Mountain Cabin",
            location: "Colorado",
            price: "$750,000",
            size: "1500 sqft",
            bedrooms: 3,
            tags: ["Mountain", "Historical"],
            img: "mountain.jpg",
            description: "A cozy mountain cabin"
        },
        {
            id: 4,
            name: "City Apartment",
            location: "New York",
            price: "$3,000,000",
            size: "1200 sqft",
            bedrooms: 2,
            tags: ["Modern", "City View"],
            img: "apartment.jpg",
            description: "A modern city apartment"
        }
    ];

    beforeEach(() => {
        useData.mockReturnValue({
            properties: mockProperties,
            isLoading: false,
            error: null,
            fetchProperties: jest.fn(),
            addProperty: jest.fn()
        });
    });

    test("renders search input and filter options", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Check if search input is rendered
        expect(screen.getByPlaceholderText("Search for a location...")).toBeInTheDocument();

        // Check if filter options are rendered
        expect(screen.getByText("Tags:")).toBeInTheDocument();
        expect(screen.getByLabelText("Price:")).toBeInTheDocument();
        expect(screen.getByLabelText("Sq. ft:")).toBeInTheDocument();
        expect(screen.getByText("Properties per page:")).toBeInTheDocument();
    });

    test("displays all properties initially", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Check if all properties are displayed
        expect(screen.getByText("Modern Villa")).toBeInTheDocument();
        expect(screen.getByText("Beach House")).toBeInTheDocument();
        expect(screen.getByText("Mountain Cabin")).toBeInTheDocument();
        expect(screen.getByText("City Apartment")).toBeInTheDocument();
    });

    test("filters properties by location", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Search for Miami properties
        fireEvent.change(screen.getByPlaceholderText("Search for a location..."), {
            target: { value: "Miami" }
        });

        await waitFor(() => {
            expect(screen.getByText("Modern Villa")).toBeInTheDocument();
            expect(screen.getByText("Beach House")).toBeInTheDocument();
            expect(screen.queryByText("Mountain Cabin")).not.toBeInTheDocument();
            expect(screen.queryByText("City Apartment")).not.toBeInTheDocument();
        });
    });

    test("filters properties by selected tags", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Select "Modern" tag
        fireEvent.click(screen.getByText("Modern"));

        await waitFor(() => {
            expect(screen.getByText("Modern Villa")).toBeInTheDocument();
            expect(screen.getByText("City Apartment")).toBeInTheDocument();
            expect(screen.queryByText("Beach House")).not.toBeInTheDocument();
            expect(screen.queryByText("Mountain Cabin")).not.toBeInTheDocument();
        });
    });

    test("filters properties by price range", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Set price range to $1M - $2M
        const priceInputs = screen.getAllByLabelText("Price:");
        fireEvent.change(priceInputs[0], { target: { value: 1000000 } });
        fireEvent.change(priceInputs[1], { target: { value: 2000000 } });

        await waitFor(() => {
            expect(screen.getByText("Modern Villa")).toBeInTheDocument();
            expect(screen.queryByText("Beach House")).not.toBeInTheDocument();
            expect(screen.queryByText("Mountain Cabin")).not.toBeInTheDocument();
            expect(screen.queryByText("City Apartment")).not.toBeInTheDocument();
        });
    });

    test("filters properties by square footage range", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Set square footage range to 1000 - 2000 sqft
        const sqftInputs = screen.getAllByLabelText("Sq. ft:");
        fireEvent.change(sqftInputs[0], { target: { value: 1000 } });
        fireEvent.change(sqftInputs[1], { target: { value: 2000 } });

        await waitFor(() => {
            expect(screen.getByText("Modern Villa")).toBeInTheDocument();
            expect(screen.getByText("City Apartment")).toBeInTheDocument();
            expect(screen.queryByText("Beach House")).not.toBeInTheDocument();
            expect(screen.queryByText("Mountain Cabin")).not.toBeInTheDocument();
        });
    });

    test("handles multiple filters simultaneously", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Apply multiple filters
        fireEvent.change(screen.getByPlaceholderText("Search for a location..."), {
            target: { value: "Miami" }
        });
        fireEvent.click(screen.getByText("Modern"));
        const priceInputs = screen.getAllByLabelText("Price:");
        fireEvent.change(priceInputs[0], { target: { value: 1000000 } });
        fireEvent.change(priceInputs[1], { target: { value: 2000000 } });

        await waitFor(() => {
            expect(screen.getByText("Modern Villa")).toBeInTheDocument();
            expect(screen.queryByText("Beach House")).not.toBeInTheDocument();
            expect(screen.queryByText("Mountain Cabin")).not.toBeInTheDocument();
            expect(screen.queryByText("City Apartment")).not.toBeInTheDocument();
        });
    });

    test("displays 'No properties found' when no matches", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Apply impossible filter combination
        fireEvent.change(screen.getByPlaceholderText("Search for a location..."), {
            target: { value: "Nonexistent" }
        });

        await waitFor(() => {
            expect(screen.getByText("No properties found.")).toBeInTheDocument();
        });
    });

    test("handles loading state", () => {
        useData.mockReturnValue({
            properties: [],
            isLoading: true,
            error: null,
            fetchProperties: jest.fn(),
            addProperty: jest.fn()
        });

        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        expect(screen.getByText("Loading properties...")).toBeInTheDocument();
    });

    test("handles error state", () => {
        useData.mockReturnValue({
            properties: [],
            isLoading: false,
            error: "Failed to load properties",
            fetchProperties: jest.fn(),
            addProperty: jest.fn()
        });

        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        expect(screen.getByText("Error: Failed to load properties")).toBeInTheDocument();
    });

    test("handles pagination", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Change items per page
        fireEvent.change(screen.getByLabelText("Properties per page:"), {
            target: { value: "6" }
        });

        // Navigate to next page
        fireEvent.click(screen.getByText("Next →"));

        await waitFor(() => {
            expect(screen.getByText("Page 2 of")).toBeInTheDocument();
        });
    });

    test("handles price color coding", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Check price colors
        const modernVillaPrice = screen.getByText("$1,200,000").closest("p");
        const beachHousePrice = screen.getByText("$2,500,000").closest("p");
        const mountainCabinPrice = screen.getByText("$750,000").closest("p");
        const cityApartmentPrice = screen.getByText("$3,000,000").closest("p");

        expect(modernVillaPrice).toHaveStyle("color: green");
        expect(beachHousePrice).toHaveStyle("color: orange");
        expect(mountainCabinPrice).toHaveStyle("color: green");
        expect(cityApartmentPrice).toHaveStyle("color: red");
    });

    test("handles tag selection and deselection", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Select and deselect a tag
        const modernTag = screen.getByText("Modern");
        fireEvent.click(modernTag);
        expect(modernTag).toHaveClass("selected");

        fireEvent.click(modernTag);
        expect(modernTag).not.toHaveClass("selected");
    });

    test("handles price interval calculation", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Check price intervals
        const priceIntervals = screen.getByText("Price Distribution").closest("div");
        expect(priceIntervals).toBeInTheDocument();
    });

    test("handles property generation", async () => {
        const mockAddProperty = jest.fn();
        useData.mockReturnValue({
            properties: mockProperties,
            isLoading: false,
            error: null,
            fetchProperties: jest.fn(),
            addProperty: mockAddProperty
        });

        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Click generate button
        fireEvent.click(screen.getByText("Generate Random Properties"));

        await waitFor(() => {
            expect(mockAddProperty).toHaveBeenCalled();
        });
    });

    test("handles property generation error", async () => {
        const mockAddProperty = jest.fn().mockRejectedValue(new Error("Generation failed"));
        useData.mockReturnValue({
            properties: mockProperties,
            isLoading: false,
            error: null,
            fetchProperties: jest.fn(),
            addProperty: mockAddProperty
        });

        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Click generate button
        fireEvent.click(screen.getByText("Generate Random Properties"));

        await waitFor(() => {
            expect(screen.getByText("Error generating properties:")).toBeInTheDocument();
        });
    });

    test("handles chart data rendering", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Check if charts are rendered
        expect(screen.getByText("Price Distribution")).toBeInTheDocument();
        expect(screen.getByText("Price Trend")).toBeInTheDocument();
    });

    test("handles property card rendering", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Check property card elements
        const propertyCards = screen.getAllByRole("img");
        expect(propertyCards).toHaveLength(mockProperties.length);

        propertyCards.forEach((card, index) => {
            expect(card).toHaveAttribute("src", mockProperties[index].img);
            expect(card).toHaveAttribute("alt", mockProperties[index].name);
        });
    });

    test("handles property details display", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Check property details
        mockProperties.forEach(property => {
            expect(screen.getByText(property.name)).toBeInTheDocument();
            expect(screen.getByText(property.location)).toBeInTheDocument();
            expect(screen.getByText(property.price)).toBeInTheDocument();
            expect(screen.getByText(`${property.size} - ${property.bedrooms} Bedrooms`)).toBeInTheDocument();
        });
    });

    test("handles price parsing correctly", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Check if properties with different price formats are displayed correctly
        expect(screen.getByText("$1,200,000")).toBeInTheDocument();
        expect(screen.getByText("$2,500,000")).toBeInTheDocument();
        expect(screen.getByText("$750,000")).toBeInTheDocument();
        expect(screen.getByText("$3,000,000")).toBeInTheDocument();
    });

    test("handles square footage parsing correctly", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Check if properties with different size formats are displayed correctly
        expect(screen.getByText("2000 sqft")).toBeInTheDocument();
        expect(screen.getByText("3000 sqft")).toBeInTheDocument();
        expect(screen.getByText("1500 sqft")).toBeInTheDocument();
        expect(screen.getByText("1200 sqft")).toBeInTheDocument();
    });

    test("handles multiple tag selection", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Select multiple tags
        fireEvent.click(screen.getByText("Modern"));
        fireEvent.click(screen.getByText("Pool"));

        // Check if both tags are selected
        expect(screen.getByText("Modern")).toHaveClass("selected");
        expect(screen.getByText("Pool")).toHaveClass("selected");
    });

    test("handles price range slider interaction", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        const priceInputs = screen.getAllByLabelText("Price:");
        fireEvent.change(priceInputs[0], { target: { value: 500000 } });
        fireEvent.change(priceInputs[1], { target: { value: 1500000 } });

        expect(screen.getByText("500,000 - 1,500,000")).toBeInTheDocument();
    });

    test("handles square footage range slider interaction", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        const sqftInputs = screen.getAllByLabelText("Sq. ft:");
        fireEvent.change(sqftInputs[0], { target: { value: 1000 } });
        fireEvent.change(sqftInputs[1], { target: { value: 3000 } });

        expect(screen.getByText("1000 - 3000 sq. ft")).toBeInTheDocument();
    });

    test("handles pagination controls", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Change items per page
        fireEvent.change(screen.getByLabelText("Properties per page:"), {
            target: { value: "6" }
        });

        // Navigate through pages
        fireEvent.click(screen.getByText("Next →"));
        expect(screen.getByText("Page 2 of")).toBeInTheDocument();

        fireEvent.click(screen.getByText("← Prev"));
        expect(screen.getByText("Page 1 of")).toBeInTheDocument();
    });

    test("handles search button click", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        const searchButton = screen.getByText("🔍 Search");
        fireEvent.click(searchButton);
        // Verify that the search functionality is triggered
        expect(screen.getByPlaceholderText("Search for a location...")).toBeInTheDocument();
    });

    test("handles property card link navigation", () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        const viewButtons = screen.getAllByText("View Property");
        expect(viewButtons.length).toBeGreaterThan(0);
        expect(viewButtons[0].closest('a')).toHaveAttribute('href', '/property/1');
    });

    test("handles chart data updates", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Check if chart containers are rendered
        expect(screen.getByText("Price Distribution")).toBeInTheDocument();
        expect(screen.getByText("Price Trend")).toBeInTheDocument();

        // Check if chart data is displayed
        const chartData = screen.getByText("Price Distribution").closest("div");
        expect(chartData).toBeInTheDocument();
    });

    test("handles property generation with delay", async () => {
        const mockAddProperty = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        useData.mockReturnValue({
            properties: mockProperties,
            isLoading: false,
            error: null,
            fetchProperties: jest.fn(),
            addProperty: mockAddProperty
        });

        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Click generate button
        fireEvent.click(screen.getByText("Generate Random Properties"));

        // Check loading state
        expect(screen.getByText("Generating...")).toBeInTheDocument();

        // Wait for generation to complete
        await waitFor(() => {
            expect(screen.getByText("Generate Random Properties")).toBeInTheDocument();
            expect(mockAddProperty).toHaveBeenCalled();
        });
    });

    test("handles error during property generation", async () => {
        const mockAddProperty = jest.fn().mockRejectedValue(new Error("Generation failed"));
        useData.mockReturnValue({
            properties: mockProperties,
            isLoading: false,
            error: null,
            fetchProperties: jest.fn(),
            addProperty: mockAddProperty
        });

        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        // Click generate button
        fireEvent.click(screen.getByText("Generate Random Properties"));

        // Wait for error state
        await waitFor(() => {
            expect(screen.getByText("Generate Random Properties")).toBeInTheDocument();
            expect(mockAddProperty).toHaveBeenCalled();
        });
    });

    test("handles empty properties array", () => {
        useData.mockReturnValue({
            properties: [],
            isLoading: false,
            error: null,
            fetchProperties: jest.fn(),
            addProperty: jest.fn()
        });

        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        expect(screen.getByText("No properties found.")).toBeInTheDocument();
    });

    test("handles property card image loading error", () => {
        const propertiesWithInvalidImages = mockProperties.map(prop => ({
            ...prop,
            img: "invalid-image.jpg"
        }));

        useData.mockReturnValue({
            properties: propertiesWithInvalidImages,
            isLoading: false,
            error: null,
            fetchProperties: jest.fn(),
            addProperty: jest.fn()
        });

        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        const images = screen.getAllByRole("img");
        images.forEach(img => {
            expect(img).toHaveAttribute("src", expect.stringContaining("invalid-image.jpg"));
            expect(img).toHaveAttribute("alt", expect.any(String));
        });
    });

    test("handles search term with special characters", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Search for a location..."), {
            target: { value: "Miami, FL!" }
        });

        await waitFor(() => {
            expect(screen.getByText("Modern Villa")).toBeInTheDocument();
            expect(screen.getByText("Beach House")).toBeInTheDocument();
        });
    });

    test("handles price range edge cases", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        const priceInputs = screen.getAllByLabelText("Price:");
        fireEvent.change(priceInputs[0], { target: { value: 0 } });
        fireEvent.change(priceInputs[1], { target: { value: 10000000 } });

        await waitFor(() => {
            expect(screen.getByText("0 - 10,000,000")).toBeInTheDocument();
        });
    });

    test("handles square footage edge cases", async () => {
        render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        const sqftInputs = screen.getAllByLabelText("Sq. ft:");
        fireEvent.change(sqftInputs[0], { target: { value: 0 } });
        fireEvent.change(sqftInputs[1], { target: { value: 10000 } });

        await waitFor(() => {
            expect(screen.getByText("0 - 10000 sq. ft")).toBeInTheDocument();
        });
    });
});

