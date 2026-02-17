import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useData } from "../DataContext";
import Account from "../Account";

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

describe("Account Component", () => {
    const mockUser = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        address: "123 Main St",
        properties: [1, 2],
    };

    const mockProperties = [
        {
            id: 1,
            name: "Modern Villa",
            location: "Miami",
            price: "$1,200,000",
            size: "2000 sqft",
            bedrooms: 4,
            img: "villa.jpg",
        },
        {
            id: 2,
            name: "Luxury Apartment",
            location: "New York",
            price: "$2,500,000",
            size: "1500 sqft",
            bedrooms: 3,
            img: "apartment.jpg",
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        window.confirm = jest.fn(() => true);
    });

    test("renders login form when no user is logged in", () => {
        useData.mockReturnValue({ currentUser: null, properties: [] });
        render(<MemoryRouter><Account /></MemoryRouter>);
        expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    });

    test("renders user account details when logged in", () => {
        useData.mockReturnValue({ currentUser: mockUser, properties: [] });
        render(<MemoryRouter><Account /></MemoryRouter>);
        expect(screen.getByText("My Account")).toBeInTheDocument();
        expect(screen.getByText(/Name: John Doe/)).toBeInTheDocument();
        expect(screen.getByText(/Email: john@example.com/)).toBeInTheDocument();
        expect(screen.getByText(/Phone: 123-456-7890/)).toBeInTheDocument();
        expect(screen.getByText(/Address: 123 Main St/)).toBeInTheDocument();
    });

    test("displays user properties", () => {
        useData.mockReturnValue({ currentUser: mockUser, properties: mockProperties });
        render(<MemoryRouter><Account /></MemoryRouter>);
        expect(screen.getByText("Modern Villa")).toBeInTheDocument();
    });

    test("handles property deletion when confirmed", () => {
        const mockDeleteProperty = jest.fn();
        useData.mockReturnValue({
            currentUser: mockUser,
            properties: mockProperties,
            deleteProperty: mockDeleteProperty,
        });
        render(<MemoryRouter><Account /></MemoryRouter>);
        fireEvent.click(screen.getAllByText("Delete Property")[0]);
        expect(window.confirm).toHaveBeenCalled();
        expect(mockDeleteProperty).toHaveBeenCalledWith(1);
    });

    test("handles logout", () => {
        const mockLogoutUser = jest.fn();
        useData.mockReturnValue({
            currentUser: mockUser,
            properties: mockProperties,
            logoutUser: mockLogoutUser,
        });
        render(<MemoryRouter><Account /></MemoryRouter>);
        fireEvent.click(screen.getByText("Logout"));
        expect(mockLogoutUser).toHaveBeenCalled();
    });

    test("navigates to add property page", () => {
        useData.mockReturnValue({ currentUser: mockUser, properties: mockProperties });
        render(<MemoryRouter><Account /></MemoryRouter>);
        fireEvent.click(screen.getByText("+ Add Property"));
        expect(mockNavigate).toHaveBeenCalledWith("/add-property");
    });

    test("toggles between login and register forms", () => {
        useData.mockReturnValue({ currentUser: null, properties: [] });
        render(<MemoryRouter><Account /></MemoryRouter>);
        fireEvent.click(screen.getByText("Create an Account"));
        expect(screen.getByText("Create Account")).toBeInTheDocument();
    });

    test("handles successful login", async () => {
        const mockLoginUser = jest.fn().mockResolvedValue(mockUser);
        useData.mockReturnValue({ currentUser: null, properties: [], loginUser: mockLoginUser });
        render(<MemoryRouter><Account /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText("Enter email"), { target: { value: "john@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("Enter password"), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: "Login" }));

        await waitFor(() => expect(mockLoginUser).toHaveBeenCalledWith("john@example.com", "password123"));
    });

    test("handles successful registration", async () => {
        const mockRegisterUser = jest.fn().mockResolvedValue(mockUser);
        useData.mockReturnValue({ currentUser: null, properties: [], registerUser: mockRegisterUser });
        render(<MemoryRouter><Account /></MemoryRouter>);

        // Fill in all required fields
        fireEvent.change(screen.getByLabelText("Name:"), { target: { value: "Test User" } });
        fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText("Phone:"), { target: { value: "1234567890" } });
        fireEvent.change(screen.getByLabelText("Address:"), { target: { value: "Test Address" } });

        // Upload image
        const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
        const imageInput = screen.getByLabelText("Profile Image:");
        fireEvent.change(imageInput, { target: { files: [file] } });

        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        await waitFor(() => expect(mockRegisterUser).toHaveBeenCalledWith("test@example.com", "password123", "Test User", "1234567890", "Test Address"));
    });
});
