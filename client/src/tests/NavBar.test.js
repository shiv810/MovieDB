import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

jest.mock("@auth0/auth0-react");
// Mocking the useNavigate hook with a Link component
jest.mock('react-router-dom', () => {
    return {
      useNavigate: jest.fn(),
      Link: ({ children, ...rest }) => <a {...rest}>{children}</a>, 
    };
  });
  
// Test: NavBar Component without Auth
describe("NavBar Components: Without Auth", () => {
    const mockLoginWithRedirect = jest.fn();
    const mockLogout = jest.fn();
    const mockNavigate = jest.fn();
    beforeEach(() => {
        // Reset the mocks before each test
        useAuth0.mockReturnValue({
            isAuthenticated: false,
            loginWithRedirect: mockLoginWithRedirect,
            logout: mockLogout,
        });
        useNavigate.mockReturnValue(mockNavigate);
    })

    // Test: Navbar has the logo
    test("NavBar has the logo", () => {
        render(<NavBar />);
        expect(screen.getByText("MovieDB")).toBeInTheDocument();
    });

    // Test: When the user is not authenticated, the Navbar should only have the Home Link and Login Button and the Search Bar and nothing else
    test("When the user is not authenticated, the Navbar should only have the Home Link and Login Button and the Search Bar and nothing else", () => {
        render(<NavBar />);
        //Get Element by Label
        expect(screen.getByLabelText("home")).toBeInTheDocument();
        expect(screen.getByLabelText("loginDesktop")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    // Test: Entering some text in the search bar and submitting it should navigate to the search page with the query
    test("Entering some text in the search bar and submitting it should navigate to the search page with the query", () => {
        render(<NavBar />);
        const searchInput = screen.getByPlaceholderText("Search...");
        fireEvent.change(searchInput, { target: { value: "Avengers" } });
    
        // Get the form element and submit it
        const form = screen.getByLabelText("searchForm");
        fireEvent.submit(form);
    
        // Check navigation
        expect(mockNavigate).toHaveBeenCalledWith("/search/Avengers");
    });
    
    // Test: Clicking the Login button should call loginWithRedirect
    test("Clicking the Login button should call loginWithRedirect", () => {
        render(<NavBar />);
        const loginButton = screen.getByLabelText("loginDesktop");
        fireEvent.click(loginButton);
        expect(useAuth0().loginWithRedirect).toHaveBeenCalled();
    });
});



// Test: NavBar Component with Auth
describe("NavBar Components: With Auth", () => {
    const mockUser = {
        name: "John Doe",
        email: "johndoe@example.com",
        picture: "http://example.com/picture.jpg",
        sub: "auth0|123456",
        email_verified: true,
    };

    const mockLoginWithRedirect = jest.fn();
    const mockLogout = jest.fn();
    const mockNavigate = jest.fn();

    beforeEach(() => {
        // Reset the mocks before each test
        useAuth0.mockReturnValue({
            isAuthenticated: true,
            loginWithRedirect: mockLoginWithRedirect,
            logout: mockLogout,
            user: mockUser,
        });
        useNavigate.mockReturnValue(mockNavigate);
    });

    // Test: When the user is authenticated, the Navbar should have the Home Link, Auth Debugger Link, Search Bar, and the Avatar Button
    test("When the user is authenticated, the Navbar should have the Home Link, Auth Debugger Link, and the Search Bar", () => {
        render(<NavBar user={mockUser}/>);
        expect(screen.getByLabelText("home")).toBeInTheDocument();
        expect(screen.getByLabelText("authDebugger")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
        expect(screen.getByLabelText("profileButtonWeb")).toBeInTheDocument();
    });

    // Test: Clicking the Avatar button should open the menu with profile and logout options.
    test("Clicking the Avatar button should open the profile menu", () => {
        render(<NavBar user={mockUser}/>);
        const avatarButton = screen.getByLabelText("profileButtonWeb");
        fireEvent.click(avatarButton);
        expect(screen.getByLabelText("profileWeb")).toBeInTheDocument();
        expect(screen.getByLabelText("logoutWeb")).toBeInTheDocument();
    });

    // Test: Clicking the Logout button should call logout
    test("Clicking the Logout button should call logout", () => {
        render(<NavBar user={mockUser}/>);
        const avatarButton = screen.getByLabelText("profileButtonWeb");
        fireEvent.click(avatarButton);
        const logoutButton = screen.getByLabelText("logoutWeb");
        fireEvent.click(logoutButton);
        expect(useAuth0().logout).toHaveBeenCalled();
    });
});