import "@testing-library/jest-dom";
import { filterByPrice } from "./utils";

describe("filterByPrice Function", () => {
    const properties = [
        { id: 1, name: "House A", price: "500K" },
        { id: 2, name: "House B", price: "1.2M" },
        { id: 3, name: "House C", price: "300K" },
        { id: 4, name: "House D", price: "2M" },
    ];

    test("filters properties within price range (300K - 1M)", () => {
        const result = filterByPrice(properties, 300000, 1000000);
        expect(result).toEqual([
            { id: 1, name: "House A", price: "500K" },
            { id: 3, name: "House C", price: "300K" },
        ]);
    });

    test("filters properties within price range (1M - 2M)", () => {
        const result = filterByPrice(properties, 1000000, 2000000);
        expect(result).toEqual([
            { id: 2, name: "House B", price: "1.2M" },
            { id: 4, name: "House D", price: "2M" },
        ]);
    });

    test("returns an empty array when no properties match", () => {
        const result = filterByPrice(properties, 5000000, 10000000);
        expect(result).toEqual([]);
    });

    test("returns all properties if minPrice and maxPrice cover all values", () => {
        const result = filterByPrice(properties, 0, 5000000);
        expect(result).toEqual(properties);
    });

    test("handles prices without 'K' or 'M' correctly", () => {
        const customProperties = [
            { id: 5, name: "House E", price: "750000" },
            { id: 6, name: "House F", price: "250000" },
        ];
        const result = filterByPrice(customProperties, 200000, 800000);
        expect(result).toEqual([
            { id: 5, name: "House E", price: "750000" },
            { id: 6, name: "House F", price: "250000" },
        ]);
    });
});
