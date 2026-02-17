import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useData } from "../DataContext";
import AddProperty from "../AddProperty";

// Mock the DataContext
jest.mock("../DataContext", () => ({
    useData: jest.fn(),
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("AddProperty Component", () => {
    const mockCurrentUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
    };

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        // Mock FileReader
        global.FileReader = jest.fn().mockImplementation(function() {
            this.readAsDataURL = jest.fn();
            this.onload = null;
            this.result = "data:image/jpeg;base64,test";
            return this;
        });
    });

    test("renders AddProperty form with all fields", () => {
        useData.mockReturnValue({
            currentUser: mockCurrentUser,
            addProperty: jest.fn(),
        });

        render(
            <MemoryRouter>
                <AddProperty />
            </MemoryRouter>
        );

        expect(screen.getByText("Add New Property")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Property Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Location")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Price (e.g., 500K, 1.2M)")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Size (e.g., 2000 sq ft)")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Bedrooms")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Tags (comma-separated)")).toBeInTheDocument();
        expect(screen.getByText("Add Property")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    test("shows error when user is not logged in", () => {
        useData.mockReturnValue({
            currentUser: null,
            addProperty: jest.fn(),
        });

        render(
            <MemoryRouter>
                <AddProperty />
            </MemoryRouter>
        );

        expect(screen.getByText(/You must be logged in to add a property/i)).toBeInTheDocument();
    });

    test("handles form input changes correctly", () => {
        useData.mockReturnValue({
            currentUser: mockCurrentUser,
            addProperty: jest.fn(),
        });

        render(
            <MemoryRouter>
                <AddProperty />
            </MemoryRouter>
        );

        const nameInput = screen.getByLabelText(/Name/i);
        const locationInput = screen.getByLabelText(/Location/i);
        const priceInput = screen.getByLabelText(/Price/i);
        const sizeInput = screen.getByLabelText(/Size/i);
        const bedroomsInput = screen.getByLabelText(/Bedrooms/i);
        const descriptionInput = screen.getByLabelText(/Description/i);

        fireEvent.change(nameInput, { target: { value: "Test Property" } });
        fireEvent.change(locationInput, { target: { value: "Test Location" } });
        fireEvent.change(priceInput, { target: { value: "500K" } });
        fireEvent.change(sizeInput, { target: { value: "2000 sq ft" } });
        fireEvent.change(bedroomsInput, { target: { value: "3" } });
        fireEvent.change(descriptionInput, { target: { value: "Test Description" } });

        expect(nameInput.value).toBe("Test Property");
        expect(locationInput.value).toBe("Test Location");
        expect(priceInput.value).toBe("500K");
        expect(sizeInput.value).toBe("2000 sq ft");
        expect(bedroomsInput.value).toBe("3");
        expect(descriptionInput.value).toBe("Test Description");
    });

    test("handles image upload correctly", async () => {
        useData.mockReturnValue({
            currentUser: mockCurrentUser,
            addProperty: jest.fn(),
        });

        render(
            <MemoryRouter>
                <AddProperty />
            </MemoryRouter>
        );

        const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
        const fileInput = screen.getByLabelText(/Image/i);

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(FileReader).toHaveBeenCalled();
        });
    });

    test("shows error when submitting form without required fields", async () => {
        useData.mockReturnValue({
            currentUser: mockCurrentUser,
            addProperty: jest.fn(),
        });

        render(
            <MemoryRouter>
                <AddProperty />
            </MemoryRouter>
        );

        const submitButton = screen.getByText("Add Property");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Please fill out all required fields/i)).toBeInTheDocument();
        });
    });

    test("shows error when submitting form without image", async () => {
        useData.mockReturnValue({
            currentUser: mockCurrentUser,
            addProperty: jest.fn(),
        });

        render(
            <MemoryRouter>
                <AddProperty />
            </MemoryRouter>
        );

        // Fill in all required fields except image
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Test Property" } });
        fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: "Test Location" } });
        fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: "500K" } });
        fireEvent.change(screen.getByLabelText(/Size/i), { target: { value: "2000 sq ft" } });
        fireEvent.change(screen.getByLabelText(/Bedrooms/i), { target: { value: "3" } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Test Description" } });

        const submitButton = screen.getByText("Add Property");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Please upload an image/i)).toBeInTheDocument();
        });
    });

    test("successfully submits form with all required fields", async () => {
        const mockAddProperty = jest.fn().mockResolvedValue({ success: true });
        useData.mockReturnValue({
            currentUser: mockCurrentUser,
            addProperty: mockAddProperty,
        });

        render(
            <MemoryRouter>
                <AddProperty />
            </MemoryRouter>
        );

        // Fill in all required fields
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Test Property" } });
        fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: "Test Location" } });
        fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: "500K" } });
        fireEvent.change(screen.getByLabelText(/Size/i), { target: { value: "2000 sq ft" } });
        fireEvent.change(screen.getByLabelText(/Bedrooms/i), { target: { value: "3" } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Test Description" } });

        // Upload image
        const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
        const fileInput = screen.getByLabelText(/Image/i);
        fireEvent.change(fileInput, { target: { files: [file] } });

        const submitButton = screen.getByText("Add Property");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockAddProperty).toHaveBeenCalledWith({
                name: "Test Property",
                location: "Test Location",
                price: "500K",
                size: "2000 sq ft",
                bedrooms: "3",
                description: "Test Description",
                tags: ["Modern", "Spacious"],
                img: "test.jpg",
                userId: mockCurrentUser.id
            });
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/account");
        });
    });

    test("handles cancel button click", () => {
        useData.mockReturnValue({
            currentUser: mockCurrentUser,
            addProperty: jest.fn(),
        });

        render(
            <MemoryRouter>
                <AddProperty />
            </MemoryRouter>
        );

        const cancelButton = screen.getByText("Cancel");
        fireEvent.click(cancelButton);

        expect(mockNavigate).toHaveBeenCalledWith("/account");
    });

    test("shows loading state during form submission", async () => {
        const mockAddProperty = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        useData.mockReturnValue({
            currentUser: mockCurrentUser,
            addProperty: mockAddProperty,
        });

        render(
            <MemoryRouter>
                <AddProperty />
            </MemoryRouter>
        );

        // Fill in all required fields
        fireEvent.change(screen.getByLabelText("Name:"), { target: { value: "Test Property" } });
        fireEvent.change(screen.getByLabelText("Location:"), { target: { value: "Test Location" } });
        fireEvent.change(screen.getByLabelText("Price:"), { target: { value: "500K" } });
        fireEvent.change(screen.getByLabelText("Size:"), { target: { value: "2000 sq ft" } });
        fireEvent.change(screen.getByLabelText("Bedrooms:"), { target: { value: "3" } });
        fireEvent.change(screen.getByLabelText("Description:"), { target: { value: "Test Description" } });

        // Upload image
        const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
        const fileInput = screen.getByLabelText("Image Upload");
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Submit form
        const submitButton = screen.getByText("Add Property");
        fireEvent.click(submitButton);

        // Check loading state
        expect(screen.getByText("Adding...")).toBeInTheDocument();
        expect(submitButton).toBeDisabled();

        // Wait for submission to complete
        await waitFor(() => {
            expect(mockAddProperty).toHaveBeenCalled();
        });
    });

    test("handles error during form submission", async () => {
        const mockAddProperty = jest.fn().mockRejectedValue(new Error("Failed to add property"));
        useData.mockReturnValue({
            currentUser: mockCurrentUser,
            addProperty: mockAddProperty,
        });

        render(
            <MemoryRouter>
                <AddProperty />
            </MemoryRouter>
        );

        // Fill in all required fields
        fireEvent.change(screen.getByLabelText("Name:"), { target: { value: "Test Property" } });
        fireEvent.change(screen.getByLabelText("Location:"), { target: { value: "Test Location" } });
        fireEvent.change(screen.getByLabelText("Price:"), { target: { value: "500K" } });
        fireEvent.change(screen.getByLabelText("Size:"), { target: { value: "2000 sq ft" } });
        fireEvent.change(screen.getByLabelText("Bedrooms:"), { target: { value: "3" } });
        fireEvent.change(screen.getByLabelText("Description:"), { target: { value: "Test Description" } });

        // Upload image
        const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
        const fileInput = screen.getByLabelText("Image Upload");
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Submit form
        const submitButton = screen.getByText("Add Property");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Failed to add property")).toBeInTheDocument();
        });
    });
});

