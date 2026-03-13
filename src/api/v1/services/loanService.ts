import { LoanApplication, loanApplications } from "../models/loanModel";

export const getAllLoans = (): LoanApplication[] => {
    return loanApplications;
};

export const getLoanById = (id: number): LoanApplication | undefined => {
    return loanApplications.find((l: LoanApplication) => l.id === id);
};

export const createLoan = (
    applicant: string,
    amount: number
): LoanApplication => {
    const newLoan: LoanApplication = {
        id: loanApplications.length + 1,
        applicant,
        amount,
        status: "pending",
        createdAt: new Date().toISOString(),
    };
    loanApplications.push(newLoan);
    return newLoan;
};

export const updateLoan = (
    id: number,
    data: Partial<LoanApplication>
): LoanApplication | undefined => {
    const index: number = loanApplications.findIndex(
        (l: LoanApplication) => l.id === id
    );
    if (index === -1) {
        return undefined;
    }
    loanApplications[index] = {
        ...loanApplications[index],
        ...data,
    };
    return loanApplications[index];
};

export const deleteLoan = (id: number): boolean => {
    const index: number = loanApplications.findIndex(
        (l: LoanApplication) => l.id === id
    );
    if (index === -1) {
        return false;
    }
    loanApplications.splice(index, 1);
    return true;
};