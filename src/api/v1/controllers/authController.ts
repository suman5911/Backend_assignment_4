import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Handles user sign-in using Firebase Authentication REST API.
 * Returns an ID token that can be used for authenticated requests.
 *
 * @param {Request} req - The request object containing email and password.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAgmbX7IIg-IaQlwPHbyluLJqhWiL6FYA0`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true,
                }),
            }
        );

        const data = await response.json();

        res.status(HTTP_STATUS.OK).json({
            idToken: data.idToken,
            email: data.email,
            localId: data.localId,
            expiresIn: data.expiresIn,
            refreshToken: data.refreshToken,
        });
    } catch (error: unknown) {
        next(error);
    }
};