// utils.js
export const filterByPrice = (properties, minPrice, maxPrice) => {
    return properties.filter((property) => {
        // Convert price to a number (support "K" and "M")
        let price = property.price.toUpperCase();
        if (price.includes("K")) {
            price = parseFloat(price.replace("K", "")) * 1000;
        } else if (price.includes("M")) {
            price = parseFloat(price.replace("M", "")) * 1000000;
        } else {
            price = parseFloat(price);
        }

        return price >= minPrice && price <= maxPrice;
    });
};
