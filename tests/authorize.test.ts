import { Request, Response, NextFunction } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/errors";

interface MockLocals {
    uid: string;
    role?: string;
}

describe("isAuthorized middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            params: {},
        };
        mockResponse = {
            locals: {},
        };
        nextFunction = jest.fn();
    });

    it("should call next() when user has required role", () => {
        const mockLocals: MockLocals = {
            uid: "user123",
            role: "admin",
        };
        mockResponse.locals = mockLocals;
        const middleware = isAuthorized({ hasRole: ["admin", "manager"] });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction as NextFunction
        );
        expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should pass AuthorizationError to next() when user has insufficient role", () => {
        const mockLocals: MockLocals = {
            uid: "user123",
            role: "officer",
        };
        mockResponse.locals = mockLocals;

        const middleware = isAuthorized({ hasRole: ["admin"] });
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction as NextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthorizationError)
        );
        const error = nextFunction.mock.calls[0][0];
        expect(error.message).toBe("Forbidden: Insufficient role");
        expect(error.code).toBe("INSUFFICIENT_ROLE");
        expect(error.statusCode).toBe(403);
    });

    it("should call next() when same user and allowSameUser is true", () => {
        const userId: string = "user123";
        mockRequest.params = { id: userId };

        const mockLocals: MockLocals = {
            uid: userId,
            role: "officer",
        };
        mockResponse.locals = mockLocals;

        const middleware = isAuthorized({
            hasRole: ["admin"],
            allowSameUser: true,
        });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction as NextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should pass AuthorizationError to next() when role is missing", () => {
        const mockLocals: MockLocals = {
            uid: "user123",
        };
        mockResponse.locals = mockLocals;

        const middleware = isAuthorized({ hasRole: ["admin"] });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction as NextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthorizationError)
        );
        const error = nextFunction.mock.calls[0][0];
        expect(error.message).toBe("Forbidden: No role found");
        expect(error.code).toBe("ROLE_NOT_FOUND");
    });

    it("should not allow same user when allowSameUser is false", () => {
        const userId: string = "user123";
        mockRequest.params = { id: userId };

        const mockLocals: MockLocals = {
            uid: userId,
            role: "officer",
        };
        mockResponse.locals = mockLocals;

        const middleware = isAuthorized({
            hasRole: ["admin"],
            allowSameUser: false,
        });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction as NextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthorizationError)
        );
    });
});