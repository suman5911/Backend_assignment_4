import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { ServiceError } from "../errors/errors";
import * as loanService from "../services/loanService";



export const getLoans = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const loans = loanService.getAllLoans();
        res.status(HTTP_STATUS.OK).json({
            message: "Loan applications retrieved",
            count: loans.length,
            data: loans,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const getLoanById = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const id: number = parseInt(req.params.id as string);
        const loan = loanService.getLoanById(id);

        if (!loan) {
            throw new ServiceError(
                "Loan application not found",
                "LOAN_NOT_FOUND",
                HTTP_STATUS.NOT_FOUND
            );
        }


        res.status(HTTP_STATUS.OK).json({
            message: "Loan application retrieved",
            data: loan,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const createLoan = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const { applicant, amount } = req.body;
        const newLoan = loanService.createLoan(applicant, amount);

        res.status(HTTP_STATUS.CREATED).json({
            message: "Loan application created",
            data: newLoan,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const updateLoan = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const id: number = parseInt(req.params.id as string);
        const updatedLoan = loanService.updateLoan(id, req.body);

        if (!updatedLoan) {
            throw new ServiceError(
                "Loan application not found",
                "LOAN_NOT_FOUND",
                HTTP_STATUS.NOT_FOUND
            );
        }


        res.status(HTTP_STATUS.OK).json({
            message: "Loan application updated",
            data: updatedLoan,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const deleteLoan = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const id: number = parseInt(req.params.id as string);
        const deleted: boolean = loanService.deleteLoan(id);

        if (!deleted) {
            throw new ServiceError(
                "Loan application not found",
                "LOAN_NOT_FOUND",
                HTTP_STATUS.NOT_FOUND
            );
        }

        
        res.status(HTTP_STATUS.OK).json({
            message: "Loan application deleted",
        });
    } catch (error: unknown) {
        next(error);
    }
};