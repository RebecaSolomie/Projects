import React, {useState} from "react";
import { useData } from "./DataContext";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Account = () => {
    const { currentUser, properties, logoutUser, deleteProperty } = useData();
    const [isRegistering, setIsRegistering] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    if (!currentUser) {
        return (
            <div className="account">
                <h2>{isRegistering ? "Create Account" : "Login"}</h2>
                {successMessage && <p className="success">{successMessage}</p>}
                {isRegistering ? (
                    <RegisterForm onSuccess={() => {
                        setSuccessMessage("You're all set! Please log in.");
                        setIsRegistering(false);
                    }} />
                ) : (
                    <LoginForm />
                )}
                <button onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? "Back to Login" : "Create an Account"}
                </button>
            </div>
        );
    }

    const userProperties = properties.filter((p) =>
        currentUser.properties.includes(p.id)
    );

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this property?");
        if (confirmDelete) {
            deleteProperty(id);
        }
    };

    return (
        <div className="account">
            <h2>My Account</h2>
            <p><strong>Name:</strong> {currentUser.name}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Phone:</strong> {currentUser.phone}</p>
            <p><strong>Address:</strong> {currentUser.address}</p>
            <button onClick={logoutUser}>Logout</button>

            {/* Add Property Button - Navigates to AddProperty Page */}
            <button onClick={() => navigate("/add-property")}>+ Add Property</button>

            <h3>My Properties</h3>
            {userProperties.length > 0 ? (
                <div className="my-property-list">
                    {userProperties.map((prop) => (
                        <div key={prop.id} className="my-property-card">
                            <img src={prop.img} alt={prop.name} />
                            <h3>{prop.name}</h3>
                            <p>{prop.location}</p>
                            <p>Price: {prop.price}</p>
                            <p>{prop.size} - {prop.bedrooms} Bedrooms</p>
                            <Link to={`/edit-property/${prop.id}`}><button>Edit Info</button></Link>
                            <button onClick={() => handleDelete(prop.id)}>Delete Property</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no listed properties.</p>
            )}
        </div>
    );
};

const RegisterForm = ({ onSuccess }) => {
    const { registerUser, loginUser } = useData();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const user = await registerUser(name, email, phone, address, password);
            if (user) {
                await loginUser(email, password);
                onSuccess();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container">
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

const LoginForm = () => {
    const { loginUser } = useData();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await loginUser(email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container">
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Account;
