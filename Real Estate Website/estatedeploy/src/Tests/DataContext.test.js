import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { DataProvider, useData } from "../DataContext";

// Mock fetch
global.fetch = jest.fn();

// Helper component to test context
const TestComponent = () => {
    const {
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
        fetchProperties,
        fetchUsers
    } = useData();

    return (
        <div>
            <div data-testid="current-user">{currentUser ? currentUser.name : "No user"}</div>
            <div data-testid="error">{error}</div>
            <div data-testid="loading">{isLoading ? "Loading" : "Not loading"}</div>
            <div data-testid="properties-count">Properties: {properties.length}</div>
            <div data-testid="users-count">Users: {users.length}</div>
            <div data-testid="user-properties">
                {currentUser?.properties?.map(id => (
                    <div key={id} data-testid={`property-${id}`}>
                        {properties.find(p => p.id === id)?.name}
                    </div>
                ))}
            </div>

            <button onClick={() => loginUser("test@example.com", "password")}>Login</button>
            <button onClick={() => registerUser("Test User", "test@example.com", "1234567890", "Test Address", "password")}>Register</button>
            <button onClick={logoutUser}>Logout</button>
            <button onClick={() => addProperty({
                name: "Test Property",
                location: "Test Location",
                price: "500K",
                size: "2000 sq ft",
                bedrooms: "3",
                description: "Test Description",
                tags: ["Modern", "Spacious"],
                img: "test.jpg"
            })}>Add Property</button>
            <button onClick={() => updateProperty(1, { name: "Updated Property" })}>Update Property</button>
            <button onClick={() => deleteProperty(1)}>Delete Property</button>
            <button onClick={fetchProperties}>Fetch Properties</button>
            <button onClick={fetchUsers}>Fetch Users</button>
        </div>
    );
};

describe("DataContext", () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        // Clear localStorage
        localStorage.clear();
        global.fetch = jest.fn();
        fetch.mockImplementation((url, options) => {
            if (url.includes('/api/properties')) {
                if (options?.method === 'GET') {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve(mockProperties)
                    });
                }
                if (options?.method === 'POST') {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve({ id: 1, ...options.body })
                    });
                }
                if (options?.method === 'PUT') {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve({ id: 1, ...options.body })
                    });
                }
                if (options?.method === 'DELETE') {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve({ success: true })
                    });
                }
            }
            if (url.includes('/api/users/login')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockUser)
                });
            }
            if (url.includes('/api/users/register')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockUser)
                });
            }
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'Not found' })
            });
        });
    });

    test("initial state is correct", () => {
        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        expect(screen.getByTestId("current-user").textContent).toBe("No user");
        expect(screen.getByTestId("error").textContent).toBe("");
        expect(screen.getByTestId("loading").textContent).toBe("Loading");
        expect(screen.getByTestId("properties-count").textContent).toBe("Properties: 0");
        expect(screen.getByTestId("users-count").textContent).toBe("Users: 0");
    });

    test("loginUser success with existing user", async () => {
        const mockUser = { id: 1, name: "Test User", email: "test@example.com", properties: [1] };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockUser)
        });

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Login"));

        await waitFor(() => {
            expect(screen.getByTestId("current-user").textContent).toBe("Test User");
        });

        await waitFor(() => {
            expect(localStorage.getItem("currentUser")).toBe(JSON.stringify(mockUser));
        });
    });

    test("loginUser with invalid response format", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ invalid: "format" })
        });

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Login"));

        await waitFor(() => {
            expect(screen.getByTestId("error").textContent).toBe("Invalid user data received");
        });
    });

    test("registerUser with existing email", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ error: "Email already exists" })
        });

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Register"));

        await waitFor(() => {
            expect(screen.getByTestId("error").textContent).toBe("Email already exists");
        });
    });

    test("registerUser with invalid response format", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ invalid: "format" })
        });

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Register"));

        await waitFor(() => {
            expect(screen.getByTestId("error").textContent).toBe("Invalid user data received");
        });
    });

    test("logoutUser clears all user data", () => {
        const mockUser = { id: 1, name: "Test User", properties: [1] };
        localStorage.setItem("currentUser", JSON.stringify(mockUser));

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Logout"));

        expect(screen.getByTestId("current-user").textContent).toBe("No user");
        expect(localStorage.getItem("currentUser")).toBeNull();
        expect(screen.getByTestId("properties-count").textContent).toBe("Properties: 0");
    });

    test("addProperty with invalid property data", async () => {
        const mockUser = { id: 1, name: "Test User", properties: [] };
        localStorage.setItem("currentUser", JSON.stringify(mockUser));

        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ error: "Invalid property data" })
        });

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Add Property"));

        await waitFor(() => {
            expect(screen.getByTestId("error").textContent).toBe("Invalid property data");
        });
    });

    test("updateProperty with non-existent property", async () => {
        const mockUser = { id: 1, name: "Test User", properties: [1] };
        localStorage.setItem("currentUser", JSON.stringify(mockUser));

        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ error: "Property not found" })
        });

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Update Property"));

        await waitFor(() => {
            expect(screen.getByTestId("error").textContent).toBe("Property not found");
        });
    });

    test("deleteProperty with non-existent property", async () => {
        const mockUser = { id: 1, name: "Test User", properties: [1] };
        localStorage.setItem("currentUser", JSON.stringify(mockUser));

        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ error: "Property not found" })
        });

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Delete Property"));

        await waitFor(() => {
            expect(screen.getByTestId("error").textContent).toBe("Property not found");
        });
    });

    test("fetchProperties with empty response", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([])
        });

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Fetch Properties"));

        await waitFor(() => {
            expect(screen.getByTestId("properties-count").textContent).toBe("Properties: 0");
        });
    });

    test("fetchUsers with empty response", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([])
        });

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Fetch Users"));

        await waitFor(() => {
            expect(screen.getByTestId("users-count").textContent).toBe("Users: 0");
        });
    });

    test("handles concurrent property operations", async () => {
        const mockUser = { id: 1, name: "Test User", properties: [] };
        localStorage.setItem("currentUser", JSON.stringify(mockUser));

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ id: 1, name: "Test Property" })
        });

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        // Add property
        fireEvent.click(screen.getByText("Add Property"));

        await waitFor(() => {
            expect(screen.getByTestId("properties-count").textContent).toBe("Properties: 1");
        });

        // Update property
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ id: 1, name: "Updated Property" })
        });

        fireEvent.click(screen.getByText("Update Property"));

        await waitFor(() => {
            expect(screen.getByTestId("property-1").textContent).toBe("Updated Property");
        });

        // Delete property
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: true })
        });

        fireEvent.click(screen.getByText("Delete Property"));

        await waitFor(() => {
            expect(screen.getByTestId("properties-count").textContent).toBe("Properties: 0");
        });
    });

    test("handles localStorage errors", () => {
        // Mock localStorage.setItem to throw an error
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = jest.fn(() => {
            throw new Error("Storage error");
        });

        const mockUser = { id: 1, name: "Test User" };
        
        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        // Restore original localStorage.setItem
        localStorage.setItem = originalSetItem;

        expect(screen.getByTestId("current-user").textContent).toBe("No user");
    });

    test("handles fetch timeout", async () => {
        fetch.mockImplementationOnce(() => new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Request timeout")), 100)
        ));

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Login"));

        await waitFor(() => {
            expect(screen.getByTestId("error").textContent).toBe("Request timeout");
        });
    });

    test("handles malformed JSON response", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.reject(new Error("Invalid JSON"))
        });

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Login"));

        await waitFor(() => {
            expect(screen.getByTestId("error").textContent).toBe("Invalid JSON");
        });
    });

    test("handles network errors during property operations", async () => {
        const mockUser = { id: 1, name: "Test User", properties: [1] };
        localStorage.setItem("currentUser", JSON.stringify(mockUser));

        fetch.mockRejectedValueOnce(new Error("Network error"));

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Update Property"));

        await waitFor(() => {
            expect(screen.getByTestId("error").textContent).toBe("Network error");
        });
    });

    test("handles invalid property data format", async () => {
        const mockUser = { id: 1, name: "Test User", properties: [] };
        localStorage.setItem("currentUser", JSON.stringify(mockUser));

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ invalid: "format" })
        });

        render(
            <DataProvider>
                <TestComponent />
            </DataProvider>
        );

        fireEvent.click(screen.getByText("Add Property"));

        await waitFor(() => {
            expect(screen.getByTestId("error").textContent).toBe("Invalid property data received");
        });
    });
});

